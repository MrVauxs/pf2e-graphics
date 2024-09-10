import { database as videoDb } from './assetDb';
import { database as soundDb } from './soundDb';

Hooks.once('sequencerReady', () => {
	Sequencer.Database.registerEntries('graphics-sfx', soundDb);
	Sequencer.Database.registerEntries('graphics-vfx', videoDb);
});
