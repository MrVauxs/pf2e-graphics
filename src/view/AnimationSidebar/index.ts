import { FVTTSidebarControl } from '@typhonjs-fvtt/standard/application/control/sidebar';
import AnimationSidebar from './Sidebar.svelte';

export function setupSidebar() {
	FVTTSidebarControl.add({
		id: 'graphics',
		beforeId: 'cards',
		icon: 'fas fa-films',
		tooltip: 'pf2e-graphics.sidebar.animationSets.tooltip',
		title: 'pf2e-graphics.sidebar.animationSets.title',
		svelte: {
			class: AnimationSidebar,
		},
	});

	FVTTSidebarControl.wait().then(() => {
		$('.graphics-sidebar').addClass('pf2e-g');
	});
}
