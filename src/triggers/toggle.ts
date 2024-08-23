import { devMessage } from 'src/utils';

function check(i: ItemPF2e, o: { _id: string; system: any }) {
	const result = {
		bool: false,
		options: [] as string[],
	};

	if (
		i.system.rules.length
		|| i.isOfType('condition')
	) {
		result.bool = true;
	}

	if (o?.system?.equipped?.carryType || o?.system?.equipped?.handsHeld) {
		result.bool = true;
		// @ts-expect-error These do exist.
		if (Number(i.handsHeld) === Number(i.hands.replace('+', ''))) {
			result.options.push(`equipment:wielded`);
		} else {
			result.options.push(`equipment:${o.system.equipped.carryType}`);
		}
	}

	return result;
}

function trifectaFunc(item: ItemPF2e, _options: { _id: string; system: Partial<ItemPF2e['system']> }, _id: ItemPF2e['id']) {
	const { bool, options: newOptions } = check(item, _options);
	// If there is no actor, don't.
	// 	If there are no rules AND no special changes, don't. || If there are either rules or special changes, continue.
	if (!item.actor || !bool) return;

	const deliverable = {
		rollOptions: [...item.getRollOptions(), ...item.actor.getRollOptions(), ...newOptions],
		trigger: 'toggle' as const,
		actor: item.actor,
		item,
	};

	devMessage('Toggle Hook Data', deliverable, _options, newOptions);
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable);
}

const updateItem = Hooks.on('updateItem', trifectaFunc);
const createItem = Hooks.on('createItem', trifectaFunc);
const deleteItem = Hooks.on('deleteItem', trifectaFunc);

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('updateItem', updateItem);
		Hooks.off('createItem', createItem);
		Hooks.off('deleteItem', deleteItem);
	});
}
