import { TJSGameSettings } from '#runtime/svelte/store/fvtt/settings'

export const gameSettings = new TJSGameSettings('pf2e-graphics')

Hooks.on('init', () => {
	gameSettings.registerAll([
		{
			namespace: 'pf2e-graphics',
			key: 'windowPosition',
			folder: 'PF2e Graphics',
			options: {
				name: 'pf2e-graphics.settings.windowPosition.name',
				hint: 'pf2e-graphics.settings.windowPosition.hint',
				scope: 'client',
				config: true,
				type: String,
				default: 'sidebar',
				choices: {
					sidebar: 'pf2e-graphics.settings.windowPosition.sidebar',
					onTop: 'pf2e-graphics.settings.windowPosition.onTop',
				},
			},
		},
		{
			namespace: 'pf2e-graphics',
			key: 'quality',
			folder: 'PF2e Graphics',
			options: {
				name: 'pf2e-graphics.settings.quality.name',
				hint: 'pf2e-graphics.settings.quality.hint',
				scope: 'client',
				config: true,
				type: Number,
				default: 1,
				choices: {
					0: 'pf2e-graphics.settings.quality.0',
					1: 'pf2e-graphics.settings.quality.1',
					2: 'pf2e-graphics.settings.quality.2',
				},
			},
		},
	], true)
})
