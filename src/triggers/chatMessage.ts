import type {
	ActorPF2e,
	ChatMessagePF2e,
	CheckRoll,
	CheckType,
	DegreeAdjustmentsRecord,
	DegreeOfSuccessString,
	RollNoteSource,
	TokenDocumentPF2e,
	UserPF2e,
} from 'foundry-pf2e';
import type { Trigger } from '../../schema';
import { log, nonNullable } from '../utils';

function handleChatMessage(message: ChatMessagePF2e, delayed = false) {
	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => handleChatMessage(message, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	const rollOptions = message.flags.pf2e.context?.options ?? [];
	let trigger = message.flags.pf2e.context?.type as CheckType | Trigger | 'spell-cast' | undefined;
	if (!message.token) {
		log('No token found in the chat message data. This often means there is none on the scene. Aborting.');
		return;
	}

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

	const toolbeltTargets = message.flags?.['pf2e-toolbelt']?.targetHelper?.targets?.map(
		t => fromUuidSync(t) as TokenDocumentPF2e | null,
	);
	const messageTargets = message.target?.token
		? [message.target?.token]
		: Array.from((message.author as UserPF2e).targets);

	const targets = toolbeltTargets ?? (messageTargets.length ? messageTargets : []);

	// If there is an origin, get the actors token.
	// Otherwise just ~~kill~~ use the messenger.
	const sources = message.flags.pf2e.origin?.actor
		? (fromUuidSync(message.flags.pf2e.origin?.actor) as ActorPF2e).getActiveTokens()
		: [message.token];

	const newOptions = [];

	const outcome = message.flags.pf2e.context?.outcome;
	if (outcome) newOptions.push(`check:outcome:${game.pf2e.system.sluggify(outcome)}`);
	// TODO: Types, Eugh
	const contextualRollOptions = (
		message.flags.pf2e.context as { contextualRollOptions?: { postRoll?: string[] } } | undefined
	)?.contextualRollOptions?.postRoll;
	if (contextualRollOptions) {
		newOptions.push(...contextualRollOptions);
	}

	if (trigger === 'action' || trigger === 'self-effect' || trigger === 'damage-roll') {
		newOptions.push(...(message.item?.getRollOptions() ?? []));
	}

	// showHiddenRolls negates message.blind
	if (!window.pf2eGraphics.liveSettings.showHiddenRolls && message.blind) {
		log('Discarded Animation due to the triggering message being blind.');
		return;
	}

	window.pf2eGraphics.AnimCore.animate(
		{
			rollOptions: rollOptions.concat(newOptions),
			trigger,
			context: message,
			sources,
			targets: targets.filter(nonNullable),
			actor: message.actor,
			item: message.item,
			triggerContext: {
				outcome: outcome ?? undefined,
			},
			user: message.author?.id,
		},
		'Message Animation Data',
	);
}

const diceSoNiceMessageProcessed = Hooks.on(
	'diceSoNiceMessageProcessed',
	async (messageId: string, { willTrigger3DRoll }: { willTrigger3DRoll: boolean }) => {
		if (willTrigger3DRoll) {
			// @ts-expect-error TODO: Dice So Nice types
			await game.dice3d!.waitFor3DAnimationByMessageID(messageId);
		}

		handleChatMessage(game.messages.get(messageId)!);
	},
);

const createChatMessage = Hooks.on('createChatMessage', (msg: ChatMessagePF2e) => {
	if (!game.modules.get('dice-so-nice')?.active) handleChatMessage(msg);
});

interface MessageTargetSave {
	private: boolean;
	value: number;
	die: number;
	success: DegreeOfSuccessString;
	roll: string;
	notes: RollNoteSource[];
	dosAdjustments: DegreeAdjustmentsRecord | undefined;
	unadjustedOutcome?: DegreeOfSuccessString | null;
	modifiers: { label: string; modifier: number }[];
	significantModifiers: any;
	rerolled?: 'hero' | 'new' | 'lower' | 'higher';
}

interface RollSaveHook {
	roll: Rolled<CheckRoll>;
	message: ChatMessagePF2e;
	rollMessage: ChatMessagePF2e;
	target: TokenDocumentPF2e;
	data: MessageTargetSave;
}

const pf2etoolbeltRollSave = Hooks.on('pf2e-toolbelt.rollSave', (args: RollSaveHook) => {
	const {
		rollMessage,
		target,
		roll,
		data: { success },
	} = args;

	const rollOptions: string[] = rollMessage.flags.pf2e.context?.options ?? [];
	const newOptions: string[] = [];
	// TODO: Types, Eugh
	const contextualRollOptions = (
		rollMessage.flags.pf2e.context as { contextualRollOptions?: { postRoll?: string[] } } | undefined
	)?.contextualRollOptions?.postRoll;
	if (contextualRollOptions) {
		newOptions.push(...contextualRollOptions);
	}

	const outcome = rollMessage.flags.pf2e.context?.outcome;
	if (outcome) newOptions.push(`check:outcome:${game.pf2e.system.sluggify(outcome)}`);

	window.pf2eGraphics.AnimCore.animate(
		{
			rollOptions: rollOptions.concat(newOptions),
			trigger: 'saving-throw' as const,
			context: args,
			targets: [target],
			sources: [rollMessage.token!],
			item: rollMessage.item,
			actor: target.actor,
			triggerContext: { outcome: outcome ?? success },
			user: roll.options.rollerId,
		},
		'Target Helper Saving Throw',
	);
});

/*
interface RerollSaveHook {
	oldRoll: Rolled<CheckRoll>;
	newRoll: Rolled<CheckRoll>;
	keptRoll: Rolled<CheckRoll>;
	message: ChatMessagePF2e;
	target: TokenDocumentPF2e;
	data: MessageTargetSave;
}

const pf2etoolbeltRerollSave = Hooks.on('pf2e-toolbelt.rerollSave', (args: RerollSaveHook) => {
	const { message, target, keptRoll, oldRoll, data: { success } } = args;
	if (!message.token) return log('The source token doesn\'t exist. Aborting.');

	// We are mixing damage-roll and saving-throw roll options here... Hmm.
	// TODO: Fix when toolbelt provides options and contextualOptions
	const rollOptions: string[] = [];
	const newOptions = [];
	const options = target.actor?.getRollOptions().map(x => `target:${x}`);
	if (options) newOptions.push(...options, 'target');

	newOptions.push(
		`check:outcome:${success}`,
		`check:total:${keptRoll.total}`,
		`check:oldTotal:${oldRoll.total}`,
	);

	window.pf2eGraphics.AnimCore.animate({
		rollOptions: rollOptions.concat(newOptions),
		trigger: 'saving-throw' as const,
		context: args,
		targets: [target],
		sources: [message.token],
		item: message.item,
		actor: target.actor,
		triggerContext: { outcome: success ?? undefined },
		user: keptRoll.options.rollerId,
	}, 'Target Helper Saving Throw Reroll');
}); */

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('diceSoNiceMessageProcessed', diceSoNiceMessageProcessed);
		Hooks.off('createChatMessage', createChatMessage);
		Hooks.off('pf2e-toolbelt.rollSave', pf2etoolbeltRollSave);
		// Hooks.off('pf2e-toolbelt.rerollSave', pf2etoolbeltRerollSave);
	});
}
