import './settings.ts'
import './app.postcss'
import './view'
import './storage'
import sounds from './assets/soundDb'

Hooks.on('pf2e.systemReady', () => {
	import('./triggers')
})

Hooks.on('sequencerReady', () => {
	Sequencer.Database.registerEntries('pf2e-graphics', sounds)
})
