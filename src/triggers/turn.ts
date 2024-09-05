import { devMessage, log } from 'src/utils';

function handler(combatant: CombatantPF2e, _encounter: EncounterPF2e, type: 'start' | 'end', delayed = false) {
	const { actor, token } = combatant;

	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => handler(combatant, _encounter, type, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	const deliverable = {
		trigger: `${type}-turn` as const,
		source: token,
		rollOptions: (actor?.getRollOptions() || [])
			.flatMap(x => /self:|origin:/.exec(x) ? [x, x.split(':').slice(1).join(':')] : x),
		actor,
	};

	devMessage(`${type.toUpperCase()} Turn Hook Data`, deliverable);
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable);
}

const start-turn = Hooks.on('pf2e.start-turn', (a: CombatantPF2e, b: EncounterPF2e) => handler(a, b, 'start'));
const endTurn = Hooks.on('pf2e.endTurn', (a: CombatantPF2e, b: EncounterPF2e) => handler(a, b, 'end'));

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('pf2e.start-turn', start-turn);
		Hooks.off('pf2e.endTurn', endTurn);
	});
}
