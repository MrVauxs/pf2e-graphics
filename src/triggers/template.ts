import { devMessage, log } from 'src/utils';

function handleTemplate(template: MeasuredTemplateDocumentPF2e, delayed = false) {
	if (window.pf2eGraphics.liveSettings.delay && !delayed) {
		log(`Delaying animation by ${window.pf2eGraphics.liveSettings.delay} seconds as per settings.`);
		setTimeout(() => handleTemplate(template, true), window.pf2eGraphics.liveSettings.delay * 1000);
		return;
	}

	const { actor, item, message, flags: { pf2e: { origin } } } = template;

	const deliverable = {
		rollOptions: [
			...(origin?.rollOptions ?? []),
			...(message?.actor?.getRollOptions() ?? []),
		].concat([
			`template:${template.t}`,
		] as const),
		trigger: 'place-template' as const,
		targets: [template],
		source: message?.token,
		actor,
		item,
	};

	devMessage('Template Hook Data', deliverable);
	// Timed out because of some bizzare circumstance where coordinates are not delivered on time resulting in a 0,0 position.
	setTimeout(() => window.pf2eGraphics.AnimCore.findAndAnimate(deliverable), 100);
}

const createMeasuredTemplateHook = Hooks.on('createMeasuredTemplate', handleTemplate);

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('createMeasuredTemplate', createMeasuredTemplateHook);
	});
}
