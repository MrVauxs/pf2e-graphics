import { database as assetDb, DB_PREFIX as assetDbPrefix } from './assetDb';
import { database as soundDb, DB_PREFIX as soundDbPrefix } from './soundDb';

export {
	databasePathsFree as JB2AFreeDatabasePaths,
	databasePathsPatreon as JB2APatreonDatabasePaths,
} from 'jb2a-databases';

type DatabaseValue = string | { [key: string]: unknown };

/**
 * Converts a nested Sequencer database object into a flat array of database paths.
 *
 * @param db The nested database object.
 * @returns An array of dot-separated database paths prepended with the module name (e.g. "graphics-sfx.generic.miss.01").
 */
function getSequencerDBPaths(db: { [key: string]: unknown }, prefix: string): string[] {
	const paths: Set<string> = new Set();
	const followObjectTree = (path: string, value: DatabaseValue): void => {
		if (typeof value === 'string' || Array.isArray(value) || '_flipbook' in value) {
			paths.add(path);
		} else {
			for (const key in value) {
				if (!key.startsWith('_')) followObjectTree(`${path}.${key}`, value[key] as DatabaseValue);
			}
		}
	};
	followObjectTree(prefix, db);
	return Array.from(paths);
}

export const assetDatabasePaths = getSequencerDBPaths(assetDb, assetDbPrefix);
export const soundDatabasePaths = getSequencerDBPaths(soundDb, soundDbPrefix);
