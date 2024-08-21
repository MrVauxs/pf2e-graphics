import { devMessage } from 'src/utils';

const modifiersMatter = Hooks.on('modifiersMatter', (
	{ actorWithDc, chatMessage, rollingActor, significantModifiers, targetedToken }: {
		actorWithDc: ActorPF2e;
		chatMessage: ChatMessagePF2e;
		rollingActor: ActorPF2e;
		significantModifiers: { significance: string; name: string; value: number; appliedTo: string }[];
		targetedToken: TokenDocumentPF2e;
	},
) => {
	devMessage('Modifiers Matter Hook Data', { actorWithDc, chatMessage, rollingActor, significantModifiers, targetedToken });

	for (const modifier of significantModifiers) {
		const rollOptions = chatMessage.flags.pf2e.context?.options ?? [];
		const deliverable = {
			rollOptions: rollOptions.concat(`significance:${modifier.significance.toLowerCase()}`),
			trigger: 'modifiers-matter' as const,
			item: chatMessage.item,
			targets: [targetedToken],
		};

		window.pf2eGraphics.AnimCore.findAndAnimate(deliverable);
	}
});

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('modifiersMatter', modifiersMatter);
	});
}
