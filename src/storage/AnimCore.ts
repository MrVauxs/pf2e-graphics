import { ErrorMsg, dedupeStrings, dev, devMessage, findTokenByActor } from 'src/utils.ts'
import type { Entries, TokenOrDoc } from 'src/extensions'
import { settings } from 'src/settings'
import type { PresetKeys } from './presets'

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
	parseOffset(offset: { x: number, y: number, flip: { x: true, y: true } }, source: TokenOrDoc, target: TokenOrDoc) {
		const result = { x: offset.x, y: offset.y }
		if (offset.flip.x && source.x > target.x)
			result.x *= -1
		if (offset.flip.y && source.y > target.y)
			result.y *= -1
		return result
	},
}

export let AnimCore = class AnimCore {
	static getAnimations(): Record<string, string | ReferenceObject | AnimationDataObject[]> {
		return Object.keys(window.pf2eGraphics.modules)
			// Sort "pf2e-graphics" module to be the last one
			.sort((a, b) => a === 'pf2e-graphics' ? 1 : b === 'pf2e-graphics' ? -1 : 0)
			.reduce((acc, key) => ({ ...acc, ...window.pf2eGraphics.modules[key] }), {})
	}

	static getKeys(): string[] {
		return Object.keys(this.getAnimations())
	}

	static getAnimationObject(key: string | undefined): AnimationDataObject[] {
		if (!key || typeof key !== 'string') {
			throw new ErrorMsg(`You are trying to call 'getAnimationObject' with a non-string value (${key})!`)
		}

		const animationObject = this.getAnimations()[key]

		if (typeof animationObject === 'string') {
			return AnimCore.getAnimationObject(animationObject)
		}

		if (this.isReference(animationObject)) {
			const reference = AnimCore.getAnimationObject(animationObject.reference)
			if (!reference) {
				throw new ErrorMsg(`There is a missing reference at ${JSON.stringify(animationObject)}`)
			}

			// References can have their own properties which override anything upstream
			return foundry.utils.mergeObject(reference, { ...animationObject, reference: undefined })
		}

		return animationObject
			.flatMap((x: AnimationDataObject | FolderObject) => this.isFolder(x) ? AnimCore.unfoldAnimations(x) : x)
			.map(a => ({ ...a, file: this.parseFile(a.file) }))
	}

	// Removes any inline {randomOptions} from the file path and returns the valid file path with one of the options randomly picked
	static parseFile(file: string = ''): string {
		const match = file.match(/\{(.*?)\}/)
		if (!match)
			return file

		const [_, options] = match
		const parsedOptions = options.split(',')
		const randomOption = Sequencer.Helpers.random_array_element(parsedOptions)
		return file.replace(`{${options}}`, randomOption)
	}

	static isReference(reference: AnimationDataObject[] | ReferenceObject): reference is ReferenceObject {
		return typeof (reference as ReferenceObject).reference === 'string'
	}

	static isFolder(folder: AnimationDataObject | FolderObject): folder is FolderObject {
		return (folder as FolderObject).contents !== undefined
	}

	static prepRollOptions(array: string[]) {
		return dedupeStrings(this.uglifyRollOptions(array).concat([`graphics-quality:${settings.quality}`]))
	}

	static allAnimations(): { [key: string]: AnimationDataObject[] } {
		return AnimCore.getKeys().reduce((acc, key) => ({ ...acc, [key]: AnimCore.getAnimationObject(key) }), {})
	}

	// Not sure if this is a good idea but worst case scenario we are just gonna have to add annoying prefixes to a bunch of stuff
	static uglifyRollOptions(array: string[]) {
		return array.flatMap(x => /self:|origin:/.exec(x) ? [x, x.split(':').slice(1).join(':')] : x)
	}

	static getMatchingAnimationTrees(
		array: string[] | undefined,
		_item?: ItemPF2e | null,
		_userId?: User['id'],
	): Record<string, AnimationDataObject[]> {
		if ((_item || _userId)) devMessage('Item and User animations are not yet implemented in getMatchingAnimationTrees!')
		if (!array) return {}

		const preparedOptions = this.prepRollOptions(array)
		return AnimCore.getKeys()
			.filter(key => preparedOptions.includes(key))
			.reduce((acc, key) => ({ ...acc, [key]: AnimCore.getAnimationObject(key) }), {})
	}

	// Unfold a folder object consisting of `contents: AnimationDataObject[] | FolderObject` into a flat array of AnimationDataObject
	// All children under this folder inherit any other properties of the folder, such as `options`, `predicate`, etc.
	// The properties of children are not to be overriden by the parent folder, only concatenated or merged.
	static unfoldAnimations(folder: FolderObject): AnimationDataObject[] {
		const { contents, ...parentProps } = folder

		// Function to merge two arrays without duplicates
		const mergeArrays = (arr1: PredicateStatement[], arr2: PredicateStatement[]) => {
			return Array.from(new Set([...(arr1 || []), ...(arr2 || [])]))
		}

		const mergeProps = (parent: FolderObject, child: AnimationDataObject) => {
			const result = foundry.utils.mergeObject(child, parent, { overwrite: false })

			// Merge arrays
			for (const [key, val] of Object.entries(parent) as Entries<FolderObject>) {
				if (Array.isArray(val) && key !== 'contents') {
					result[key] = mergeArrays(parent[key], child[key] || [])
				}
			}

			return result
		}

		return (contents || [])
			.flatMap((x: AnimationDataObject | FolderObject) => this.isFolder(x) ? AnimCore.unfoldAnimations(x) : x)
			.map(child => mergeProps(parentProps, child))
	}

	static animate(animation: AnimationDataObject, data: Record<string, any> & { sequence?: Sequence }): void {
		devMessage('Animate', animation, data)

		if (!data.sequence) throw new ErrorMsg('No Sequence defined in AnimCore.animate()!')

		data.sequence.preset(animation.preset, { file: animation.file, options: animation.options, ...data })
	}

	static testAnimation(animationData: AnimationDataObject, item: ItemPF2e) {
		const sequence = new Sequence({ inModuleName: 'pf2e-graphics' })
		this.animate(
			animationData,
			{
				targets: Array.from(game.user.targets),
				source: findTokenByActor(item.actor) ?? canvas.tokens.controlled[0],
				item,
				sequence,
			},
		)

		sequence.play({ local: true })
	}

	static findAndAnimate({
		trigger,
		rollOptions,
		item,
		...rest
	}: { item?: ItemPF2e | null, rollOptions: string[], trigger: TriggerTypes }, narrow: (animation: AnimationDataObject) => boolean = () => true) {
		const animationTree = this.getMatchingAnimationTrees(rollOptions, item, game.userId)
		devMessage('Animation Tree', animationTree, { trigger, rollOptions, item })

		for (const branch of Object.values(animationTree)) {
			let validAnimations = branch.filter(a => a.trigger === trigger).filter(animation => game.pf2e.Predicate.test(animation.predicate, rollOptions)).filter(narrow)

			if (validAnimations.filter(a => !a.default).length > 0) validAnimations = validAnimations.filter(a => !a.default)

			const sequence = new Sequence({ inModuleName: 'pf2e-graphics', softFail: !dev })

			for (const animation of validAnimations) {
				this.animate(animation, { ...rest, sequence, item })
			}

			sequence.play({ local: true })
		}
	}
}

