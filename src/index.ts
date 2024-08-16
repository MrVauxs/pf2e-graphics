import './settings.ts'
import './app.postcss'
import './view'
import './storage'
import './assets/soundDb'

Hooks.once('pf2e.systemReady', () => {
	import('./triggers')
})
