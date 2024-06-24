import { TJSGameSettings } from '#runtime/svelte/store/fvtt/settings'

export const gameSettings = new TJSGameSettings('pf2e-graphics')

Hooks.on('init', () => {
	gameSettings.registerAll([{
		namespace: 'pf2e-graphics',
		key: 'windowPosition',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.windowPosition.name',
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
	], true)
})
