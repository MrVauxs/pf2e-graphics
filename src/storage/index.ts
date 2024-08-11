import './presets.ts'
import { AnimCore } from './AnimCore.ts'

Object.assign(window, {
	pf2eGraphics: { modules: {}, AnimCore },
	AnimCore,
})

Hooks.on('ready', async () => {
	for (const mod of game.modules) {
		if (!mod.active) continue
		const animations: string | undefined = mod.flags?.['pf2e-graphics'] as unknown as string
		if (!animations) continue
		const path = animations.startsWith('modules/') ? animations : `modules/${mod.id}/${animations}`

		fetch(path)
			.then(resp => resp.json()
				.then((json) => { window.pf2eGraphics.modules[mod.id] = json }))
	}
})

if (import.meta.hot) {
	import.meta.hot.on('updateAnims', (data) => {
		window.pf2eGraphics.modules['pf2e-graphics'] = JSON.parse(data)
		ui.notifications.info('Animations updated!')
	})
	import.meta.hot.on('updateAnimsError', (data) => {
		ui.notifications.error('Animation files contain duplicate keys! Check the console for details.')
		console.error('Duplicate keys: ', data)
	})
	import.meta.hot.accept('./AnimationStorage.ts', (newModule) => {
		if (newModule) {
			window.pf2eGraphics.AnimCore = newModule?.AnimCore
			ui.notifications.info('AnimCore updated!')
		}
	})
}
