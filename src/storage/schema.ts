import { z } from 'zod'
import { AnimCore } from './AnimCore'
import { presets } from './presets'

// Helper validation functions
const nonZero: [(num: number) => boolean, string] = [
	num => num !== 0,
	'Value cannot be 0. If you want the value to be 0, simply leave the property undefined.',
]
const nonEmpty: [(obj: object) => boolean, string] = [
	obj => Object.keys(obj).length !== 0,
	'Objects must not be empty',
]
// end

const ID = z.string().regex(/^[a-z]+(-[a-z])+$/)

const rollOption = z
	.string()
	.regex(/^[a-z]+(-[a-z])(:[a-z]+(-[a-z]))+$/, 'Property names must be a valid roll option.')

const predicate = rollOption.or(z.object({}).refine(...nonEmpty))

const hexColour = z.string().regex(/^#[0-9a-f]{3}(#[0-9a-f]{3})?$/i, 'Must be a valid hexadecimal colour code.')

const vector2 = z.object({ x: z.number(), y: z.number() }).strict()

const soundData = z
	.object({
		file: z.string(),
		waitUntilFinished: z.number().optional(),
		atLocation: z
			.object({
				cacheLocation: z.literal(true).optional(),
				offset: vector2.optional(),
				randomOffset: z.number().optional(),
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
			.optional(),
		radius: z.number().optional(),
		volume: z.number().optional(),
		duration: z.number().optional(),
		constrainedByWalls: z.boolean().optional(),
		predicate: z.array(z.string()).optional(),
		default: z.boolean().optional(),
	})
	.strict()
const soundConfig = soundData.or(z.array(soundData))

const presetOptions = z.enum(['target', 'source', 'both']).or(
	z.object({
		bounce: z
			.object({
				file: z.string(),
				sound: soundConfig,
			})
			.strict(),
		templateAsOrigin: z.literal(true).optional(),
	}),
)

const easingOptions = z
	.object({
		ease: z.string().optional(),
		delay: z.number().positive().optional(),
	})
	.strict()

const shape = z
	.object({
		type: z.enum(['polygon', 'rectangle', 'circle', 'ellipse', 'roundedRect']),
		radius: z.number().positive().optional(),
		width: z.number().positive().optional(),
		height: z.number().positive().optional(),
		points: z.array(z.array(z.number()).length(2).or(vector2)).min(1).optional(),
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
	.refine(...nonEmpty)

export const effectOptions = z
	.object({
		sound: soundConfig.optional(),
		preset: presetOptions.optional(),
		locally: z.literal(true).optional(),
		id: ID.optional(),
		name: z.string().min(1).optional(),
		randomizeMirrorX: z.literal(true).optional(),
		randomizeMirrorY: z.literal(true).optional(),
		mirrorX: z.literal(true).optional(),
		mirrorY: z.literal(true).optional(),
		remove: z.string().or(z.array(z.string())).optional(),
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
			.or(easingOptions.extend({ value: z.number() }).strict())
			.optional(),
		fadeOut: z
			.number()
			.refine(...nonZero)
			.or(easingOptions.extend({ value: z.number() }).strict())
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
				offset: vector2,
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
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
						delayMin: z.number(),
						delayMax: z.number(),
					})
					.strict(),
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
				type: z.string(),
				options: z.object({}), // Structure isn't documented?
			})
			.strict()
			.optional(),
		missed: z.literal(true).optional(),
		attachTo: z
			.object({
				align: z.string().optional(),
				edge: z.string().optional(),
				bindVisibility: z.literal(true).optional(),
				bindAlpha: z.literal(true).optional(),
				bindScale: z.literal(true).optional(),
				bindElevation: z.literal(true).optional(),
				followRotation: z.literal(true).optional(),
				offset: vector2.optional(),
				randomOffset: z.number().optional(),
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
			.refine(...nonEmpty)
			.optional(),
		atLocation: z
			.object({
				cacheLocation: z.literal(true).optional(),
				offset: vector2.optional(),
				randomOffset: z.number().optional(),
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
			.refine(...nonEmpty)
			.optional(),
		stretchTo: z
			.object({
				cacheLocation: z.literal(true).optional(),
				attachTo: z.literal(true).optional(),
				onlyX: z.literal(true).optional(),
				tiling: z.literal(true).optional(),
				offset: vector2.optional(),
				randomOffset: z.number().optional(),
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
				requiresLineOfSight: z.literal(true).optional(),
				hideLineOfSight: z.literal(true).optional(),
			})
			.strict()
			.refine(...nonEmpty)
			.optional(),
		rotateTowards: z
			.object({
				rotationOffset: z.number().optional(),
				cacheLocation: z.literal(true).optional(),
				attachTo: z.literal(true).optional(),
				offset: vector2.optional(),
				randomOffset: z.number().optional(),
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
			.refine(...nonEmpty)
			.optional(),
		anchor: vector2.optional(),
		template: z
			.object({
				gridSize: z.number().min(0),
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
								loops: z.number().optional(),
								pingPong: z.literal(true).optional(),
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
			.optional(),
		shape: shape.or(z.array(shape)).optional(),
	})
	.strict()
	.refine(...nonEmpty)

const animationDataObject = z.object({
	overrides: z.array(z.string()).min(1).optional(),
	trigger: z.enum(AnimCore.CONST.TRIGGERS),
	preset: z.enum(Object.keys(presets) as [string, ...string[]]),
	file: z.string(),
	default: z.literal(true).optional(),
	predicate: z.array(predicate).optional(),
	options: z.any().optional(), // :(
})

// Following required to allow Zod to evaluate recursive structures
type FolderObject = Partial<z.infer<typeof animationDataObject>> & {
	contents?: (z.infer<typeof animationDataObject> | FolderObject)[]
}
const folderObject: z.ZodType<FolderObject> = animationDataObject.partial().extend({
	contents: z.lazy(() => z.array(animationDataObject.or(folderObject))).optional(),
})
// end

const referenceObject = animationDataObject.partial().extend({
	reference: rollOption,
})

export const animations = z.record(
	rollOption,
	rollOption.or(z.array(folderObject.or(referenceObject).refine(...nonEmpty))),
)
