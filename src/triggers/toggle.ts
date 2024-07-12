import { devMessage } from 'src/utils'
import differenceBy from 'lodash/differenceBy'

const updateItem = Hooks.on('updateItem', (item: ItemPF2e, _options: { _id: string, system: Partial<ItemPF2e['system']> }, _id: ItemPF2e['id']) => {
	if (!item.actor || !item.system.rules.length) return

	function rollOptions(arrays: RuleElementSource[]) {
		function isRollOption(re: RuleElementSource): re is RollOptionSchema {
			return re.key === 'RollOption'
		}
		return arrays
			.filter(isRollOption)
			.filter(x => x.toggleable)
			.map(x => ({ domain: x.domain, key: x.key, option: x.option, value: x.value ?? false }))
	}

	const diff = differenceBy(rollOptions(_options.system.rules ?? []), rollOptions(item.system.rules), 'value')
	const state = diff.length ? 'on' : 'off'
	const trigger = 'toggle' as const

	const deliverable = {
		rollOptions: [...item.getRollOptions(), ...item.actor.getRollOptions()],
		trigger,
		source: canvas.tokens.placeables.find(x => x.actor?.id === item.actor?.id),
		item,
		state,
	}

	devMessage('Toggle Hook Data', deliverable)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable, anim => (anim.options.trigger) === state)
})

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('updateItem', updateItem)
	})
}
