import { log } from 'src/utils';

function handler(combatant: CombatantPF2e, _encounter: EncounterPF2e, type: 'start' | 'end', delayed = false) {
	const { actor, token } = combatant;

	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => handler(combatant, _encounter, type, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	if (!token) {
		log(`No token found for the ${type}-turn trigger. Aborting!`);
		return;
	}

	window.pf2eGraphics.AnimCore.animate({
		trigger: `${type}-turn` as const,
		sources: [token],
		rollOptions: (actor?.getRollOptions() || [])
			.flatMap(x => /self:|origin:/.exec(x) ? [x, x.split(':').slice(1).join(':')] : x),
		actor,
	}, `${type.toUpperCase()} Turn Animation Data`);
}

const startTurn = Hooks.on('pf2e.startTurn', (a: CombatantPF2e, b: EncounterPF2e) => handler(a, b, 'start'));
const endTurn = Hooks.on('pf2e.endTurn', (a: CombatantPF2e, b: EncounterPF2e) => handler(a, b, 'end'));

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('pf2e.startTurn', startTurn);
		Hooks.off('pf2e.endTurn', endTurn);
	});
}
