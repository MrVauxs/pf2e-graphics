import type { TourConfigOptions } from '.';
import type { TourConfig } from '../extensions';

/**
 * An array of `TourConfig`s that define the tours that *PF2e Graphics* adds.
 */
export function generateSeriousTourConfigs(options: TourConfigOptions): TourConfig[] {
	return [
		{
			namespace: 'pf2e-graphics',
			id: 'sidebar',
			title: 'pf2e-graphics.tours.sidebar.title',
			description: 'pf2e-graphics.tours.sidebar.description',
			display: true,
			canBeResumed: true,
			steps: [
				{
					id: '1:intro',
					title: 'pf2e-graphics.tours.sidebar.steps.1:intro.title',
					content: 'pf2e-graphics.tours.sidebar.steps.1:intro.content',
				},
				{
					id: '2:animationSetsTabButton',
					title: 'pf2e-graphics.tours.sidebar.steps.2:animationSetsTabButton.title',
					content: 'pf2e-graphics.tours.sidebar.steps.2:animationSetsTabButton.content',
					selector: 'a[data-tab="graphics"]',
				},
				{
					id: '3:animationSetsTab',
					title: 'pf2e-graphics.tours.sidebar.steps.3:animationSetsTab.title',
					content: 'pf2e-graphics.tours.sidebar.steps.3:animationSetsTab.content',
					selector: '#graphics',
					sidebarTab: 'graphics',
					tooltipDirection: 'LEFT',
				},
				{
					id: '4:bundledAnimationSets',
					title: 'pf2e-graphics.tours.sidebar.steps.4:bundledAnimationSets.title',
					content: 'pf2e-graphics.tours.sidebar.steps.4:bundledAnimationSets.content',
					selector: '#pf2e-graphics-bundled-sets',
					sidebarTab: 'graphics',
					tooltipDirection: 'LEFT',
				},
				{
					id: '5:customAnimationSets',
					title: 'pf2e-graphics.tours.sidebar.steps.5:customAnimationSets.title',
					content: 'pf2e-graphics.tours.sidebar.steps.5:customAnimationSets.content',
					selector: '#pf2e-graphics-custom-sets',
					sidebarTab: 'graphics',
					tooltipDirection: 'LEFT',
				},
				{
					id: '6:animationHistory',
					title: 'pf2e-graphics.tours.sidebar.steps.6:animationHistory.title',
					content: 'pf2e-graphics.tours.sidebar.steps.6:animationHistory.content',
					selector: 'li[data-tool="animationhistory"]',
					layer: 'tokens',
					tool: 'animationhistory',
					tooltipDirection: 'RIGHT',
					restricted: !options.canSeeAnimationHistory,
				},
				{
					id: '7:animationSetsVolumeSlider',
					title: 'pf2e-graphics.tours.sidebar.steps.7:animationSetsVolumeSlider.title',
					content: 'pf2e-graphics.tours.sidebar.steps.7:animationSetsVolumeSlider.content',
					selector: '.playlist-sounds #pf2e-graphics-volume-slider',
					sidebarTab: 'playlists',
					tooltipDirection: 'LEFT',
				},
				{
					id: '8:thanks',
					title: 'pf2e-graphics.tours.sidebar.steps.8:thanks.title',
					content: 'pf2e-graphics.tours.sidebar.steps.8:thanks.content',
				},
			],
		},
		// {
		// 	namespace: 'pf2e-graphics',
		// 	id: 'creationUI',
		// 	title: 'pf2e-graphics.tours.creationUI.title',
		// 	description: 'pf2e-graphics.tours.creationUI.description',
		// 	display: true,
		// 	canBeResumed: true,
		// 	steps: [
		// 		// TODO
		// 	],
		// },
	] as const;
}
