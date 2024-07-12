import { devMessage } from 'src/utils'

const updateItem = Hooks.on('updateItem', (item: ItemPF2e, _options: { _id: string, system: Partial<ItemPF2e['system']> }, _id: ItemPF2e['id']) => {
	if (!item.actor || !item.system.rules.length) return

	const trigger = 'toggle' as const

	const deliverable = {
		rollOptions: [...item.getRollOptions(), ...item.actor.getRollOptions()],
		trigger,
		source: canvas.tokens.placeables.find(x => x.actor?.id === item.actor?.id),
		item,
	}

	devMessage('Toggle Hook Data', deliverable)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
})

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('updateItem', updateItem)
	})
}
