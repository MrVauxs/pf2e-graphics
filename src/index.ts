import './settings.ts'
import './app.postcss'
import './view/ItemAnimations'
import './storage'

Hooks.on('pf2e.systemReady', () => {
	import('./triggers')
})
