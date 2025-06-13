/* eslint-disable ts/ban-ts-comment */
import { FVTTSidebarControl } from '@typhonjs-fvtt/standard/application/control/sidebar';
import AnimationSidebar from './Sidebar.svelte';

export function setupSidebar() {
	FVTTSidebarControl.add({
		id: 'graphics',
		beforeId: 'cards',
		icon: 'fas fa-films',
		tooltip: 'pf2e-graphics.sidebar.animationSets.tooltip',
		title: 'pf2e-graphics.sidebar.animationSets.title',
		// @ts-ignore Fixed in the next update
		classes: ['flexcol directory pf2e-g'],
		svelte: {
			class: AnimationSidebar,
		},
	});
}
