import { devMessage } from 'src/utils'

const createItem = Hooks.on('createItem', (item: ItemPF2e, _options, _id: ItemPF2e['id']) => {
	if (!(item.isOfType('effect') || item.isOfType('condition'))) return

	const trigger = 'effect' as const

	const deliverable = {
		rollOptions: item.getRollOptions(),
		trigger,
		source: canvas.tokens.placeables.find(x => x.actor?.id === item.actor?.id),
		item,
	}

	devMessage('Effect Hook Data', deliverable)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
})

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('createItem', createItem)
	})
}
