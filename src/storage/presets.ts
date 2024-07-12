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
	genericSequencerFunctions<T extends PresetKeys>(seq: EffectSection, _item: ItemPF2e, _target: Target, options?: EffectOptions<T>) {
		if (options?.scale)
			seq.scale(options.scale.min, options.scale.max)
		if (options?.scaleToObject)
			seq.scaleToObject(options.scaleToObject.value, options.scaleToObject)
		if (options?.filter)
			seq.filter(options.filter.type, options.filter.options)
		if (options?.waitUntilFinished)
			seq.waitUntilFinished(options?.waitUntilFinished)
		if (options?.locally)
			seq.locally(options.locally)
		if (options?.missed)
			seq.missed(options.missed)
		if (options?.rotate)
			seq.rotate(options.rotate ?? 0)
		if (options?.fadeIn)
			seq.fadeIn(options.fadeIn?.value, options.fadeIn)
		if (options?.fadeOut)
			seq.fadeOut(options.fadeOut?.value, options.fadeOut)
		if (options?.belowTokens)
			seq.belowTokens(options.belowTokens ?? false)
		if (options?.duration)
			seq.duration(options.duration)

		if (options?.persist)
			seq.persist(options.persist?.value || false, options.persist)
		if (options?.tieToDocuments)
			seq.tieToDocuments([_item])
		if (options?.mask)
			seq.mask()

		return seq
	},
}

type presetOptions<T> =
	T extends 'onToken' ? ('target' | 'source' | 'both') :
	T extends 'ranged' ? { bounce: true, file: string } :
	never

interface EffectOptions<T extends PresetKeys> {
	preset: presetOptions<T>
	locally: boolean
	tieToDocuments: true
	belowTokens: boolean
	waitUntilFinished: number
	duration: number
	rotate: number
	mask: true
	fadeIn: { value: number } & EasingOptions
	fadeOut: { value: number } & EasingOptions
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
	ranged: (seq: Sequence, { file, targets, source, options, item }: PresetIndex['ranged']) => {
		if (!targets || !targets.length)
			throw new ErrorMsg('Ranged animation requires a target token!')
		if (!source)
			throw new ErrorMsg('Ranged animation requires a source token!')

		for (const [i, target] of targets.entries()) {
			const section = seq.effect()
				.stretchTo(target, options?.stretchTo)

			if (options?.preset.bounce && i > 0) {
				section
					.atLocation(targets[i - 1], options?.atLocation)
					.file(options?.preset.file)
			} else {
				section
					.atLocation(source, options?.atLocation)
					.file(file)
			}

			helpers.genericSequencerFunctions(section, item, target, options)
		}

		return seq
	},
	melee: (seq: Sequence, { file, targets, source, options, item }: PresetIndex['melee']) => {
		if (!targets || !targets.length)
			throw new ErrorMsg('Melee animation requires a target token!')
		if (!source)
			throw new ErrorMsg('Melee animation requires a source token!')

		for (const target of targets) {
			const section = seq.effect()
				.file(file)
				.attachTo(source, options?.attachTo)
				.rotateTowards(target, options?.rotateTowards)

			helpers.genericSequencerFunctions(section, item, target, options)
		}

		return seq
	},
	onToken: (seq: Sequence, { file, targets, source, options, item }: PresetIndex['onToken']) => {
		const target = targets?.[0]
		const affectedToken = options?.preset === 'target' ? target : source

		if (!affectedToken)
			throw new ErrorMsg(`${options?.preset} is missing!`)

		const result = seq.effect()
			.file(file)
			.attachTo(affectedToken, options?.attachTo)
			.anchor(foundry.utils.mergeObject({ x: 0.5, y: 0.5 }, options?.anchor || {}))

		if (options?.rotateTowards)
			result.rotateTowards(target, options?.rotateTowards)

		return helpers.genericSequencerFunctions(result, item, affectedToken, options)
	},
	template: (seq: Sequence, { file, targets, options, item }: PresetIndex['template']) => {
		if (!targets || !targets.length)
			throw new ErrorMsg('Template animation requires a template!')

		for (const target of targets) {
			const section = seq.effect()
				.file(file)
				.attachTo(target, options?.attachTo)

			if (target.type === 'line' || target.type === 'cone')
				section.stretchTo(target, options?.stretchTo)

			helpers.genericSequencerFunctions(section, item, target, options)
		}

		return seq
	},
	macro: (seq: Sequence, data: PresetIndex['macro']) => seq.macro(data.macro, data),
	JSON: (seq: Sequence, jsonData: PresetIndex['JSON']) => seq.fromJSON(jsonData),
} as const

export type PresetKeys = keyof typeof presets

interface PresetIndex {
	ranged: GenericSequenceData<'ranged'>
	melee: GenericSequenceData<'melee'>
	onToken: GenericSequenceData<'onToken'>
	macro: MacroSequenceData
	template: TemplateSequenceData
	JSON: JSONSequenceData
}

interface GenericSequenceData<T extends PresetKeys> {
	sequence: Sequence
	file: string
	source?: TokenOrDoc
	targets?: Target[]
	item: ItemPF2e
	options?: EffectOptions<T>
}

type Target = (TokenOrDoc | MeasuredTemplateDocumentPF2e | Point)

type TemplateSequenceData = Omit<GenericSequenceData<'template'>, 'targets' | 'source'> & { targets?: MeasuredTemplateDocumentPF2e[], source?: TokenOrDoc }

type MacroSequenceData = GenericSequenceData<'JSON'> & { macro: string }
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
