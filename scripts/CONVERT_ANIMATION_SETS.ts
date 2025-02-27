import type { AnimationSet, AnimationSetContentsItem, AnimationSetsObject, PayloadType } from '../schema';
import * as fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { getFilesRecursively } from './helpers';

// #region Old schema
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'String must be a valid slug.');

const rollOption = z
	.string()
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*(?::[a-z0-9]+(?:-[a-z0-9]+)*)*(?::-?\d+)?$/,
		'String must be a valid roll option.',
	);

type Predicate =
	| string
	| { eq: [string, string | number] }
	| { gt: [string, string | number] }
	| { gte: [string, string | number] }
	| { lt: [string, string | number] }
	| { lte: [string, string | number] }
	| { and: Predicate[] }
	| { or: Predicate[] }
	| { xor: Predicate[] }
	| { not: Predicate }
	| { nand: Predicate[] }
	| { nor: Predicate[] }
	| { if: Predicate; then: Predicate }
	| { iff: Predicate[] };
const predicate: z.ZodType<Predicate> = z.union([
	rollOption,
	z.object({ eq: z.tuple([rollOption, rollOption.or(z.number())]) }).strict(),
	z.object({ gt: z.tuple([rollOption, rollOption.or(z.number())]) }).strict(),
	z.object({ gte: z.tuple([rollOption, rollOption.or(z.number())]) }).strict(),
	z.object({ lt: z.tuple([rollOption, rollOption.or(z.number())]) }).strict(),
	z.object({ lte: z.tuple([rollOption, rollOption.or(z.number())]) }).strict(),
	z
		.object({
			and: z.lazy(() => z.array(predicate).min(1)),
		})
		.strict(),
	z
		.object({
			or: z.lazy(() => z.array(predicate).min(1)),
		})
		.strict(),
	z
		.object({
			xor: z.lazy(() => z.array(predicate).min(1)),
		})
		.strict(),
	z.object({ not: z.lazy(() => predicate) }).strict(),
	z
		.object({
			nand: z.lazy(() => z.array(predicate).min(1)),
		})
		.strict(),
	z
		.object({
			nor: z.lazy(() => z.array(predicate).min(1)),
		})
		.strict(),
	z.object({ if: z.lazy(() => predicate), then: z.lazy(() => predicate) }).strict(),
	z
		.object({
			iff: z.lazy(() => z.array(predicate).min(1)),
		})
		.strict(),
]);

const hexColour = z
	.string()
	.regex(/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i, 'String must be a valid hexadecimal colour-code.');

const angle = z.number().gt(-180).lte(180);

const filePath = z
	.string()
	.regex(
		/^\w[^":<>?\\|/]+(?:\/[^":<>?\\|/]+)+\.\w\w\w\w?$/,
		'String must be a valid filepath. The following characters are unsafe for cross-platform filesystems: ":<>?\\|',
	);

const sequencerDBEntry = z
	.string()
	.regex(/^\w[\w-]+(?:\.(?:[\w-]+|\{\w+(?:,[^{},]+)+\}))+$/, 'String must be a valid Sequencer database entry.');

const vector2 = z
	.object({
		x: z.number().optional(),
		y: z.number().optional(),
	})
	.strict();

const offset = z
	.object({
		x: z
			.number()
			.or(
				z
					.tuple([z.number(), z.number()])
					.refine(arr => arr[0] !== arr[1], 'Offset range cannot be zero.'),
			)
			.optional(),
		y: z
			.number()
			.or(
				z
					.tuple([z.number(), z.number()])
					.refine(arr => arr[0] !== arr[1], 'Offset range cannot be zero.'),
			)
			.optional(),
	})
	.strict()
	.refine(obj => obj.x || obj.y, 'At least one offset dimension (`x` or `y`) must be specified.');
type Offset = z.infer<typeof offset>;

const soundEffect = z
	.object({
		type: z.enum(['lowpass', 'highpass', 'reverb']),
		intensity: z.number().positive(),
	})
	.strict();
