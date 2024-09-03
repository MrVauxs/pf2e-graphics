import { devMessage, log } from 'src/utils';

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
		result.options.push(...i.getRollOptions(i.type));
	}

	if (o?.system?.equipped?.carryType || o?.system?.equipped?.handsHeld) {
		result.bool = true;
		result.options.push(...i.getRollOptions('item'));
		// @ts-expect-error These do exist.
		if (i.system.usage.type === i.system.equipped.carryType && i.system.usage.hands <= i.system.equipped.handsHeld) {
			result.options.push(`equipment:wielded`);
		} else {
			result.options.push(`equipment:${o.system.equipped.carryType}`);
		}
	}

	return result;
}

function trifectaFunc(
	item: ItemPF2e,
	_options: { _id: string; system: Partial<ItemPF2e['system']> },
	action: 'update' | 'create' | 'delete',
	delayed = false,
) {
	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => trifectaFunc(item, _options, action, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	const { bool, options: newOptions } = check(item, _options);
	if (!item.actor || !bool) return;

	const deliverable = {
		rollOptions: [...item.actor.getRollOptions(), ...newOptions, `toggle:${action}`],
		trigger: 'toggle' as const,
		actor: item.actor,
		item,
	};

	devMessage('Toggle Hook Data', deliverable, _options);
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable);
}

const updateItem = Hooks.on('updateItem', (a: ItemPF2e, b: any) => trifectaFunc(a, b, 'update'));
const createItem = Hooks.on('createItem', (a: ItemPF2e, b: any) => trifectaFunc(a, b, 'create'));
const deleteItem = Hooks.on('deleteItem', (a: ItemPF2e, b: any) => trifectaFunc(a, b, 'delete'));

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
