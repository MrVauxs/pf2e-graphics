import Slider from './Slider.svelte';

const renderTokenConfig = Hooks.on('renderTokenConfig', (document: any, html: JQuery<HTMLElement>) => {
	const ogScale = html[0].getElementsByClassName('size')?.[0];

	if (ogScale) document.pf2eGraphics = new Slider({ target: ogScale, props: { document } });
});

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('renderTokenConfig', renderTokenConfig);
	});
}
