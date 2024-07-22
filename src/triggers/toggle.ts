import { devMessage } from 'src/utils'

function trifectaFunc(item: ItemPF2e, _options: { _id: string, system: Partial<ItemPF2e['system']> }, _id: ItemPF2e['id']) {
	if (!item.actor || !item.system.rules.length) return

	const deliverable = {
		rollOptions: [...item.getRollOptions(), ...item.actor.getRollOptions()].sort(),
		trigger: 'toggle' as const,
		actor: item.actor,
		item,
	}

	devMessage('Toggle Hook Data', deliverable, _options)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
}

const updateItem = Hooks.on('updateItem', trifectaFunc)
const createItem = Hooks.on('createItem', trifectaFunc)
const deleteItem = Hooks.on('deleteItem', trifectaFunc)

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('updateItem', updateItem)
		Hooks.off('createItem', createItem)
		Hooks.off('deleteItem', deleteItem)
	})
}
