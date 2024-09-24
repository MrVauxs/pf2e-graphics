import type { Trigger } from 'src/storage/animationsSchema';
import { devLog, log, nonNullable } from 'src/utils';

function handleChatMessage(message: ChatMessagePF2e, delayed = false) {
	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => handleChatMessage(message, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	const rollOptions = message.flags.pf2e.context?.options ?? [];
	let trigger = message.flags.pf2e.context?.type as (CheckType | Trigger | 'spell-cast') | undefined;
	if (!message.token) {
		log('No token found in the chat message data. This often means there is none on the scene. Aborting.');
		return;
	};

	if (!trigger || trigger === 'spell-cast') {
		if (message?.item?.isOfType('condition') && message.item.slug === 'persistent-damage') {
			trigger = 'damage-roll';
		} else if (
			message.item?.isOfType('action')
			|| message.item?.isOfType('feat')
			|| message.item?.isOfType('spell')
		) {
			trigger = 'action';
		} else {
			log(`No valid message type found (Got "${trigger}"). Aborting.`);
			return;
		}
	}

	const missed = message.flags.pf2e.context?.outcome?.includes('ailure') ?? false;
	const animationOptions = { missed };
	// @ts-expect-error - Too lazy to properly define custom modules flags
	const toolbeltTargets = message.flags?.['pf2e-toolbelt']?.targetHelper?.targets?.map(t => fromUuidSync(t)) as (TokenDocumentPF2e | null)[] | undefined;
	const messageTargets = message.target?.token ? [message.target?.token] : Array.from((message.author as UserPF2e).targets);

	const targets = toolbeltTargets ?? (messageTargets.length ? messageTargets : []);

	// If there is an origin, get the actors token.
	// Otherwise just ~~kill~~ use the messenger.
	const sources = message.flags.pf2e.origin?.actor
		? (fromUuidSync(message.flags.pf2e.origin?.actor) as ActorPF2e).getActiveTokens()
		: [message.token];

	const newOptions = [];

	const outcome = message.flags.pf2e.context?.outcome;
	if (outcome) newOptions.push(`check:outcome:${game.pf2e.system.sluggify(outcome)}`);

	if (trigger === 'saving-throw' || trigger === 'damage-taken') {
		const options = message.token.actor?.getRollOptions().map(x => `target:${x}`);
		if (options) newOptions.push(...options, 'target');
	}

	if (trigger === 'action' || trigger === 'self-effect' || trigger === 'damage-roll') {
		newOptions.push(...message.item?.getRollOptions() ?? []);
	}

	window.pf2eGraphics.AnimCore.animate({
		rollOptions: rollOptions.concat(newOptions),
		trigger,
		sources,
		targets: targets.filter(nonNullable),
		actor: message.actor,
		item: message.item,
		animationOptions,
	}, 'Message Animation Data');
}

const diceSoNiceRollComplete = Hooks.on('diceSoNiceRollComplete', (id: string) => {
	const message = game.messages.get(id);
	if (message) {
		devLog('Dice So Nice Proxy Triggered');
		handleChatMessage(message);
	};
});

const createChatMessage = Hooks.on('createChatMessage', (msg: ChatMessagePF2e) => {
	if (
		!(
			game.modules.get('dice-so-nice')?.active
			&& msg.isRoll
			&& msg.rolls.some(roll => roll.dice.length > 0)
			// TODO: replace above with https://gitlab.com/riccisi/foundryvtt-dice-so-nice/-/issues/450
		)
	) {
		handleChatMessage(msg);
	}
});

const updateChatMessage = Hooks.on('updateChatMessage', (message: ChatMessagePF2e, { flags }: { flags: ChatMessageFlagsPF2e }) => {
	if (!flags) return;
	if ('pf2e-toolbelt' in flags) {
		// @ts-expect-error - Too lazy to properly define custom modules flags
		for (const targetId of Object.keys(flags['pf2e-toolbelt']?.targetHelper?.saves || {})) {
			// @ts-expect-error - Too lazy to properly define custom modules flags
			const roll = flags['pf2e-toolbelt']?.targetHelper?.saves[targetId];
			const target = canvas.tokens.get(targetId);
			roll.roll = JSON.parse(roll.roll);

			devLog('Target Helper saving throw update', { roll, target });

			if (!target) return log('The target token no longer exists?? Aborting.');
			if (!message.token) return log('The source token no longer exists?? Aborting.');

			const rollOptions = message.flags.pf2e.context?.options ?? [];
			const trigger = roll.roll.options.type;
			const animationOptions = { missed: roll?.success };

			window.pf2eGraphics.AnimCore.animate({
				rollOptions,
				trigger,
				targets: [target],
				sources: [message.token],
				item: message.item,
				actor: message.actor,
				animationOptions,
			}, 'Target Helper Hook');
		}
	}
});

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('diceSoNiceRollComplete', diceSoNiceRollComplete);
		Hooks.off('createChatMessage', createChatMessage);
		Hooks.off('updateChatMessage', updateChatMessage);
	});
}
