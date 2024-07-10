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
	genericSequencerFunctions(seq: EffectSection, options: EffectOptions) {
		if (options?.scale)
			seq.scale(options.scale.min, options.scale.max)
		if (options?.scaleToObject)
			seq.scaleToObject(options.scaleToObject.value, options.scaleToObject)
		if (options?.filter)
			seq.filter(options.filter.type, options.filter.options)
		if (options?.waitUntilFinished)
			seq.waitUntilFinished(options?.waitUntilFinished)

		return seq
			.locally(options.locally)
			.rotate(options?.rotate ?? 0)
			.fadeIn(options?.fadeIn ?? 0)
			.fadeOut(options?.fadeOut ?? 0)
			.missed(options?.missed ?? false)
			.persist(options?.persist?.value || false, options?.persist)
	},
}

interface EffectOptions {
	preset: 'target' | 'source' | 'both'
	locally: boolean
	waitUntilFinished: number
	rotate: number
	fadeIn: number
	fadeOut: number
	scale: {
		min: number | { x: number, y: number }
		max?: number
	}
	scaleToObject: { value: number } & Parameters<EffectSection['scaleToObject']>[1]
	filter: {
		type: Parameters<EffectSection['filter']>[0]
		options: Parameters<EffectSection['filter']>[1]
	}
	missed: boolean
	persist: { value: boolean } & Parameters<EffectSection['persist']>[1]
	attachTo: Parameters<EffectSection['attachTo']>[1]
	atLocation: Parameters<EffectSection['atLocation']>[1]
	stretchTo: Parameters<EffectSection['stretchTo']>[1]
	rotateTowards: Parameters<EffectSection['rotateTowards']>[1]
	anchor: Parameters<EffectSection['anchor']>[0]
}

export const presets = {
	ranged: (seq: Sequence, { file, targets, source, options }: PresetIndex['ranged']) => {
		if (!targets || !targets.length)
			throw new ErrorMsg('Ranged animation requires a target token!')
		if (!source)
			throw new ErrorMsg('Ranged animation requires a source token!')

		for (const target of targets) {
			const section = seq.effect()
				.file(file)
				.atLocation(source, options?.atLocation)
				.stretchTo(target, options?.stretchTo)

			helpers.genericSequencerFunctions(section, options as EffectOptions)
		}

		return seq
	},
	melee: (seq: Sequence, { file, targets, source, options }: PresetIndex['melee']) => {
		if (!targets || !targets.length)
			throw new ErrorMsg('Melee animation requires a target token!')
		if (!source)
			throw new ErrorMsg('Melee animation requires a source token!')

		for (const target of targets) {
			const section = seq.effect()
				.file(file)
				.attachTo(source, options?.attachTo)
				.rotateTowards(target, options?.rotateTowards)

			helpers.genericSequencerFunctions(section, options as EffectOptions)
		}

		return seq
	},
	onToken: (seq: Sequence, { file, targets, source, options }: PresetIndex['onToken']) => {
		const target = targets?.[0]
		const affectedToken = options?.preset === 'target' ? target : source

		if (options?.preset === 'target' && ![options?.preset])
			throw new ErrorMsg(`This onToken animation requires a ${options?.preset}!`)

		if (!affectedToken)
			throw new ErrorMsg(`${options?.preset} is missing!`)

		const result = seq.effect()
			.file(file)
			.attachTo(affectedToken, options?.attachTo)
			.anchor(foundry.utils.mergeObject({ x: 0.5, y: 0.5 }, options?.anchor || {}))

		if (options?.rotateTowards)
			result.rotateTowards(target, options?.rotateTowards)

		return helpers.genericSequencerFunctions(result, options as EffectOptions)
	},
	template: (seq: Sequence, { file, targets, options }: PresetIndex['template']) => {
		const target = targets?.[0]
		if (!target)
			throw new ErrorMsg('Template animation requires a template!')

		const result = seq.effect()
			.file(file)
			.attachTo(target, options?.attachTo)

		if (target.type === 'line' || target.type === 'cone') result.stretchTo(target, options?.stretchTo)

		return helpers.genericSequencerFunctions(result, options as EffectOptions)
	},
	macro: (seq: Sequence, data: PresetIndex['macro']) => seq.macro(data.macro, data),
	JSON: (seq: Sequence, jsonData: PresetIndex['JSON']) => seq.fromJSON(jsonData),
} as const

export type PresetKeys = keyof typeof presets

interface PresetIndex {
	ranged: GenericSequenceData
	melee: GenericSequenceData
	onToken: GenericSequenceData
	macro: MacroSequenceData
	template: TemplateSequenceData
	JSON: JSONSequenceData
}

interface GenericSequenceData {
	sequence: Sequence
	file: string
	source?: TokenOrDoc
	targets?: Target[]
	options?: EffectOptions
}

type Target = (TokenOrDoc | MeasuredTemplateDocumentPF2e | Point)

type TemplateSequenceData = Omit<GenericSequenceData, 'targets' | 'source'> & { targets?: MeasuredTemplateDocumentPF2e[], source?: TokenOrDoc }

type MacroSequenceData = GenericSequenceData & { macro: string }
type JSONSequenceData = any

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
