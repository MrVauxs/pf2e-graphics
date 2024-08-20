import { devMessage } from 'src/utils'

const createItem = Hooks.on('createItem', (item: ItemPF2e, _options, _id: ItemPF2e['id']) => {
	if (!(item.isOfType('effect') || item.isOfType('condition'))) return

	const diffOrigin = item.origin?.id !== item.actor?.id ? item.origin : false
	const rollOptions = item.getRollOptions()

	const deliverable = {
		rollOptions,
		trigger: 'effect' as const,
		item,
		targets: diffOrigin ? item.origin?.getActiveTokens() : undefined,
	}

	if (diffOrigin) deliverable.rollOptions.push('origin-exists')

	devMessage('Effect Hook Data', deliverable)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
})

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		ui.notifications.info('Updated effects hook!')
		Hooks.off('createItem', createItem)
	})
}
