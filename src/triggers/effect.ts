import type { ItemPF2e } from 'foundry-pf2e';
import { log, nonNullable } from '../utils';

function handleEffect(item: ItemPF2e, delayed = false) {
	if (!(item.isOfType('effect') || item.isOfType('condition'))) return;

	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => handleEffect(item, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	const sources = item.actor?.getActiveTokens();
	if (!sources || !sources.length) {
		log('No token found for the Effect trigger. Aborting!');
		return;
	};

	const diffOrigin = item.origin?.id !== item.actor?.id ? item.origin : false;
	const rollOptions = item.getRollOptions(item.type).concat(item.getOriginData().rollOptions || []);

	if (item.flags.pf2e.rulesSelections) {
		const entries = Object.entries(item.flags.pf2e.rulesSelections);
		const RSRollOptions = entries
			.map(([k, v]) =>
				typeof v === 'string' || typeof v === 'number'
					? `effect:rule-selection:${game.pf2e.system.sluggify(k)}:${String(v)}`
					: undefined)
			.filter(nonNullable);

		rollOptions.push(...RSRollOptions);
	}

	if (diffOrigin) rollOptions.push('origin-exists');

	const grantee = Object.entries(item.ownership).filter(x => x[0] !== 'default' && x[1] === 3).map(x => x[0]);

	window.pf2eGraphics.AnimCore.animate({
		rollOptions,
		trigger: 'effect' as const,
		item,
		actor: item.actor,
		sources,
		targets: diffOrigin ? item.origin?.getActiveTokens() : undefined,
		user: grantee.length && grantee.length === 1 ? grantee[0] : undefined,
	}, 'Effect Animation Data');
}

const createItem = Hooks.on('createItem', handleEffect);

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		ui.notifications.info('Updated effects hook!');
		Hooks.off('createItem', createItem);
	});
}
