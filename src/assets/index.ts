import { database as soundDb } from './soundDb';
import { database as videoDb } from './assetDb';

Hooks.once('sequencerReady', () => {
	Sequencer.Database.registerEntries('graphics-sfx', soundDb);
	Sequencer.Database.registerEntries('graphics-vfx', videoDb);
});
