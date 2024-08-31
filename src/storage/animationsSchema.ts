import { z } from 'zod';

// Helper validation functions
const nonZero: [(num: number) => boolean, string] = [
	num => num !== 0,
	'Number cannot be 0. If you want the value to be 0, simply leave the property undefined.',
];
const nonEmpty: [(obj: object) => boolean, string] = [
	obj => Object.keys(obj).length !== 0,
	'Object must not be empty.',
];
const uniqueItems: [(arr: any[]) => boolean, string] = [
	arr => new Set(arr.map(e => JSON.stringify(e))).size === arr.length,
	'Items must be unique.',
];
// end

const JSONValue = z.union([z.string(), z.number(), z.boolean(), z.object({}), z.null(), z.undefined()]);

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'String must be a valid slug.');

const rollOption = z
	.string()
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*(?::[a-z0-9]+(?:-[a-z0-9]+)*)*(?::-?\d+)?$/,
		'String must be a valid roll option.',
	);

// Following required to allow Zod to evaluate recursive structures
const predicateComparisonObject = z.object({
	lt: z
		.tuple([rollOption.or(z.number()), rollOption.or(z.number())])
		.refine(
			tuple => typeof tuple[0] !== 'number' || typeof tuple[1] !== 'number',
			'Comparing two numbers produces a constant truth-value. Make sure you\'re comparing at least one variable.',
		)
		.optional(),
	gt: z
		.tuple([rollOption.or(z.number()), rollOption.or(z.number())])
		.refine(
			tuple => typeof tuple[0] !== 'number' || typeof tuple[1] !== 'number',
			'Comparing two numbers produces a constant truth-value. Make sure you\'re comparing at least one variable.',
		)
		.optional(),
	lte: z
		.tuple([rollOption.or(z.number()), rollOption.or(z.number())])
		.refine(
			tuple => typeof tuple[0] !== 'number' || typeof tuple[1] !== 'number',
			'Comparing two numbers produces a constant truth-value. Make sure you\'re comparing at least one variable.',
		)
		.optional(),
	gte: z
		.tuple([rollOption.or(z.number()), rollOption.or(z.number())])
		.refine(
			tuple => typeof tuple[0] !== 'number' || typeof tuple[1] !== 'number',
			'Comparing two numbers produces a constant truth-value. Make sure you\'re comparing at least one variable.',
		)
		.optional(),
});
type Predicate =
	| z.infer<typeof rollOption>
	| (z.infer<typeof predicateComparisonObject> & {
		not?: Predicate;
		and?: Predicate[];
		or?: Predicate[];
		nand?: Predicate[];
		nor?: Predicate[];
	});
const predicate: z.ZodType<Predicate> = rollOption.or(
	predicateComparisonObject
		.extend({
			not: z.lazy(() => rollOption.or(predicate).optional()),
			and: z
				.lazy(() =>
					z
						.array(rollOption.or(predicate))
						.min(1)
						.refine(...uniqueItems),
				)
				.optional(),
			or: z
				.lazy(() =>
					z
						.array(rollOption.or(predicate))
						.min(1)
						.refine(...uniqueItems),
				)
				.optional(),
			nand: z
				.lazy(() =>
					z
						.array(rollOption.or(predicate))
						.min(1)
						.refine(...uniqueItems),
				)
				.optional(),
			nor: z
				.lazy(() =>
					z
						.array(rollOption.or(predicate))
						.min(1)
						.refine(...uniqueItems),
				)
				.optional(),
		})
		.strict()
		.refine(...nonEmpty),
);

const hexColour = z
	.string()
	.regex(/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i, 'String must be a valid hexadecimal colour-code.');

