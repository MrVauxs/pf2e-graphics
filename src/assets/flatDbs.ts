import { database as assetDb, DB_PREFIX as assetDbPrefix } from './assetDb';
import { database as soundDb, DB_PREFIX as soundDbPrefix } from './soundDb';

export {
	databasePathsFree as JB2AFreeDatabasePaths,
	databasePathsPatreon as JB2APatreonDatabasePaths,
} from 'jb2a-databases';

export type JSONValue = boolean | number | string | { [key: string]: JSONValue } | Array<JSONValue> | undefined | null;

const unwantedSequencerMetadata = new Set([
	'_template',
	'_templates',
	'_markers',
	'_timeRange',
	'_timestamps',
	'_flipbook',
	'_metadata',
]);

/**
 * Converts a nested Sequencer database object into a flat array of database paths.
 *
 * @param obj The object whose paths are to be mapped.
 * @param path The current path through `obj`.
 * @param recursionDepth A recursion-tracker that should not be initialised by external use.
 * @returns An array of dot-separated database paths (e.g. "graphics-sfx.generic.miss.01").
 */
function getObjectPaths(obj: JSONValue, path: string[] = [], recursionDepth = 0) {
	if (recursionDepth > 100) throw new Error('Maximum depth exceeded');

	const paths: Set<string> = new Set();

	if (typeof obj === 'string') {
		addPath(paths, path.join('.'));
	} else if (Array.isArray(obj)) {
		/** Un-comment the below if padding is ever required */
		// const maxDigits = Math.max(2, obj.length.toString().length);
		for (let i = 0; i < obj.length; i++) {
			// const iPadded = String(i).padStart(maxDigits, "0");
			// addPath(paths, [...path, iPadded].join("."));
			addPath(paths, [...path, i].join('.'));
		}
	} else if (typeof obj === 'object' && obj !== null) {
		for (const key in obj) {
			if (key === 'file') {
				addPath(paths, [...path, key].join('.'));
			} else if (!unwantedSequencerMetadata.has(key)) {
				getObjectPaths(obj[key], [...path, key], recursionDepth + 1).forEach(newPath =>
					addPath(paths, newPath),
				);
			}
		}
	} else {
		throw new Error(`Unhandled type at ${path.join('.')}`);
	}

	return paths;
}

function addPath(paths: Set<string>, newPath: string) {
	if (paths.has(newPath)) throw new Error(`Duplicate Sequencer path found at ${newPath}`);
	return paths.add(newPath);
}

export const assetDatabasePaths = Array.from(getObjectPaths(assetDb, [assetDbPrefix]));
export const soundDatabasePaths = Array.from(getObjectPaths(soundDb, [soundDbPrefix]));