if (import.meta.hot) {
	import.meta.hot.accept((newModule) => {
		if (newModule) {
			AnimCore = newModule?.AnimCore
			window.pf2eGraphics.AnimCore = newModule?.AnimCore
			window.AnimCore = newModule?.AnimCore
			ui.notifications.info('AnimCore updated!')
		}
	})
}

// #region JSON Data Parsing
type FolderObject = Partial<AnimationDataObject> & { contents?: (AnimationDataObject | FolderObject)[] }
type ReferenceObject = Partial<AnimationDataObject> & { reference: string }
// #endregion

// #region Animation Data Parsing
export type TriggerTypes =
	| 'attack-roll'
	| 'damage-roll'
	| 'spell-cast'
	| 'damage-taken'
	| 'saving-throw'
	| 'place-template'
	| CheckType
	| 'effect'
	| 'toggle'
	| 'startTurn'
	| 'endTurn'

interface AnimationDataObject {
	trigger: TriggerTypes
	preset: PresetKeys
	file: string
	default?: boolean
	predicate?: PredicateStatement[]
	options?: any
}

// #endregion

declare global {
	interface Window {
		pf2eGraphics: pf2eGraphics
		AnimCore: typeof AnimCore
	}
	interface pf2eGraphics {
		modules: Record<string, Record<string, string | ReferenceObject | AnimationDataObject[]>>
		AnimCore: typeof AnimCore
	}
}