const soundData = z
	.object({
		file: sequencerDBEntry.or(filePath),
		waitUntilFinished: z.number().optional(),
		atLocation: z
			.object({
				cacheLocation: z.literal(true).optional(),
				offset: offset.optional(),
				randomOffset: z.number().optional(),
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
			.optional(),
		radius: z.number().positive().optional(),
		volume: z.number().positive().optional(),
		duration: z.number().positive().optional(),
		constrainedByWalls: z.literal(true).optional(),
		predicate: z.array(predicate).min(1).optional(),
		default: z.literal(true).optional(),
		delay: z.number().optional(),
		muffledEffect: soundEffect.optional(),
		baseEffect: soundEffect.optional(),
	})
	.strict();
const soundConfig = soundData.or(z.array(soundData).min(1));

const presetOptions = z
	.object({
		attachTo: z.literal(true).or(
			z
				.object({
					align: z
						.enum([
							'top-left',
							'top',
							'top-right',
							'left',
							'right',
							'bottom-left',
							'bottom',
							'bottom-right',
						])
						.optional(),
					edge: z.enum(['inner', 'outer']).optional(),
					bindVisibility: z.literal(true).optional(),
					bindAlpha: z.literal(true).optional(),
					bindScale: z.literal(true).optional(),
					bindElevation: z.literal(true).optional(),
					followRotation: z.literal(true).optional(),
					offset: offset.optional(),
					randomOffset: z.number().optional(),
					gridUnits: z.literal(true).optional(),
					local: z.literal(true).optional(),
				})
				.strict()
				.optional(),
		),
		atLocation: z.literal(true).or(
			z
				.object({
					cacheLocation: z.literal(true).optional(),
					offset: offset.optional(),
					randomOffset: z.number().optional(),
					gridUnits: z.literal(true).optional(),
					local: z.literal(true).optional(),
				})
				.strict()
				.optional(),
		),
		bounce: z
			.object({
				file: sequencerDBEntry.or(filePath),
				sound: soundConfig.optional(),
			})
			.strict()
			.optional(),
		location: z.enum(['target', 'source', 'both']).optional(),
		rotateTowards: z.literal(true).or(
			z
				.object({
					rotationOffset: z.number().optional(),
					cacheLocation: z.literal(true).optional(),
					attachTo: z.literal(true).optional(),
					offset: offset.optional(),
					randomOffset: z.number().optional(),
					gridUnits: z.literal(true).optional(),
					local: z.literal(true).optional(),
				})
				.strict()
				.optional(),
		),
		stretchTo: z
			.object({
				cacheLocation: z.literal(true).optional(),
				attachTo: z.literal(true).optional(),
				onlyX: z.literal(true).optional(),
				tiling: z.literal(true).optional(),
				offset: offset.optional(),
				randomOffset: z.number().optional(),
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
				requiresLineOfSight: z.literal(true).optional(),
				hideLineOfSight: z.literal(true).optional(),
			})
			.strict()
			.optional(),
		templateAsOrigin: z.literal(true).optional(),
		targets: z.array(z.string()).optional(),
	})
	.strict();

const ease = z.enum([
	'easeInBack',
	'easeInBounce',
	'easeInCirc',
	'easeInCubic',
	'easeInElastic',
	'easeInExpo',
	'easeInOutBack',
	'easeInOutBounce',
	'easeInOutCirc',
	'easeInOutCubic',
	'easeInOutElastic',
	'easeInOutExpo',
	'easeInOutQuad',
	'easeInOutQuart',
	'easeInOutQuint',
	'easeInOutSine',
	'easeInQuad',
	'easeInQuart',
	'easeInQuint',
	'easeInSine',
	'easeOutBack',
	'easeOutBounce',
	'easeOutCirc',
	'easeOutCubic',
	'easeOutElastic',
	'easeOutExpo',
	'easeOutQuad',
	'easeOutQuart',
	'easeOutQuint',
	'easeOutSine',
]);

const easingOptions = z
	.object({
		ease: ease.optional(),
		delay: z.number().positive().optional(),
	})
	.strict();

const shape = z
	.object({
		type: z.enum(['polygon', 'rectangle', 'circle', 'ellipse', 'roundedRect']),
		radius: z.number().positive().optional(),
		width: z.number().positive().optional(),
		height: z.number().positive().optional(),
		points: z
			.array(z.tuple([z.number(), z.number()]).or(vector2))
			.min(1)
			.optional(),
		gridUnits: z.literal(true).optional(),
		name: z.string().optional(),
		fillColor: hexColour.or(z.number()).optional(),
		fillAlpha: z.number().positive().optional(),
		alpha: z.number().positive().optional(),
		lineSize: z.number().positive().optional(),
		lineColor: hexColour.or(z.number()).optional(),
		offset: z
			.object({
				x: z.number().optional(),
				y: z.number().optional(),
				gridUnits: z.literal(true).optional(),
			})
			.strict()
			.optional(),
		isMask: z.literal(true).optional(),
	})
	.strict();

const effectOptions = z
	.object({
		addon: z.object({ order: z.string() }).optional(),
		sound: soundConfig.optional(),
		preset: presetOptions.optional(),
		locally: z.literal(true).optional(),
		id: slug.min(6, 'Animation IDs should be reasonably unique.').optional(),
		name: z.string().min(1).optional(),
		syncGroup: z.string().optional(),
		randomRotation: z.literal(true).optional(),
		randomizeMirrorX: z.literal(true).optional(),
		randomizeMirrorY: z.literal(true).optional(),
		mirrorX: z.literal(true).optional(),
		mirrorY: z.literal(true).optional(),
		remove: slug.or(z.array(slug).min(1)).optional(),
		tieToDocuments: z.literal(true).optional(),
		belowTokens: z.literal(true).optional(),
		waitUntilFinished: z.number().optional(),
		zIndex: z.number().optional(),
		duration: z
			.number()
			.describe('The duration of the animationDataObject in milliseconds.')
			.positive()
			.optional(),
		tint: hexColour
			.describe('A hexadecimal colour code to give the animationDataObject a certain tint.')
			.optional(),
		rotate: angle.describe('An angle in degrees (°) to rotate the animationDataObject.').optional(),
		opacity: z.number().describe('An opacity scaler from 0 to 1 (exclusive).').positive().lt(1).optional(),
		mask: z.literal(true).optional(),
		fadeIn: z
			.number()
			.or(easingOptions.extend({ value: z.number() }).strict())
			.optional(),
		fadeOut: z
			.number()
			.or(easingOptions.extend({ value: z.number() }).strict())
			.optional(),
		wait: z
			.number()
			.or(
				z
					.object({
						min: z.number(),
						max: z.number().optional(),
					})
					.strict(),
			)
			.optional(),
		delay: z
			.number()
			.or(
				z
					.object({
						min: z.number(),
						max: z.number().optional(),
					})
					.strict(),
			)
			.optional(),
		size: z
			.number()
			.or(
				z
					.object({
						value: z.number().positive(),
						gridUnits: z.literal(true).optional(),
					})
					.strict(),
			)
			.optional(),
		spriteRotation: angle.optional(),
		scale: z
			.number()
			.or(
				z
					.object({
						min: z.number().or(z.object({ x: z.number(), y: z.number() })),
						max: z.number().optional(),
					})
					.strict(),
			)
			.optional(),
		scaleToObject: z
			.number()
			.or(
				z
					.object({
						value: z.number().positive(),
						uniform: z.literal(true).optional(),
						considerTokenScale: z.literal(true).optional(),
					})
					.strict(),
			)
			.optional(),
		spriteOffset: z
			.object({
				offset,
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
			.optional(),
		persist: z
			.literal(true)
			.or(
				z
					.object({
						value: z.literal(true).optional(),
						persistTokenPrototype: z.literal(true).optional(),
					})
					.strict(),
			)
			.optional(),
		repeats: z
			.number()
			.min(1)
			.int()
			.or(
				z
					.object({
						count: z.number().min(1),
						delayMin: z.number().optional(),
						delayMax: z.number().positive().optional(),
					})
					.strict()
					.refine(
						obj => (obj.delayMax ? obj.delayMin || obj.delayMin === 0 : true),
						'`delayMin` is required if `delayMax` is defined.',
					)
					.refine(
						obj => (obj.delayMax ? obj.delayMax > obj.delayMin! : true),
						'`delayMax` must be greater than `delayMin`.',
					),
			)
			.optional(),
		moveTowards: easingOptions
			.extend({
				target: vector2.or(z.string()), // Also allows VisibleFoundryTypes but those aren't encodable in JSON
			})
			.strict()
			.optional(),
		filter: z
			.discriminatedUnion('type', [
				z
					.object({
						type: z.literal('ColorMatrix'),
						options: z
							.object({
								hue: angle.describe('The hue, in degrees.').optional(),
								brightness: z
									.number()
									.describe('The value of the brightness (0 to 1, where 0 is black).')
									.optional(),
								contrast: z.number().describe('The value of the contrast (0 to 1).').optional(),
								saturate: z
									.number()
									.describe(
										'The value of the saturation amount. Negative numbers cause it to become desaturated (−1 to 1)',
									)
									.optional(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						type: z.literal('Glow'),
						options: z
							.object({
								distance: z
									.number()
									.positive()
									.describe('The distance of the glow, in pixels.')
									.optional(),
								outerStrength: z
									.number()
									.positive()
									.describe('The strength of the glow outward from the edge of the sprite.')
									.optional(),
								innerStrength: z
									.number()
									.positive()
									.describe('The strength of the glow inward from the edge of the sprite.')
									.optional(),
								color: hexColour.describe('The color of the glow').optional(),
								quality: z
									.number()
									.gte(0)
									.lte(1)
									.describe(
										'Describes the quality of the glow (0 to 1). A higher number is less performant.',
									)
									.optional(),
								knockout: z
									.literal(true)
									.describe(
										'Toggle to hide the contents and only show the glow (effectively hides the sprite).',
									)
									.optional(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						type: z.literal('Blur'),
						options: z
							.object({
								strength: z.number().positive().describe('The strength of the filter.').optional(),
								blur: z
									.number()
									.positive()
									.describe(
										'Sets the strength of the blur in both the horizontal and vertical axes simultaneously.',
									)
									.optional(),
								blurX: z
									.number()
									.positive()
									.describe('The strength of the blur on the horizontal axis.')
									.optional(),
								blurY: z
									.number()
									.positive()
									.describe('The strength of the blur on the vertical axis.')
									.optional(),
								quality: z.number().int().positive().describe('Quality of the filter.').optional(),
								resolution: z
									.number()
									.positive()
									.describe('Sets the resolution of the blur filter.')
									.optional(),
								kernelSize: z
									.number()
									.positive()
									.int()
									.describe('Effectively how many passes the blur goes through.')
									.optional(),
							})
							.strict()
							.refine(options => !options.blur || (!options.blurX && !options.blurY), {
								path: ['blur'],
								message: '`blur` cannot be used at the same time as `blurX` or `blurY`.',
							}),
					})
					.strict(),
				z
					.object({
						type: z.literal('Noise'),
						options: z
							.object({
								noise: z.number().gt(0).lte(1).describe('The noise intensity.').optional(),
								seed: z
									.number()
									.describe(
										'A random seed for the noise generation (default is `Math.random()`).',
									)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						type: z.literal('Clip'),
					})
					.strict(),
			])
			.optional(),
		missed: z.literal(true).optional(),
		anchor: vector2.optional(),
		template: z
			.object({
				gridSize: z.number().positive(),
				startPoint: z.number(),
				endPoint: z.number(),
			})
			.strict()
			.optional(),
		loopProperty: z
			.array(
				z
					.object({
						target: z.string(),
						property: z.string(),
						options: z
							.object({
								duration: z.number(),
								from: z.number().optional(),
								to: z.number().optional(),
								values: z.array(z.number()).min(1).optional(),
								loops: z.number().int().positive().optional(),
								pingPong: z.literal(true).optional(),
								delay: z.number().positive().optional(),
								ease: ease.optional(),
								fromEnd: z.literal(true).optional(),
								gridUnits: z.literal(true).optional(),
							})
							.strict(),
					})
					.strict(),
			)
			.min(1)
			.optional(),
		animateProperty: z
			.array(
				z
					.object({
						target: z.string(),
						property: z.string(),
						options: z
							.object({
								duration: z.number(),
								from: z.number(),
								to: z.number(),
								delay: z.number().optional(),
								ease: ease.optional(),
								fromEnd: z.literal(true).optional(),
								gridUnits: z.literal(true).optional(),
							})
							.strict(),
					})
					.strict(),
			)
			.min(1)
			.optional(),
		shape: shape.or(z.array(shape).min(1)).optional(),
	})
	.strict();

const triggersList = [
	'attack-roll',
	'damage-roll',
	'place-template',
	'action',
	'toggle',
	'effect',
	'self-effect',
	'start-turn',
	'end-turn',
	'damage-taken',
	'saving-throw',
	'check',
	'skill-check',
	'flat-check',
	'initiative',
	'perception-check',
	'counteract-check',
	'modifiers-matter',
] as const;
const triggers = z.enum(triggersList);

const presetList = ['animation', 'crosshair', 'onToken', 'ranged', 'melee', 'template', 'sound', 'macro'] as const;
const presets = z.enum(presetList);

const referenceObject = z
	.object({
		macro: z.string().optional(),
		overrides: z.array(rollOption).min(1).optional(),
		trigger: triggers.or(z.array(triggers).min(1)),
		preset: presets,
		file: sequencerDBEntry.or(filePath).or(z.array(sequencerDBEntry.or(filePath))),
		default: z.literal(true).optional(),
		predicate: z.array(predicate).min(1).optional(),
		options: effectOptions.optional(),
		reference: rollOption.optional(),
		type: z.literal('addon').optional(),
	})
	.strict();

type AnimationObject = Partial<z.infer<typeof referenceObject>> & {
	contents?: AnimationObject[];
};
const animationObject: z.ZodType<AnimationObject> = referenceObject
	.partial()
	.extend({
		contents: z.lazy(() => z.array(animationObject).min(1)).optional(),
	})
	.strict();

type Preset = z.infer<typeof presets>;

interface OldJSON {
	[rollOption: string]: string | z.infer<typeof animationObject>[];
}
// #endregion

// #region Conversion functions
interface FuncOpts<P extends Preset> {
	file: string;
	preset?: Preset;
	workingObj?: AnimationSetContentsItem<PresetToSetMap[P]>;
}

type ConversionResponse<T> =
	| {
		success: true;
		data: T;
		messages?: string[];
	}
	| {
		success: false;
		error: string;
	};

function simplifyOffset(inObj: { offset?: Offset; randomOffset?: number }): {
	offset?: Partial<Vector2>;
	randomOffset?: number;
} {
	if (!inObj.offset) return {};

	let randomOffset = inObj.randomOffset ?? 0;
	let randomX = false;
	let randomY = false;
	const outObj: { offset: Partial<Vector2>; randomOffset?: number } = { offset: {} };
	if (inObj.offset.x) {
		if (typeof inObj.offset.x === 'number') {
			outObj.offset.x = inObj.offset.x;
		} else {
			outObj.offset.x = (inObj.offset.x[0] + inObj.offset.x[1]) / 2;
			randomX = true;
		}
	}
	if (inObj.offset.y) {
		if (typeof inObj.offset.y === 'number') {
			outObj.offset.x = inObj.offset.y;
		} else {
			outObj.offset.x = (inObj.offset.y[0] + inObj.offset.y[1]) / 2;
			randomY = true;
		}
	}

	if (randomX && !randomY) {
		// @ts-expect-error I do not care.
		randomOffset = randomOffset + Math.abs(inObj.offset.x[0] - inObj.offset.x[1]);
	} else if (!randomX && randomY) {
		// @ts-expect-error I do not care.
		randomOffset = randomOffset + Math.abs(inObj.offset.y[0] - inObj.offset.y[1]);
	} else if (randomX && randomY) {
		randomOffset
			= randomOffset
			// @ts-expect-error I do not care.
				+ (Math.abs(inObj.offset.x[0] - inObj.offset.x[1]) + Math.abs(inObj.offset.y[0] - inObj.offset.y[1]))
				/ 2;
	}

	if (randomOffset > 0) outObj.randomOffset = randomOffset;

	return outObj;
}

interface PresetToSetMap {
	readonly melee: 'graphic';
	readonly onToken: 'graphic';
	readonly template: 'graphic';
	readonly ranged: 'graphic';
	readonly animation: 'animation';
	readonly crosshair: 'crosshair';
	readonly sound: 'sound';
	readonly macro: 'macro';
};

function presetToSetType<P extends keyof PresetToSetMap>(preset: P | undefined): ConversionResponse<PresetToSetMap[P] | undefined> {
	if (!preset) return { success: true, data: undefined };
	if (preset === 'melee') return { success: true, data: 'graphic' };
	if (preset === 'onToken') return { success: true, data: 'graphic' };
	if (preset === 'template') return { success: true, data: 'graphic' };
	if (preset === 'ranged') return { success: true, data: 'graphic' };
	if (preset === 'animation') return { success: true, data: 'animation' };
	if (preset === 'crosshair') return { success: true, data: 'crosshair' };
	if (preset === 'sound') return { success: true, data: 'sound' };
	if (preset === 'macro') return { success: true, data: 'macro' };
	return { success: false, error: `Unknown preset \`${preset}\`.` };
}

// #region FoundryVTT core `foundry.util.mergeObject()` method
interface MergeOptions {
	insertKeys?: boolean;
	insertValues?: boolean;
	enforceTypes?: boolean;
	overwrite?: boolean;
	recursive?: boolean;
	performDeletions?: boolean;
}
export function expandObject(obj: object) {
	function _expand(value: unknown, depth: number) {
		if (depth > 32) throw new Error('Maximum object expansion depth exceeded');
		if (!value) return value;
		if (Array.isArray(value)) return value.map(v => _expand(v, depth + 1)); // Map arrays
		if (value.constructor?.name !== 'Object') return value; // Return advanced objects directly
		const expanded = {}; // Expand simple objects
		for (let [k, v] of Object.entries(value)) {
			setProperty(expanded, k, _expand(v, depth + 1));
		}
		return expanded;
	}
	return _expand(obj, 0);
}
function _mergeUpdate<T extends object>(
	original: T,
	k: keyof T,
	v: any,
	{ insertKeys, insertValues, enforceTypes, overwrite, recursive, performDeletions }: MergeOptions = {},
	_d: number,
) {
	const x = original[k];
	const tv = getType(v);
	const tx = getType(x);

	// Recursively merge an inner object
	if (tv === 'Object' && tx === 'Object' && recursive) {
		return mergeObject(
			x,
			v,
			{
				insertKeys,
				insertValues,
				overwrite,
				enforceTypes,
				performDeletions,
				inplace: true,
			},
			_d,
		);
	}

	// Overwrite an existing value
	if (overwrite) {
		original[k] = v;
	}
}
function _mergeInsert(original, k, v, { insertKeys, insertValues, performDeletions } = {}, _d: number) {
	if (k.startsWith('-=') && performDeletions) {
		delete original[k.slice(2)];
		return;
	}

	const canInsert = (_d <= 1 && insertKeys) || (_d > 1 && insertValues);
	if (!canInsert) return;

	if (v?.constructor === Object) {
		original[k] = objAss({}, v, { insertKeys: true, inplace: true, performDeletions });
		return;
	}

	original[k] = v;
}
function objAss<T extends { [key: string]: any }, V extends { [key: string]: V }>(
	obj: T,
	val: V,
	options = {
		insertKeys: true,
		insertValues: true,
		overwrite: true,
		recursive: true,
		inplace: true,
		enforceTypes: false,
		performDeletions: false,
	},
	_d: number = 0,
): T & V {
	if (_d === 0) {
		if (Object.keys(val).some(k => /\./.test(k))) val = expandObject(val);
		if (Object.keys(obj).some(k => /\./.test(k))) {
			const expanded = expandObject(obj);
			Object.keys(obj).forEach(k => delete obj[k]);
			Object.assign(obj, expanded);
		}
	}

	for (const k of Object.keys(val)) {
		const v = val[k];
		if (Object.prototype.hasOwnProperty.call(obj, k)) _mergeUpdate(obj, k, v, options, _d + 1);
		else _mergeInsert(obj, k, v, options, _d + 1);
	}
	return obj;
}
// #endregion

function convertEffect<P extends Preset>(
	oldSet: AnimationObject,
	opts: FuncOpts<P>,
): ConversionResponse<AnimationSetContentsItem<(PresetToSetMap[P])>> {
	if (!opts.workingObj) throw new Error('Needs `opts.workingObj`!');
	const newSet = opts.workingObj;

	// if (opts.preset !== 'melee') throw new Error('a');
	const setTypeResp = presetToSetType(opts.preset);
	if (!setTypeResp.success) return { success: false, error: setTypeResp.error };

	if (!newSet.execute) newSet.execute = {};

	if (setTypeResp.data === 'graphic') {
		if (oldSet.file) newSet.execute.graphic = [oldSet.file].flat();
		if (oldSet.options) {
			if (typeof oldSet.options.scaleToObject === 'number' && newSet.execute?.size?.scaling) {
				newSet.execute.size.scaling = oldSet.options.scaleToObject;
			}
		}
	} else if (setTypeResp.data === 'sound') {
		// TODO
	} else if (setTypeResp.data === 'animation') {
		// TODO
	} else if (setTypeResp.data === 'crosshair') {
		// TODO
	} else if (setTypeResp.data === 'macro') {
		// Do nothing maybe?
	}

	return { success: true, data: newSet };
}

function convertPartialSet(oldSet: AnimationObject, opts: FuncOpts): ConversionResponse<AnimationSetContentsItem> {
	if (!oldSet.options) oldSet.options = {};
	let newSet: AnimationSet & AnimationSetContentsItem = {};
	const messages: string[] = [];

	// #region Scheduling and metadata, etc.
	if (oldSet.overrides) newSet.overrides = oldSet.overrides;
	if (oldSet.trigger) newSet.triggers = [oldSet.trigger].flat();
	if (oldSet.predicate) newSet.predicates = oldSet.predicate;
	if (oldSet.default) newSet.default = oldSet.default;
	if (oldSet.reference) newSet.reference = oldSet.reference;
	if (oldSet.type === 'addon') {
		newSet.generic = { type: 'add-on' };
		if (oldSet.options.addon?.order === 'last') newSet.generic.order = 'last';
	} else if (oldSet.type === 'slot') {
		newSet.generic = { type: 'slot' };
	}
	if (oldSet.options.name || oldSet.options.id) newSet.label = oldSet.options.name ?? oldSet.options.id;
	if (oldSet.options.remove) {
		const removes = [oldSet.options.remove].flat();
		newSet.removes = removes;
		if (removes.includes('all'))
			messages.push('Special `remove` value `"all"` is unconvertible. See new schema for information.');
	}
	// #endregion

	if (!opts.preset) opts.preset = oldSet.preset;

	// #region Payload stuff
	if (oldSet.preset === 'animation') {
		// TODO
		return { success: false, error: `Preset \`${oldSet.preset}\` is unimplemented.` };
	} else if (oldSet.preset === 'crosshair') {
		// TODO
		return { success: false, error: `Preset \`${oldSet.preset}\` is unimplemented.` };
	} else if (oldSet.preset === 'melee') {
		newSet.execute = {
			type: 'graphic',
			position: {
				type: 'dynamic',
				location: 'SOURCES',
				anchor: { x: 0.4 },
			},
			reflection: {
				y: 'random',
			},
			rotation: {
				type: 'relative',
				location: 'TARGETS',
			},
			size: {
				type: 'relative',
				scaling: 4,
			},
		};

		if (
			newSet.execute.position
			&& oldSet.options.preset?.attachTo
			&& typeof oldSet.options.preset.attachTo === 'object'
		) {
			const { offset, randomOffset } = simplifyOffset(oldSet.options.preset.attachTo);
			newSet.execute.position = {
				type: 'dynamic',
				location: 'SOURCES',
				anchor: { x: 0.4 },
				offset,
				randomOffset,
				gridUnits: oldSet.options.preset.attachTo.gridUnits,
				local: oldSet.options.preset.attachTo.local,
				edge: oldSet.options.preset.attachTo.edge,
				unbindAlpha: !oldSet.options.preset.attachTo.bindAlpha || undefined,
				unbindElevation: !oldSet.options.preset.attachTo.bindElevation || undefined,
				unbindScale: !oldSet.options.preset.attachTo.bindScale || undefined,
				unbindVisibility: !oldSet.options.preset.attachTo.bindVisibility || undefined,
				align: oldSet.options.preset.attachTo.align,
				ignoreRotation: !oldSet.options.preset.attachTo.followRotation || undefined,
			};
		}
		if (
			newSet.execute.rotation
			&& oldSet.options.preset?.rotateTowards
			&& typeof oldSet.options.preset.rotateTowards === 'object'
		) {
			const { offset, randomOffset } = simplifyOffset(oldSet.options.preset.rotateTowards);
			newSet.execute.rotation = {
				type: 'relative',
				location: 'TARGETS',
				offset,
				randomOffset,
				rotationOffset: oldSet.options.preset.rotateTowards.rotationOffset,
				gridUnits: oldSet.options.preset.rotateTowards.gridUnits,
				local: oldSet.options.preset.rotateTowards.local,
				attach: oldSet.options.preset.rotateTowards.attachTo,
			};
		}

		const convertEffectResp = convertEffect(oldSet, {
			workingObj: newSet,
			...opts,
		});
		if (!convertEffectResp.success) return { success: false, error: convertEffectResp.error };
		newSet = convertEffectResp.data;
	} else if (oldSet.preset === 'onToken') {
		const convertEffectResp = convertEffect(oldSet, {
			workingObj: newSet,
			...opts,
		});
		if (!convertEffectResp.success) return { success: false, error: convertEffectResp.error };
		newSet = convertEffectResp.data;
		return { success: false, error: `Preset \`${oldSet.preset}\` is unimplemented.` };
	} else if (oldSet.preset === 'ranged') {
		const convertEffectResp = convertEffect(oldSet, {
			workingObj: newSet,
			...opts,
		});
		if (!convertEffectResp.success) return { success: false, error: convertEffectResp.error };
		newSet = convertEffectResp.data;
		// TODO
		return { success: false, error: `Preset \`${oldSet.preset}\` is unimplemented.` };
	} else if (oldSet.preset === 'sound') {
		const convertEffectResp = convertEffect(oldSet, {
			workingObj: newSet,
			...opts,
		});
		if (!convertEffectResp.success) return { success: false, error: convertEffectResp.error };
		newSet = convertEffectResp.data;
		// TODO
		return { success: false, error: `Preset \`${oldSet.preset}\` is unimplemented.` };
	} else if (oldSet.preset === 'template') {
		newSet.execute = {
			type: 'graphic',
			position: {
				type: 'dynamic',
				location: 'TEMPLATES',
			},
			size: {
				type: 'relative',
				scaling: 4,
			},
		};

		const convertEffectResp = convertEffect(oldSet, {
			workingObj: newSet,
			...opts,
		});
		if (!convertEffectResp.success) return { success: false, error: convertEffectResp.error };
		newSet = convertEffectResp.data;
	} else if (oldSet.preset === 'macro') {
		newSet.execute = {
			type: 'macro',
			document: oldSet.macro,
		};
	} else if (!opts.preset && (!oldSet.contents || oldSet.contents.length === 0)) {
		return { success: false, error: `Unknown preset \`${oldSet.preset}\`.` };
	}
	// #endregion

	// Handle `options.sound`
	// Move `execute` to `contents`, create new `sound` contents item
	if (oldSet.options.sound) {
		newSet.contents = [{ execute: newSet.execute }];
		for (const sound of [oldSet.options.sound].flat()) {
			const item: AnimationSetContentsItem<'sound'> = {
				default: sound.default,
				predicates: sound.predicate,
				execute: {
					type: 'sound',
					sound: [sound.file],
					waitUntilFinished: sound.waitUntilFinished,
					radius: sound.radius,
					volume: sound.volume,
					duration: sound.duration,
					constrainedByWalls: sound.constrainedByWalls,
					muffledEffect: sound.muffledEffect,
					baseEffect: sound.baseEffect,
					delay: sound.delay,
				},
			};
			if (item.execute && sound.atLocation) {
				if (
					newSet.execute?.type === 'graphic'
					&& newSet.execute.position
					&& newSet.execute.position.type !== 'screenSpace'
				) {
					const { offset, randomOffset } = simplifyOffset(sound.atLocation);
					item.execute.position = {
						location: newSet.execute.position.location,
						offset,
						randomOffset,
						gridUnits: sound.atLocation.gridUnits,
					};
				} else {
					messages.push('`position` for `sound` payload couldn\'t be identified.');
				}
			}
			newSet.contents.push(item);
		}
		newSet.execute = {};
	}

	if (oldSet.contents) {
		const contents = [];
		for (const item of oldSet.contents) {
			const resp = convertPartialSet(item, opts);
			if (!resp.success) return { success: false, error: resp.error };
			if (resp.messages) messages.push(...resp.messages);
			contents.push(resp.data);
		}

		newSet.contents = (newSet.contents ?? []).concat(contents);
	}

	return { success: true, data: newSet, messages };
}

function convertSchema(oldJSON: OldJSON, opts: FuncOpts): ConversionResponse<AnimationSetsObject> {
	const newJSON: AnimationSetsObject = {};
	const messages: string[] = [];

	for (const [RO, oldSets] of Object.entries(oldJSON)) {
		if (typeof oldSets === 'string') {
			newJSON[RO] = oldSets;
		} else {
			newJSON[RO] = [];
			for (const oldSet of oldSets) {
				const newSetResp = convertPartialSet(oldSet, opts);

				if (newSetResp.success) {
					newJSON[RO].push(newSetResp.data);
					if (newSetResp.messages) messages.push(...newSetResp.messages);
				} else {
					return { success: false, error: newSetResp.error };
				}
			}
		}
	}

	return { success: true, data: newJSON, messages };
}

function cleanObject<T extends object>(data: T): T {
	for (const key in data) {
		if (data[key] === undefined || data[key] === null || data[key] === '') {
			delete data[key];
		} else if (Array.isArray(data[key])) {
			if (data[key].length === 0) {
				delete data[key];
			} else {
				for (let i = 0; i < data[key].length; i++) {
					data[key][i] = cleanObject(data[key][i]);
				}
			}
		} else if (typeof data[key] === 'object') {
			if (Object.keys(data[key]).length === 0) {
				delete data[key];
			} else {
				data[key] = cleanObject(data[key]);
			}
		}
	}
	return data;
}
// #endregion

const files = getFilesRecursively('./animations_old').filter(str => str.endsWith('.json'));

for (const file of files) {
	const oldJSON = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' })) as OldJSON;

	const newJSONResp = convertSchema(oldJSON, { file });

	if (newJSONResp.success) {
		const newFile = file.replace(/\banimations_old\b/, 'animations');
		const newDir = path.dirname(newFile);
		if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
		fs.writeFileSync(newFile, `${JSON.stringify(cleanObject(newJSONResp.data), undefined, '\t')}\n`);
		// fs.rmSync(file);
		console.log(`Successfully converted ${file}`);
		if (newJSONResp.messages?.length) {
			console.log('\tConversion advisories:');
			newJSONResp.messages.forEach(str => console.log(`\t\t${str}`));
		}
	} else {
		console.warn(`Failed to convert ${file}\n\t${newJSONResp.error}`);
	}
}
