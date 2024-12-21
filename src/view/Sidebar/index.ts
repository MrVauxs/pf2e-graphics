/* eslint-disable ts/ban-ts-comment */
import { FVTTSidebarControl } from '@typhonjs-fvtt/standard/application/control/sidebar';
import AnimationSidebar from './Sidebar.svelte';

Hooks.on('init', () => {
	FVTTSidebarControl.add({
		id: 'graphics',
		beforeId: 'cards',
		icon: 'fas fa-films',
		tooltip: 'pf2e-graphics.sidebar',
		title: 'pf2e-graphics.sidebar',
		// @ts-ignore Fixed in the next update
		classes: ['flexcol directory pf2e-g'],
		svelte: {
			// @ts-ignore Fixed in the next update
			class: AnimationSidebar,
		},
	});

	FVTTSidebarControl.wait().then(() => {
		$('.graphics-sidebar').addClass('flexcol directory pf2e-g');
	});
});

Hooks.once('renderSidebar', () => {
	const noCards = window.pf2eGraphics.liveSettings.cardsGone;
	if (!noCards) return;
	$('.item[data-tab=cards]').addClass('pf2e-g hidden');
});
