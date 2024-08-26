import { database } from './soundDb';

Hooks.once('sequencerReady', () => {
	Sequencer.Database.registerEntries('pf2e-graphics', database);
});

if (import.meta.hot) {
	import.meta.hot.accept((module) => {
		if (module?.database) {
			Sequencer.Database.registerEntries('pf2e-graphics', module.database);
		}
	});
}
