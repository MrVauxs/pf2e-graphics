import type { ActorPF2e, ChatMessagePF2e, TokenDocumentPF2e } from 'foundry-pf2e';
import { devLog, log } from '../utils';

interface modifiersMatterType {
	actorWithDc: ActorPF2e;
	chatMessage: ChatMessagePF2e;
	rollingActor: ActorPF2e;
	significantModifiers: { significance: string; name: string; value: number; appliedTo: string }[];
	targetedToken: TokenDocumentPF2e;
};

function handleModifiersMatter(options: modifiersMatterType, delayed = false) {
	const { actorWithDc, chatMessage, rollingActor, significantModifiers, targetedToken } = options;

	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => handleModifiersMatter(options, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	devLog('Modifiers Matter Hook Data', { actorWithDc, chatMessage, rollingActor, significantModifiers, targetedToken });

	for (const modifier of significantModifiers) {
		const rollOptions = chatMessage.flags.pf2e.context?.options ?? [];

		window.pf2eGraphics.AnimCore.animate({
			rollOptions: rollOptions.concat(`significance:${modifier.significance.toLowerCase()}`),
			trigger: 'modifiers-matter' as const,
			item: chatMessage.item,
			sources: rollingActor.getActiveTokens(),
			actor: rollingActor,
			targets: [targetedToken],
			user: chatMessage.author?.id,
		}, 'Modifiers Matter Animation Data');
	}
}
const modifiersMatter = Hooks.on('modifiersMatter', handleModifiersMatter);

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('modifiersMatter', modifiersMatter);
	});
}