const filePath = z
	.string()
	.regex(
		/^\w[^"*:<>?\\|]+\.\w{3,5}$/,
		'String must be a valid filepath. The following characters are unsafe for cross-platform filesystems: "*:<>?\\|',
	);

const sequencerDBEntry = z
	.string()
	.regex(/^[\w-]+(?:\.([\w-]+|\{\w+(?:,\w+)+\}))+$/, 'String must be a valid Sequencer database entry.');

const vector2 = z
	.object({
		x: z
			.number()
			.refine(...nonZero)
			.optional(),
		y: z
			.number()
			.refine(...nonZero)
			.optional(),
	})
	.strict()
	.refine(...nonEmpty);

const offset = z
	.object({
		x: z
			.number()
			.refine(...nonZero)
			.or(
				z
					.tuple([z.number(), z.number()])
					.refine(arr => arr[0] !== arr[1], 'Offset range cannot be zero.'),
			)
			.optional(),
		y: z
			.number()
			.refine(...nonZero)
			.or(
				z
					.tuple([z.number(), z.number()])
					.refine(arr => arr[0] !== arr[1], 'Offset range cannot be zero.'),
			)
			.optional(),
		flipX: z.literal(true).optional(),
		flipY: z.literal(true).optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.refine(obj => obj.x || obj.y, 'At least one offset dimension (`x` or `y`) must be specified.');

const soundEffect = z
	.object({
		type: z.string().min(1),
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
		predicate: z
			.array(predicate)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
		default: z.literal(true).optional(),
		delay: z
			.number()
			.refine(...nonZero)
			.optional(),
		muffledEffect: soundEffect.optional(),
		baseEffect: soundEffect.optional(),
	})
	.strict();
const soundConfig = soundData.or(
	z
		.array(soundData)
		.min(1)
		.refine(...uniqueItems),
);

const presetOptions = z
	.object({
		attachTo: z.literal(true).or(
			z
				.object({
					align: z.string().optional(),
					edge: z.string().optional(),
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
				.refine(...nonEmpty)
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
				.refine(...nonEmpty)
				.optional(),
		),
		bounce: z
			.object({
				file: sequencerDBEntry.or(filePath),
				sound: soundConfig.optional(),
			})
			.strict()
			.refine(...nonEmpty)
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
				.refine(...nonEmpty)
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
			.refine(...nonEmpty)
			.optional(),
		templateAsOrigin: z.literal(true).optional(),
	})
	.strict()
	.refine(...nonEmpty);

const easingOptions = z
	.object({
		ease: z.string().optional(),
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
			.refine(...uniqueItems)
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
	.strict()
	.refine(...nonEmpty);

const effectOptions = z
	.object({
		sound: soundConfig.optional(),
		preset: presetOptions.optional(),
		locally: z.literal(true).optional(),
		id: slug.optional(),
		name: z.string().min(1).optional(),
		syncGroup: z.string().optional(),
		randomRotation: z.literal(true).optional(),
		randomizeMirrorX: z.literal(true).optional(),
		randomizeMirrorY: z.literal(true).optional(),
		mirrorX: z.literal(true).optional(),
		mirrorY: z.literal(true).optional(),
		remove: slug
			.or(
				z
					.array(slug)
					.min(1)
					.refine(...uniqueItems),
			)
			.optional(),
		tieToDocuments: z.literal(true).optional(),
		belowTokens: z.literal(true).optional(),
		waitUntilFinished: z
			.number()
			.refine(...nonZero)
			.optional(),
		zIndex: z.number().optional(),
		duration: z
			.number()
			.describe('The duration of the animationDataObject in milliseconds.')
			.positive()
			.optional(),
		tint: hexColour
			.describe('A hexadecimal colour code to give the animationDataObject a certain tint.')
			.optional(),
		rotate: z
			.number()
			.describe('An angle in degrees (°) to rotate the animationDataObject.')
			.gt(-180)
			.lte(180)
			.refine(...nonZero)
			.optional(),
		opacity: z.number().describe('An opacity scaler from 0 to 1 (exclusive).').positive().lt(1).optional(),
		mask: z.literal(true).optional(),
		fadeIn: z
			.number()
			.refine(...nonZero)
			.or(easingOptions.extend({ value: z.number().refine(...nonZero) }).strict())
			.optional(),
		fadeOut: z
			.number()
			.refine(...nonZero)
			.or(easingOptions.extend({ value: z.number().refine(...nonZero) }).strict())
			.optional(),
		wait: z
			.number()
			.or(
				z
					.object({
						min: z.number().refine(...nonZero),
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
						min: z.number().refine(...nonZero),
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
					.strict()
					.refine(...nonEmpty),
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
			.object({
				type: z.enum(['ColorMatrix', 'Glow', 'Blur']),
				options: z
					.object({
						hue: z.number().gt(-180).lte(180).describe('The hue, in degrees.').optional(),
						brightness: z
							.number()
							.describe('The value of the brightness (0 to 1, where 0 is black)')
							.optional(),
						contrast: z.number().describe('The value of the contrast (0 to 1).').optional(),
						saturate: z
							.number()
							.describe(
								'The value of the saturation amount. Negative numbers cause it to become desaturated (-1 to 1)',
							)
							.optional(),
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
							.describe(
								'Glow: describes the quality of the glow (0 to 1); the higher the number the less performant.\nBlur: quality of the filter.',
							)
							.optional(),
						knockout: z
							.literal(true)
							.describe(
								'Toggle to hide the contents and only show the glow (effectively hides the sprite).',
							)
							.optional(),
						strength: z.number().positive().describe('The strength of the filter.').optional(),
						blur: z
							.number()
							.positive()
							.describe('sets the strength of both the blurX and blurY properties simultaneously')
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
					.strict(),
			})
			.strict()
			.refine(...nonEmpty)
			.superRefine(
				// Test that `filter.options` matches `filter.type`
				(filter, ctx) => {
					const filterOptionsProperties = {
						ColorMatrix: ['hue', 'brightness', 'contrast', 'saturate'],
						Glow: ['distance', 'outerStrength', 'innerStrength', 'color', 'quality', 'knockout'],
						Blur: ['strength', 'blur', 'blurX', 'blurY', 'quality', 'resolution', 'kernelSize'],
					};

					const illegalProperties = Object.keys(filter.options).filter(
						prop => !filterOptionsProperties[filter.type].includes(prop),
					);

					if (illegalProperties.length) {
						return ctx.addIssue({
							code: z.ZodIssueCode.unrecognized_keys,
							keys: illegalProperties,
							message: `The following properties aren't allowed when \`type\` is \`"${filter.type}"\`: \`${illegalProperties.join('`, `')}\`.`,
						});
					}

					if (filter.options.blur && (filter.options.blurX || filter.options.blurY)) {
						return ctx.addIssue({
							code: z.ZodIssueCode.unrecognized_keys,
							keys: Object.keys(filter).filter(key => key === 'blurX' || key === 'blurY'),
							message:
								'`blur` is used to set both `blurX` and `blurY` simultaneously and cannot be mixed.',
						});
					}

					if (filter.options.quality) {
						if (filter.type === 'Blur') {
							if (Number.isInteger(filter.options.quality)) {
								return ctx.addIssue({
									code: z.ZodIssueCode.invalid_type,
									expected: 'integer',
									received: 'float',
									message: 'Expected integer, received float.',
								});
							}
							if (filter.options.quality < 0) {
								return ctx.addIssue({
									code: z.ZodIssueCode.too_small,
									minimum: 0,
									type: 'number',
									inclusive: true,
									message: 'Number must be greater than or equal to 0.',
								});
							}
						} else if (filter.type === 'Glow') {
							if (filter.options.quality >= 1) {
								return ctx.addIssue({
									code: z.ZodIssueCode.too_big,
									maximum: 1,
									type: 'number',
									inclusive: true,
									message: 'Number must be less than or equal to 1.',
								});
							}
							if (filter.options.quality < 0) {
								return ctx.addIssue({
									code: z.ZodIssueCode.too_small,
									minimum: 0,
									type: 'number',
									inclusive: true,
									message: 'Number must be greater than or equal to 0.',
								});
							}
						}
					}
				},
			)
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
								values: z
									.array(z.number())
									.min(1)
									.refine(...uniqueItems)
									.optional(),
								loops: z.number().int().positive().optional(),
								pingPong: z.literal(true).optional(),
								delay: z.number().positive().optional(),
								ease: z.string().optional(),
								fromEnd: z.literal(true).optional(),
								gridUnits: z.literal(true).optional(),
							})
							.strict(),
					})
					.strict(),
			)
			.min(1)
			.refine(...uniqueItems)
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
								ease: z.string().optional(),
								fromEnd: z.literal(true).optional(),
								gridUnits: z.literal(true).optional(),
							})
							.strict(),
					})
					.strict(),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
		shape: shape
			.or(
				z
					.array(shape)
					.min(1)
					.refine(...uniqueItems),
			)
			.optional(),
	})
	.strict()
	.refine(...nonEmpty);

const triggers = z.enum([
	'attack-roll',
	'damage-roll',
	'place-template',
	'action',
	'toggle',
	'effect',
	'self-effect',
	'startTurn',
	'endTurn',
	'damage-taken',
	'saving-throw',
	'check',
	'skill-check',
	'flat-check',
	'initiative',
	'perception-check',
	'counteract-check',
	'modifiers-matter',
]);

const referenceObject = z.object({
	overrides: z
		.array(rollOption)
		.min(1)
		.refine(...uniqueItems)
		.optional(),
	trigger: triggers.or(z.array(triggers).min(1)),
	preset: z.enum(['onToken', 'ranged', 'melee', 'template', 'macro']),
	file: sequencerDBEntry.or(filePath),
	default: z.literal(true).optional(),
	predicate: z
		.array(predicate)
		.min(1)
		.refine(...uniqueItems)
		.optional(),
	options: effectOptions.optional(),
	reference: rollOption.optional(),
});

// Following required to allow Zod to evaluate recursive structures
export type AnimationObject = Partial<z.infer<typeof referenceObject>> & {
	contents?: AnimationObject[];
};
const animationObject: z.ZodType<AnimationObject> = referenceObject
	.partial()
	.extend({
		contents: z
			.lazy(() => z.array(animationObject).min(1))
			.refine(...uniqueItems)
			.optional(),
	})
	.superRefine(
		// Test that `options.preset` matches `preset`
		(obj, ctx) => {
			if (!obj.preset || !obj.options || !obj.options.preset) return true;

			if (obj.preset === 'macro' && obj.options.preset) {
				return ctx.addIssue({
					code: z.ZodIssueCode.invalid_type,
					expected: 'undefined',
					received: typeof obj.options.preset,
					message: '`options.preset` cannot exist while `preset` equals `"macro"`.',
				});
			}

			const presetOptionsProperties = {
				template: ['attachTo', 'stretchTo'],
				onToken: ['rotateTowards', 'atLocation', 'location', 'attachTo'],
				melee: ['attachTo', 'rotateTowards'],
				ranged: ['attachTo', 'bounce', 'templateAsOrigin', 'atLocation', 'stretchTo'],
				macro: ['(none)'],
			};

			const illegalProperties = Object.keys(obj.options.preset).filter(
				prop => !presetOptionsProperties[obj.preset!].includes(prop),
			);

			if (illegalProperties.length) {
				return ctx.addIssue({
					code: z.ZodIssueCode.unrecognized_keys,
					keys: illegalProperties,
					message: `The following properties aren't allowed when \`preset\` is \`"${obj.preset}"\`: \`${illegalProperties.join('`, `')}\`.`,
				});
			}

			if (
				(obj.preset !== 'onToken'
				&& (typeof obj.options.preset.rotateTowards === 'boolean'
				|| typeof obj.options.preset.atLocation === 'boolean'))
				|| (obj.preset !== 'ranged' && typeof obj.options.preset.attachTo === 'boolean')
			) {
				return ctx.addIssue({
					code: z.ZodIssueCode.invalid_type,
					received: 'boolean',
					expected: 'object',
				});
			}
		},
	);

const animationObjects = z
	.array(animationObject.refine(...nonEmpty))
	.min(1)
	.refine(...uniqueItems);

// Full-file animations schema (sans _tokenImages). Not currently used (see `validateAnimationData()` below).
export const animations = z.record(rollOption, rollOption.or(animationObjects));

export const tokenImages = z.object({
	_tokenImages: z
		.array(
			z
				.object({
					name: z.string().min(1),
					uuid: z.string().regex(/^[a-z0-9]+(?:\.[a-z0-9-]+)+$/i, 'Must be a valid UUID.'),
					rules: z
						.array(
							z.tuple([slug, filePath, z.number().positive()]).or(
								z
									.object({
										key: JSONValue.optional(),
										label: JSONValue.optional(),
										slug: JSONValue.optional(),
										predicate: JSONValue.optional(),
										priority: JSONValue.optional(),
										ignored: JSONValue.optional(),
										requiresInvestment: JSONValue.optional(),
										requiresEquipped: JSONValue.optional(),
										removeUponCreate: JSONValue.optional(),
										value: z.string(),
										scale: z.number().optional(),
										tint: z.string().optional(),
										alpha: z.number().optional(),
										animation: z
											.object({
												duration: z.number().optional(),
												transition: z.string().optional(),
												easing: z.string().optional(),
												name: z.string().optional(),
											})
											.strict()
											.refine(...nonEmpty),
									})
									.strict(),
							),
						)
						.min(1)
						.refine(...uniqueItems),
				})
				.strict(),
		)
		.min(1)
		.refine(...uniqueItems),
});
type TokenImages = z.infer<typeof tokenImages>;

// GENERIC ANIMATION SCHEMA
export type Animations = Partial<TokenImages> & { [rollOption: string]: string | AnimationObject[] };

/**
 * Validates general animation data.
 *
 * @remarks This function is a fair bit more complicated than a basic Zod validation, because the latter results in near-meaningless errors due to the schema being a multiply-nested union. For instance, if an object validation fails, Zod doesn't know whether you made a mistake writing the object, or if you failed to write a string. `validateAnimationData` instead first validates that `data` is an object literal, and then validates each property sequentially, applying a narrower schema depending on context. All issues found are then concatenated together with reconstructed paths.
 *
 * @param data - The data to validate as parsed JSON.
 * @returns An object with a boolean `success` property indicating whether the validation succeeded or not. If validation failed, the Zod error is included in the `error` property.
 */
export function validateAnimationData(data: unknown): { success: true } | { success: false; error: z.ZodError } {
	if (typeof data !== 'object' || Array.isArray(data) || data === null) {
		return {
			success: false,
			error: new z.ZodError([
				{
					code: z.ZodIssueCode.invalid_type,
					expected: 'object',
					received: data === Array.isArray(data) ? 'array' : data === 'null' ? 'null' : typeof data,
					path: [],
					message: 'JSON must represent an object.',
				},
			]),
		};
	}

	const issues: z.ZodIssue[] = [];

	for (const key in data) {
		// Test _tokenImages as special case
		if (key === '_tokenImages') {
			const result = tokenImages.safeParse(data);
			if (!result.success) issues.push(...result.error.issues);
		} else {
			// Test key
			if (!rollOption.safeParse(key).success) {
				issues.push({
					code: z.ZodIssueCode.invalid_string,
					path: [key],
					validation: 'regex',
					message: 'Must be a valid roll option.',
				});
			}

			// Test value
			const value = (data as { [key: string]: unknown })[key];
			if (typeof value === 'string') {
				const result = rollOption.safeParse(value);
				if (!result.success)
					issues.push(...result.error.issues.map(issue => ({ ...issue, path: [key, ...issue.path] })));
			} else {
				const result = animationObjects.safeParse(value);
				if (!result.success)
					issues.push(...result.error.issues.map(issue => ({ ...issue, path: [key, ...issue.path] })));
			}
		}
	}

	if (issues.length) {
		return {
			success: false,
			error: new z.ZodError(issues),
		};
	}

	return {
		success: true,
	};
}
