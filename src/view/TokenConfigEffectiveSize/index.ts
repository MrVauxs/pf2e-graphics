import { mount } from 'svelte';
import Slider from './Slider.svelte';

const renderTokenConfig = Hooks.on('renderTokenConfig', (document: any, html: HTMLElement) => {
	const ogScale = html.getElementsByClassName('size')?.[0];

	if (ogScale) document.pf2eGraphics = mount(Slider, { target: ogScale, props: { document } });
});

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('renderTokenConfig', renderTokenConfig);
	});
}
