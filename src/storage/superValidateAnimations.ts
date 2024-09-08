import {
	databasePathsFree as JB2AFreeDatabasePaths,
	databasePathsPatreon as JB2APatreonDatabasePaths,
} from 'jb2a-databases';
import { z } from 'zod';
import { flatDatabase as soundDatabasePaths } from '../assets/soundDb';
import type { AnimationObject, Preset, PresetOptions, Trigger } from './animationsSchema';

type Path = (string | number)[];
class AnimationContext {
	constructor() {
		this.predicates = new Set();
		this.preset = null;
		this.triggers = new Set();
	}

	predicates: Set<string>;
	preset: Preset | null;
	triggers: Set<Trigger>;
}

/**
 * A big terrible mess of higher-order validations that require context-awareness (e.g. predicate-dependency).
 * @param arr The `AnimationObject[]` animation set for a given roll option.
 * @param ctx Zod refinement context.
 */
export function superValidate(arr: AnimationObject[], ctx: z.RefinementCtx) {
	/**
	 * Tests whether a given Sequencer database path is valid.
	 * @param path The property path for issue-reporting.
	 * @param str The input string.
	 * @param db The database name to be searched.
	 */
	function testDatabasePath(path: Path, str: string, db: 'JB2A_DnD5e' | 'jb2a_patreon' | 'sound') {
		// Don't bother validating actual filepaths
		if (path.includes('/')) return;

		const pathPermutations: string[] = [];

		const openBraceStrings = str.split('{');
		if (openBraceStrings.length === 1) {
			// No moustaches
			pathPermutations.push(str);
		} else {
			// Moustaches present!
			// Check whether each string in `openBraceStrings` has exactly one (1) close-brace which doesn't appear at the start (since that would imply an empty "{}" moustache)
			const matchingBraces = openBraceStrings.map(
				str => (str.match(/\}/g) ?? []).length === 1 && !str.startsWith('}'),
			);
			// We expect the first such string to have no close-braces
			const first = matchingBraces.shift();
			if (first || !matchingBraces.every(Boolean)) {
				return ctx.addIssue({
					code: z.ZodIssueCode.invalid_string,
					path,
					validation: 'regex',
					message: `Mismatched or empty braces.`,
				});
			}

			// Get each permutation of "...{...}..." moustached strings
			const extractPermutations = (str: string): string[] => {
				const openBrace = str.indexOf('{');
				if (openBrace === -1) return [str]; // Necessary due to recursion
				const closeBrace = str.indexOf('}');
				const elements = str.substring(openBrace + 1, closeBrace).split(',');
				return elements
					.map(element =>
						// Necessary due to the possibility of "...{...}...{...}..." double-moustached paths
						extractPermutations(
							`${str.substring(0, openBrace)}${element}${str.substring(closeBrace + 1)}`,
						),
					)
					.flat();
			};
			pathPermutations.push(...extractPermutations(str));
		}

		const database
			= db === 'sound'
				? soundDatabasePaths
				: db === 'jb2a_patreon'
					? JB2APatreonDatabasePaths
					: JB2AFreeDatabasePaths;

		for (const testPath of pathPermutations) {
			if (!database.some(entry => entry.startsWith(testPath))) {
				return ctx.addIssue({
					code: z.ZodIssueCode.invalid_enum_value,
					path,
					received: testPath,
					options: [],
					message: `Not found in the ${db} database.`,
				});
			}
		}
	}

	/**
	 * Test whether `persist` is allowed to exist here.
	 * @param path The property path for issue-reporting.
	 * @param context The animation context.
	 */
	function testPersistence(path: Path, context: AnimationContext) {
		if (!context.predicates.has('settings:persistent')) {
			ctx.addIssue({
				code: z.ZodIssueCode.unrecognized_keys,
				path: [...path, 'options', 'persist'],
				keys: ['persist'],
				message: 'The `settings:persistent` predicate is required for persistence.',
			});
		}
		/**
		 * Check if the triggers is of an acceptable set, i.e. not a trigger that will repeat constantly.
		 * Toggle is only acceptable in two scenarios:
		 * 		1. The toggle is explicitly only when a document is created. Basically same as `effect`.
		 * 		2. The toggle explicitly removes itself with a combination of `id`, `remove`, and `tieToDocuments`.
		 * 			(`toggle:delete` is still unsuitable for persistent animations.)
		 */
		if (
			!context.triggers.isSubsetOf(new Set(['effect', 'place-template', 'toggle']))
			|| (context.triggers.has('toggle') && !context.predicates.has('toggle:create'))
			// || (context.triggers.has('toggle') && !([context.options.remove].flat().includes(context.options.id)) && context.options.tieToDocuments) && (test for if `toggle:delete` would work. It should not.)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: [...path, 'options', 'persist'],
				message:
					'Egregiously triggered persistence: either change the `trigger` or remove the animation\'s persistence.',
			});
		}
	}

	/**
	 * Test whether `options.preset` is valid given `preset`.
	 * @param path The property path for issue-reporting.
	 * @param preset The type of preset the animation uses.
	 * @param options The options for the preset.
	 */
	function testPreset(path: Path, preset: Preset | null, options: PresetOptions) {
		if (!preset) {
			return ctx.addIssue({
				code: z.ZodIssueCode.unrecognized_keys,
				path: [...path, 'options'],
				keys: ['preset'],
				message: '`options.preset` cannot exist without `preset`.',
			});
		}

		if (preset === 'macro') {
			return ctx.addIssue({
				code: z.ZodIssueCode.unrecognized_keys,
				path: [...path, 'options'],
				keys: ['preset'],
				message: '`options.preset` cannot exist while `preset` equals `"macro"`.',
			});
		}

		/** A map of preset types to the `options` properties they permit. `(none)` is used for no properties allowed. */
		const PRESET_OPTIONS_PROPERTIES = {
			template: ['attachTo', 'stretchTo'],
			onToken: ['rotateTowards', 'atLocation', 'location', 'attachTo'],
			melee: ['attachTo', 'rotateTowards'],
			ranged: ['attachTo', 'bounce', 'templateAsOrigin', 'atLocation', 'stretchTo'],
			macro: ['(none)'],
		} as const;

		const illegalProperties = Object.keys(options).filter(
			prop => !PRESET_OPTIONS_PROPERTIES[preset].includes(prop),
		);

		if (illegalProperties.length) {
			return ctx.addIssue({
				code: z.ZodIssueCode.unrecognized_keys,
				keys: illegalProperties,
				message: `Forbidden ${illegalProperties.length === 1 ? 'property' : 'properties'} when \`preset\` is \`"${preset}"\`: \`${illegalProperties.join('`, `')}\`.`,
			});
		}

		if (
			(preset !== 'onToken'
			&& (typeof options.rotateTowards === 'boolean' || typeof options.atLocation === 'boolean'))
			|| (preset !== 'ranged' && typeof options.attachTo === 'boolean')
		) {
			return ctx.addIssue({
				code: z.ZodIssueCode.invalid_type,
				received: 'boolean',
				expected: 'object',
			});
		}
	}

	/**
	 * The primary animation-test function. It steps through the animation-`contents` tree, remembering relevant contextual elements (predominantly predicates). It defers to specific validation functions when relevant.
	 *
	 * Tests:
	 * - Sequencer database paths are tested in the following properties:
	 *   - `file`
	 *   - `options.preset.bounce.file`
	 *   - `options.preset.bounce.sound`
	 *   - `options.sound`
	 * - Persistence is appropriate given settings predicates and animation data.
	 * - Preset options are correct.
	 *
	 * @param animation The animation object itself.
	 * @param path The current property-path to reach the animation in the current object-literal.
	 * @param [context] The unrolled 'context' of the animation, given the characteristics of its enclosing animations (if any). This context is passed down to contained animations.
	 */
	function testAnimation(
		animation: AnimationObject,
		path: Path,
		context: AnimationContext = new AnimationContext(),
	) {
		// Context begin
		if (animation.predicate) {
			animation.predicate.forEach(predicate =>
				typeof predicate === 'string' ? context.predicates.add(predicate) : null,
			);
		}
		if (animation.trigger) {
			if (typeof animation.trigger === 'string') {
				context.triggers.add(animation.trigger);
			} else {
				for (const trigger of animation.trigger) {
					context.triggers.add(trigger);
				}
			}
		}
		if (animation.preset) context.preset = animation.preset;
		// end context

		// Validation begin
		if (animation.file) {
			testDatabasePath(
				[...path, 'file'],
				animation.file,
				context.predicates.has('jb2a:patreon') ? 'jb2a_patreon' : 'JB2A_DnD5e',
			);
		}

		if (animation.options) {
			if (animation.options.persist) testPersistence(path, context);

			if (animation.options.preset) testPreset(path, context.preset, animation.options.preset);

			if (animation.options.sound) {
				if (Array.isArray(animation.options.sound)) {
					for (let i = 0; i < animation.options.sound.length; i++) {
						testDatabasePath(
							[...path, 'options', 'sound', i, 'file'],
							animation.options.sound[i].file,
							'sound',
						);
					}
				} else {
					testDatabasePath([...path, 'options', 'sound', 'file'], animation.options.sound.file, 'sound');
				}
			}

			if (animation.options.preset?.bounce) {
				if (animation.options.preset.bounce.file) {
					testDatabasePath(
						[...path, 'options', 'preset', 'bounce', 'file'],
						animation.options.preset.bounce.file,
						context.predicates.has('jb2a:patreon') ? 'jb2a_patreon' : 'JB2A_DnD5e',
					);
				}

				if (animation.options.preset.bounce.sound) {
					if (Array.isArray(animation.options.preset.bounce.sound)) {
						for (let i = 0; i < animation.options.preset.bounce.sound.length; i++) {
							testDatabasePath(
								[...path, 'options', 'preset', 'bounce', 'sound', i, 'file'],
								animation.options.preset.bounce.sound[i].file,
								'sound',
							);
						}
					} else {
						testDatabasePath(
							[...path, 'options', 'preset', 'bounce', 'sound', 'file'],
							animation.options.preset.bounce.sound.file,
							'sound',
						);
					}
				}
			}
		}
		// end validation

		// Recursion stuff
		if (animation.contents) {
			for (let i = 0; i < animation.contents.length; i++) {
				testAnimation(animation.contents[i], [...path, 'contents', i], structuredClone(context));
			}
		}
	}

	// Do actual test on the `AnimationObject[]`!
	for (let i = 0; i < arr.length; i++) {
		testAnimation(arr[i], [i]);
	}
}
