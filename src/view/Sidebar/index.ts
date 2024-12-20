import { FVTTSidebarControl } from '@typhonjs-fvtt/standard/application/control/sidebar';
import AnimationSidebar from './Sidebar.svelte';

Hooks.on('init', () => {
	FVTTSidebarControl.add({
		id: 'pf2e-graphics',
		beforeId: 'cards',
		icon: 'fas fa-films',
		tooltip: 'pf2e-graphics.sidebar',
		title: 'pf2e-graphics.sidebar',
		svelte: {
			class: AnimationSidebar,
		},
	});
});

Hooks.once('renderSidebar', () => {
	const noCards = window.pf2eGraphics.liveSettings.cardsGone;
	if (!noCards) return;
	$('.item[data-tab=cards]').addClass('pf2e-g hidden');
});
