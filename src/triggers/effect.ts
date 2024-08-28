import { devMessage, log } from 'src/utils';

function handleEffect(item: ItemPF2e, delayed = false) {
	if (!(item.isOfType('effect') || item.isOfType('condition'))) return;

	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => handleEffect(item, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	const diffOrigin = item.origin?.id !== item.actor?.id ? item.origin : false;
	const rollOptions = item.getRollOptions(item.type);

	if (item.flags.pf2e.rulesSelections) {
		rollOptions.push(
			...Object.keys(item.flags.pf2e.rulesSelections)
				.map(k => `effect:rulesSelections:${k}:${JSON.stringify(item.flags.pf2e.rulesSelections[k])}`),
		);
	}

	const deliverable = {
		rollOptions,
		trigger: 'effect' as const,
		item,
		targets: diffOrigin ? item.origin?.getActiveTokens() : undefined,
	};

	if (diffOrigin) deliverable.rollOptions.push('origin-exists');

	devMessage('Effect Hook Data', deliverable);
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable);
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
