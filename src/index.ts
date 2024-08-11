import './settings.ts'
import './app.postcss'
import './view'
import './storage'
import sounds from './assets/soundDb'

Hooks.once('pf2e.systemReady', () => {
	import('./triggers')
})

Hooks.once('sequencerReady', () => {
	Sequencer.Database.registerEntries('pf2e-graphics', sounds)
})
