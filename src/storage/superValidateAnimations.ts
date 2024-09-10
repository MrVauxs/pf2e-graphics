import { z } from 'zod';
import { DB_PREFIX as assetDatabasePrefix } from '../assets/assetDb';
import {
	assetDatabasePaths,
	JB2AFreeDatabasePaths,
	JB2APatreonDatabasePaths,
	soundDatabasePaths,
} from '../assets/flatDbs';
import { DB_PREFIX as soundDatabasePrefix } from '../assets/soundDb';
import type { AnimationObject, Predicate, Preset, PresetOptions, Trigger } from './animationsSchema';

type Path = (string | number)[];
class AnimationContext {
	predicates: Set<string>;
	preset?: Preset;
	triggers: Set<Trigger>;
	removes: Set<string>;
	id?: string;
	tieToDocuments: boolean;

	constructor(oldContext?: AnimationContext) {
		const newContext = structuredClone(oldContext);
		this.predicates = newContext?.predicates ?? new Set();
		this.preset = newContext?.preset ?? undefined;
		this.triggers = newContext?.triggers ?? new Set();
		this.removes = newContext?.removes ?? new Set();
		this.id = newContext?.id ?? undefined;
		this.tieToDocuments = newContext?.tieToDocuments ?? false;
	}
}

/**
 * Adds a predicate's roll options to the animation context if and only if those roll options are capable of triggering an animation (for instance, X in "X or Y").
 * @param context The current animation context.
 * @param predicates The array of roll option or predicate objects.
 */
function addPredicates(context: AnimationContext, predicates: Predicate[]) {
	for (const predicate of predicates) {
		if (typeof predicate === 'string') {
			context.predicates.add(predicate);
		} else if ('and' in predicate) {
			addPredicates(context, predicate.and);
		} else if ('or' in predicate) {
			addPredicates(context, predicate.or);
		} else if ('nand' in predicate) {
			addPredicates(context, predicate.nand);
		} else if ('xor' in predicate) {
			addPredicates(context, predicate.xor);
		} else if ('then' in predicate) {
			addPredicates(context, [predicate.then]);
		} else if ('iff' in predicate) {
			addPredicates(context, predicate.iff);
		}
	}
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
	function testDatabasePath(path: Path, str: string, db: 'asset' | 'sound', context?: AnimationContext) {
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

		let database;
		let readableDBName;
		if (db === 'sound') {
			database = soundDatabasePaths;
			readableDBName = soundDatabasePrefix;
		} else {
			if (context?.predicates.has('jb2a:patreon')) {
				database = [...JB2APatreonDatabasePaths, ...assetDatabasePaths];
				readableDBName = `${assetDatabasePrefix} or jb2a_patreon`;
			} else {
				database = [...JB2AFreeDatabasePaths, ...assetDatabasePaths];
				readableDBName = `${assetDatabasePrefix} or JB2A_DnD5e`;
			}
		}

		for (const testPath of pathPermutations) {
			if (!database.some(entry => entry.startsWith(testPath))) {
				return ctx.addIssue({
					code: z.ZodIssueCode.invalid_enum_value,
					path,
					received: testPath,
					options: [],
					message: `Not found in the ${readableDBName} database.`,
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
		// Require persistence predicate so settings are respected.
		if (!context.predicates.has('settings:persistent')) {
			ctx.addIssue({
				code: z.ZodIssueCode.unrecognized_keys,
				path: [...path, 'options', 'persist'],
				keys: ['persist'],
				message: 'The `settings:persistent` predicate is required for persistence.',
			});
		}

		if (!context.tieToDocuments) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: [...path, 'options', 'persist'],
				message: 'Persistence requires the `options.tieToDocument` flag.',
			});
		}

		context.triggers.forEach((trigger) => {
			if (trigger === 'effect' || trigger === 'place-template') {
				// No tests required!
			} else if (trigger === 'toggle') {
				if (context.predicates.has('toggle:delete')) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: [...path, 'options', 'persist'],
						message: 'Persistence cannot be predicated on `toggle:delete`.',
					});
				}
				if (context.predicates.has('toggle:update') && (!context.id || !context.removes.has(context.id))) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: [...path, 'options', 'persist'],
						message: 'Persistence predicated on `toggle:update` must `remove` itself.',
					});
				}
			} else {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: [...path, 'options', 'persist'],
					message: 'Persistence can only be triggered by `effect`, `place-template`, and `toggle`.',
				});
			}
		});
	}

	/**
	 * Test whether `options.preset` is valid given `preset`.
	 * @param path The property path for issue-reporting.
	 * @param preset The type of preset the animation uses.
	 * @param options The options for the preset.
	 */
	function testPreset(path: Path, preset: Preset | undefined, options: PresetOptions) {
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
				|| (preset !== 'ranged' && options.attachTo === true)
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
		if (animation.predicate) addPredicates(context, animation.predicate);
		if (animation.trigger) [animation.trigger].flat().forEach(trigger => context.triggers.add(trigger));
		if (animation.preset) context.preset = animation.preset;
		// end context (more below though...)

		// Validation begin
		if (animation.file) {
			testDatabasePath([...path, 'file'], animation.file, 'asset', context);
		}

		if (animation.options) {
			// Context v2 begin
			if (animation.options.remove)
				[animation.options.remove].flat().forEach(slug => context.removes.add(slug));
			if (animation.options.id) context.id = animation.options.id;
			if (animation.options.tieToDocuments) context.tieToDocuments = animation.options.tieToDocuments;
			// end context (for real this time)

			if (animation.options.persist) testPersistence(path, context);

			if (animation.options.preset) {
				testPreset(path, context.preset, animation.options.preset);

				if (animation.options.preset.bounce) {
					if (animation.options.preset.bounce.file) {
						testDatabasePath(
							[...path, 'options', 'preset', 'bounce', 'file'],
							animation.options.preset.bounce.file,
							'asset',
							context,
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
		}
		// end validation

		// Recursion stuff
		if (animation.contents) {
			for (let i = 0; i < animation.contents.length; i++) {
				testAnimation(animation.contents[i], [...path, 'contents', i], new AnimationContext(context));
			}
		}
	}

	// Do actual test on the `AnimationObject[]`!
	for (let i = 0; i < arr.length; i++) {
		testAnimation(arr[i], [i]);
	}
}
