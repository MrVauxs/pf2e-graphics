import './settings.ts'
import './app.postcss'
import './view'
import './storage'

Hooks.on('pf2e.systemReady', () => {
	import('./triggers')
})
