import { DB_PREFIX as videoDbPrefix, database as videoDb } from './assetDb';
import { DB_PREFIX as soundDbPrefix, database as soundDb } from './soundDb';

Hooks.once('sequencerReady', () => {
	Sequencer.Database.registerEntries(soundDbPrefix, soundDb);
	Sequencer.Database.registerEntries(videoDbPrefix, videoDb);
});
