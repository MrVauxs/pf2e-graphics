import { ErrorMsg } from 'src/utils'
import type { TokenOrDoc } from 'src/extensions'

export const helpers = {
	measureDistance(token: TokenOrDoc, target: TokenOrDoc) {
		return canvas.grid.measurePath([token, target])
	},
	measureDistanceFeet(token: TokenOrDoc, target: TokenOrDoc) {
		return this.measureDistance(token, target).distance
	},
	measureDistanceSpaces(token: TokenOrDoc, target: TokenOrDoc) {
		return this.measureDistance(token, target).spaces
	},
	parseOffset(offset: Point & { flip: { x: true, y: true } }, source: Point, target: Point) {
		const result = { x: offset.x, y: offset.y }
		if (offset.flip?.x && source.x > target.x)
			result.x *= -1
		if (offset.flip?.y && source.y > target.y)
			result.y *= -1
		return result
	},
	getCenterCoords(target: Target): Point | undefined {
		if (target instanceof TokenDocumentPF2e || target instanceof MeasuredTemplateDocumentPF2e) {
			return target._object?.center
		}
		if (target instanceof TokenPF2e || target instanceof MeasuredTemplatePF2e) {
			return target.center
		}
		return target
	},
}

export const presets = {
	ranged: (seq: Sequence, { file, targets, source, options }: PresetIndex['ranged']) => {
		const target = targets?.[0]
		if (!target)
			throw new ErrorMsg('Ranged animation requires a target token!')
		if (!source)
			throw new ErrorMsg('Ranged animation requires a source token!')

		return seq.effect()
			.file(file)
			.randomizeMirrorY()
			.missed(options?.missed ?? false)
			.persist(options?.persist ?? false)
			.stretchTo(options?.target?.center ? helpers.getCenterCoords(target) : target, options?.stretchTo)
			.atLocation(source, options?.atLocation
				? {
						...options?.atLocation,
						offset: helpers.parseOffset(options?.atLocation?.offset, source, target),
					}
				: undefined)
			.waitUntilFinished(options?.waitUntilFinished)
			.rotate(options?.rotate ?? 0)
			.fadeIn(options?.fadeIn ?? 0)
			.fadeOut(options?.fadeOut ?? 0)
	},
	melee: (seq: Sequence, { file, targets, source, options }: PresetIndex['melee']) => {
		const target = targets?.[0]
		if (!target)
			throw new ErrorMsg('Melee animation requires a target token!')
		if (!source)
			throw new ErrorMsg('Melee animation requires a source token!')

		const result = seq.effect()
			.file(file)
			.randomizeMirrorY()
			.missed(options?.missed ?? false)
			.persist(options?.persist ?? false)
			.attachTo(source, options?.attachTo
				? {
						...options?.attachTo,
						offset: helpers.parseOffset(options?.attachTo?.offset, source, target),
					}
				: undefined)
			.rotateTowards(target)
			.waitUntilFinished(options?.waitUntilFinished)
			.rotate(options?.rotate ?? 0)
			.fadeIn(options?.fadeIn ?? 0)
			.fadeOut(options?.fadeOut ?? 0)

		if (options?.scale)
			result.scale(options.scale.value, options.scale)
		if (options?.scaleToObject)
			result.scaleToObject(options.scaleToObject.value, options.scaleToObject)

		return result
	},
	onToken: (seq: Sequence, { file, targets, source, options }: PresetIndex['onToken']) => {
		const target = targets?.[0]
		const affectedToken = options?.preset === 'target' ? target : source
		if (options?.preset === 'target' && ![options?.preset])
			throw new ErrorMsg(`This onToken animation requires a ${options?.preset}!`)

		// TODO: REALLY DO THE NORMALIZED OPTIONS BELOW BECAUSE I NEED TO USE helpers.parseOffset IN HERE AND ITS BECOMING A MESS
		const result = seq.effect()
			.file(file)
			.randomizeMirrorY()
			.missed(options?.missed ?? false)
			.persist(options?.persist ?? false)
			.attachTo(affectedToken, options?.attachTo)
			.waitUntilFinished(options?.waitUntilFinished)
			.rotate(options?.rotate ?? 0)
			.fadeIn(options?.fadeIn ?? 0)
			.fadeOut(options?.fadeOut ?? 0)

		if (options?.scale)
			result.scale(options.scale.value, options.scale)
		if (options?.scaleToObject)
			result.scaleToObject(options.scaleToObject.value, options.scaleToObject)
		if (options?.filter)
			result.filter(options.filter.type, options.filter.options)

		return result
	},
	macro: (seq: Sequence, data: PresetIndex['macro']) => {
		return seq.macro(data.macro, data)
	},
	template: (seq: Sequence, { file, targets, options }: PresetIndex['template']) => {
		const target = targets?.[0]
		if (!target)
			throw new ErrorMsg('Template animation requires a template!')

		const result = seq.effect()
			.file(file)
			.attachTo(target, options?.attachTo)
			.stretchTo(target, options?.stretchTo)

		// TODO: Make this a normalized function for all .effects() as opposed to copy pasting it every time
		if (options?.scale)
			result.scale(options.scale.value, options.scale)
		if (options?.scaleToObject)
			result.scaleToObject(options.scaleToObject.value, options.scaleToObject)
		if (options?.filter)
			result.filter(options.filter.type, options.filter.options)

		return result
	},
} as const

export type PresetKeys = keyof typeof presets

interface PresetIndex {
	ranged: GenericSequenceData
	melee: GenericSequenceData
	onToken: GenericSequenceData
	macro: MacroSequenceData
	template: TemplateSequenceData
}

interface GenericSequenceData {
	sequence: Sequence
	file: string
	source?: TokenOrDoc
	targets?: Target[]
	options?: Record<string, any> & SequenceOptions
}

type Target = (TokenOrDoc | MeasuredTemplateDocumentPF2e | Point)

interface SequenceOptions {
	name: string
}

type TemplateSequenceData = Omit<GenericSequenceData, 'targets' | 'source'> & { targets?: MeasuredTemplateDocumentPF2e[], source?: TokenOrDoc }

type MacroSequenceData = GenericSequenceData & { macro: string }

function applyPresets(override?: boolean) {
	Object.keys(presets).forEach((key) => {
		const preset = presets[key as PresetKeys]
		if (typeof preset !== 'function') {
			throw new TypeError(`Invalid preset ${key}`)
		}
		Sequencer.Presets.add(key, preset, override)
	})
}

Hooks.once('sequencerReady', () => applyPresets())

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Explicitly after
	import.meta.hot.on('vite:afterUpdate', (module) => {
		if (module) {
			applyPresets(true)
			ui.notifications.info('Updated presets.ts!')
		}
	})
}
