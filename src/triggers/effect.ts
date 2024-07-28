import { devMessage } from 'src/utils'

const createItem = Hooks.on('createItem', (item: ItemPF2e, _options, _id: ItemPF2e['id']) => {
	if (!(item.isOfType('effect') || item.isOfType('condition'))) return

	const deliverable = {
		rollOptions: item.getRollOptions(),
		trigger: 'effect' as const,
		item,
	}

	devMessage('Effect Hook Data', deliverable, _options)
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
