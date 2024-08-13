import { z } from 'zod'

const ID = z
	.string()
	.min(1)
	.regex(/^[a-z]+(-[a-z])+$/)

const soundData = z
	.object({
		file: z.string(),
		waitUntilFinished: z.number().optional(),
		// atLocation?: Parameters<SoundSection['atLocation']>[1]
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

// const shape = { type: Parameters<EffectSection['shape']>[0] } & Parameters<EffectSection['shape']>[1]

export const effectOptions = z
	.object({
		sound: soundConfig.optional(),
		preset: presetOptions.optional(),
		locally: z.literal(true).optional(),
		id: ID.optional(),
		name: z.string().min(1).optional(),
		randomizeMirrorX: z.literal(true).optional(),
		randomizeMirrorY: z.literal(true).optional(),
		remove: z.string().or(z.array(z.string())).optional(),
		tieToDocuments: z.literal(true).optional(),
		belowTokens: z.literal(true).optional(),
		waitUntilFinished: z
			.number()
			.refine(num => num !== 0)
			.optional(),
		zIndex: z.number().optional(),
		duration: z.number().describe('The duration of the animation in milliseconds.').positive().optional(),
		tint: z
			.string()
			.describe('A hexadecimal colour code to give the animation a certain tint.')
			.regex(/^#[0-9a-f]{3}(#[0-9a-f]{3})?$/i, 'Must be a valid hexadecimal colour code.')
			.optional(),
		rotate: z
			.number()
			.describe('An angle in degrees (°) to rotate the animation.')
			.gt(-180)
			.lte(180)
			.optional(),
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
		// scaleToObject?: number | {
		// 	value: number
		// } & Parameters<EffectSection['scaleToObject']>[1],
		// spriteOffset?: {
		// 	offset: Parameters<EffectSection['spriteOffset']>[0]
		// } & Parameters<EffectSection['spriteOffset']>[1],
		// size?: number | {
		// 	value: number
		// } & Parameters<EffectSection['size']>[1]
		// persist?: boolean | {
		// 	value: boolean
		// } & Parameters<EffectSection['persist']>[1]
		// repeats?: number | {
		// 	min: Parameters<EffectSection['repeats']>[0]
		// 	delay: Parameters<EffectSection['repeats']>[1]
		// 	max: Parameters<EffectSection['repeats']>[2]
		// }
		// moveTowards?: {
		// 	target: Parameters<EffectSection['moveTowards']>[0]
		// } & Parameters<EffectSection['moveTowards']>[1]
		// filter?: {
		// 	type: Parameters<EffectSection['filter']>[0]
		// 	options: Parameters<EffectSection['filter']>[1]
		// }
		missed: z.literal(true).optional(),
		// attachTo?: Parameters<EffectSection['attachTo']>[1]
		// atLocation?: Parameters<EffectSection['atLocation']>[1]
		// stretchTo?: Parameters<EffectSection['stretchTo']>[1]
		// rotateTowards?: Parameters<EffectSection['rotateTowards']>[1],
		// anchor?: Parameters<EffectSection['anchor']>[0],
		// template?: Parameters<EffectSection['template']>[0],
		// loopProperty?: {
		// 	target: Parameters<EffectSection['loopProperty']>[0],
		// 	property: Parameters<EffectSection['loopProperty']>[1],
		// 	options: Parameters<EffectSection['loopProperty']>[2],
		// }[],
		// animateProperty?: {
		// 	target: Parameters<EffectSection['animateProperty']>[0],
		// 	property: Parameters<EffectSection['animateProperty']>[1],
		// 	options: Parameters<EffectSection['animateProperty']>[2],
		// }[],
		// shape: shape.or(z.array(shape)).optional(),
	})
	.strict()
