import * as fs from 'node:fs';
import { type AnimationObject, type Animations, validateAnimationData } from '../src/storage/animationsSchema.ts';
import { type fileValidationResult, pluralise, safeJSONParse, testFilesRecursively } from './helpers.ts';

/**
 * Tests animation JSONs, and then returns a merged object along with any valiation errors encountered.
 *
 * @param targetPath - The path of the animation JSON(s). If the path is a directory, all files within it recursively are tested and merged.
 * @returns An object.
 */
export function testAndMergeAnimations(
	targetPath: string,
): { success: true; data: Animations } | { success: false; data?: Animations; issues: fileValidationResult[] } {
	const referenceTracker = new (class ReferenceTracker extends Map<string, Set<string>> {
		constructor() {
			super();
		}

		private addPending(rollOption: string, file: string): void {
			if (this.has(rollOption)) {
				this.get(rollOption)!.add(file);
			} else {
				this.set(rollOption, new Set([file]));
			}
		}

		populate(file: string, value: string | AnimationObject[]): void {
			if (typeof value === 'string') {
				this.addPending(value, file);
			} else {
				for (const obj of value) {
					if (obj.reference) this.addPending(obj.reference, file);
					for (const override of obj.overrides ?? []) {
						this.addPending(override, file);
					}
				}
			}
		}
	})();
	const mergedAnimations: Map<string, string | AnimationObject[]> = new Map();

	const results = testFilesRecursively(
		targetPath,
		{
			'.json': (path) => {
				// Test filename
				if (path.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
					return { success: false, message: 'Invalid filename.' };

				// Test readability
				const file = safeJSONParse(fs.readFileSync(path, { encoding: 'utf8' }));
				if (!file.success) return { success: false, message: 'Invalid JSON syntax.' };

				// Validate schema
				const schemaResult = validateAnimationData(file.data);
				if (!schemaResult.success) {
					return {
						success: false,
						message: `${schemaResult.error.issues.length} schema ${pluralise('issue', schemaResult.error.issues.length)}`,
						issues: schemaResult.error.issues,
					};
				}

				// We know the type of `file.json` because otherwise the schema validation above would have returned early.
				const animations = file.data as { [key: string]: string | AnimationObject[] };
				for (const key in animations) {
					// Test for duplicate keys
					if (mergedAnimations.has(key)) {
						return {
							success: false,
							message: `Animation assigned elsewhere to roll option ${key}`,
						};
					}
					mergedAnimations.set(key, animations[key]);

					// Populate referenced rollOptions for validation afterwards
					referenceTracker.populate(path, animations[key]);
				}

				return { success: true };
			},
			'default': false,
		},
		{ ignoreGit: true },
	);

	const issues = results.filter(result => !result.success);

	// Test references
	referenceTracker.forEach((files, rollOption) => {
		if (!mergedAnimations.has(rollOption)) {
			files.forEach(file =>
				issues.push({
					file,
					success: false,
					message: `Could not find referenced roll option ${rollOption}`,
				}),
			);
		}
	});

	const data = mergedAnimations.size ? Object.fromEntries(mergedAnimations) : undefined;

	if (issues.length) return { success: false, data, issues };
	return { success: true, data: data! };
}
