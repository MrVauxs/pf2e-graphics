import { FVTTSidebarControl } from '@typhonjs-fvtt/standard/application/control/sidebar';
import { trlDuckTypedComponent } from 'src/shims/trlComponent';
import AnimationSidebar from './Sidebar.svelte';

export function initSidebar() {
	FVTTSidebarControl.add({
		id: 'graphics',
		beforeId: 'cards',
		icon: 'fas fa-films',
		tooltip: 'pf2e-graphics.sidebar.animationSets.tooltip',
		title: 'pf2e-graphics.sidebar.animationSets.title',
		// Unlike `SvelteApp`, which instantiates its shell from JavaScript with `new` (hence
		// `trlComponent()`), `FVTTSidebarControl` renders this through `<svelte:component>` inside
		// `FVTTSidebarWrapper.svelte`. That call site uses the plain Svelte 5 component signature,
		// so the component must stay callable — see `trlDuckTypedComponent`.
		svelte: {
			class: trlDuckTypedComponent(AnimationSidebar),
		},
	});

	// `FVTTSidebarWrapper.svelte` already applies `directory flexcol` to the section itself, so only
	// the module's own styling hook needs adding here.
	FVTTSidebarControl.wait().then(() => {
		$('.graphics-sidebar').addClass('pf2e-g');
	});
}

Hooks.once('renderSidebar', () => {
	const noCards = window.pf2eGraphics.liveSettings.cardsGone;
	if (!noCards) return;
	// The v12 sidebar wrapped each tab in `li.item`; v13+ renders the tab as a bare `<button>` in
	// the sidebar nav, so the old `.item[data-tab=cards]` selector silently matched nothing.
	document.querySelectorAll('#sidebar [data-tab="cards"]').forEach(el => el.classList.add('pf2e-g', 'hidden'));
});
