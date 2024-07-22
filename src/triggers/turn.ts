import { devMessage } from 'src/utils'

function handler({ actor, token }: CombatantPF2e, _encounter: EncounterPF2e, type: 'start' | 'end') {
	const deliverable = {
		trigger: `${type}Turn` as const,
		source: token,
		rollOptions: actor?.getRollOptions() || [],
		actor,
	}

	devMessage(`${type.toUpperCase()} Turn Hook Data`, deliverable)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
}

const startTurn = Hooks.on('pf2e.startTurn', (a: CombatantPF2e, b: EncounterPF2e) => handler(a, b, 'start'))
const endTurn = Hooks.on('pf2e.endTurn', (a: CombatantPF2e, b: EncounterPF2e) => handler(a, b, 'end'))

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('pf2e.startTurn', startTurn)
		Hooks.off('pf2e.endTurn', endTurn)
	})
}
