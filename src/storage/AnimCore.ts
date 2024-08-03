import { ErrorMsg, dedupeStrings, dev, devMessage, findTokenByActor, getPlayerOwners, log, nonNullable } from 'src/utils.ts'
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

function hasReference(reference: AnimationDataObject | ReferenceObject): reference is ReferenceObject {
	return typeof (reference as ReferenceObject).reference === 'string'
}

function isFolder(folder: AnimationDataObject | FolderObject): folder is FolderObject {
	return (folder as FolderObject).contents !== undefined
}

export let AnimCore = class AnimCore {
	/**
	 * Returns animation data:
	 * - "reference:to:another:animation"
	 * - [ { file: "123" } ]
	 * - [ { reference: "reference:to:another:animation", "predicate": ["gate:air"] } ]
	 */
	static getAnimations(): Record<string, string | (ReferenceObject | AnimationDataObject)[]> {
		return Object.keys(window.pf2eGraphics.modules)
			// Sort "pf2e-graphics" module to be the last one
			.sort((a, b) => a === 'pf2e-graphics' ? 1 : b === 'pf2e-graphics' ? -1 : 0)
			.reduce((acc, key) => ({ ...acc, ...window.pf2eGraphics.modules[key] }), {})
	}

	static getKeys(): string[] {
		return Object.keys(this.getAnimations())
	}

	static getReferences(data: AnimationDataObject | ReferenceObject): AnimationDataObject[] {
		if (!hasReference(data)) return [data]

		let animationObject = this.getAnimations()[data.reference]

		if (typeof animationObject === 'string')
			animationObject = AnimCore.getAnimationsArray(animationObject)

		animationObject = animationObject.map(x => foundry.utils.mergeObject(x, { ...data, reference: undefined }))

		return animationObject.flatMap(x => this.getReferences(x))
	}

	static getAnimationsArray(
		key: string | undefined,
		additionalAnimations?: ReturnType<typeof this.getAnimations>,
	): AnimationDataObject[] {
		if (!key || typeof key !== 'string') {
			throw new ErrorMsg(`You are trying to call 'getAnimationsArray' with a non-string value (${key})!`)
		}

		let animationObject = { ...this.getAnimations(), ...(additionalAnimations || {}) }[key]

		if (typeof animationObject === 'string') {
			animationObject = AnimCore.getAnimationsArray(animationObject)
		}

		return animationObject
			.flatMap(x => AnimCore.getReferences(x))
			.flatMap(x => AnimCore.unfoldAnimations(x))
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

	static prepRollOptions(array: string[]) {
		return dedupeStrings(this.uglifyRollOptions(array).concat([`graphics-quality:${settings.quality}`]))
	}

	static allAnimations(): { [key: string]: AnimationDataObject[] } {
		return AnimCore.getKeys().reduce((acc, key) => ({ ...acc, [key]: AnimCore.getAnimationsArray(key) }), {})
	}

	/** Not sure if this is a good idea, muddying up the waters. */
	static uglifyRollOptions(array: string[]) {
		return array
		// return array.flatMap(x => /self:|origin:/.exec(x) ? [x, x.split(':').slice(1).join(':')] : x)
	}

	/**
	 * Array of predicates is always required.
	 * The owner of the actor/item is required, but can be assumed to be the client if absent.
	 * The item is not required, as there can be item-less rolls with roll options.
	 * The actor is not required, for purposes of customizing item animations in the sidebar.
	 */
	static getMatchingAnimationTrees(
		array: string[] = [],
		actor?: ActorPF2e | null,
		item?: ItemPF2e | null,
	): Record<string, AnimationDataObject[]> {
		if (!array.length) return {}

		// Allow deletions in event players just dont want an animation at all.
		function merge<T extends object, U extends object = T>(a: T, b: U): T & U {
			return foundry.utils.mergeObject(a, b, { performDeletions: true })
		}

		/*
			If there are multiple owners, you'd want to use your own flags.
			If its not yours, just use whoever has it assigned as their default, or worst case scenario, whoever is first on the list.
		*/
		const owners = actor ? getPlayerOwners(actor) : [game.user]
		const user = owners.find(x => x.id === game.user.id) || owners[0]

		// Get all the flags.
		const userKeys = user.getFlag('pf2e-graphics', 'customAnimations') ?? {}
		const actorKeys = actor?.getFlag('pf2e-graphics', 'customAnimations') ?? {}
		const itemKeys = item?.getFlag('pf2e-graphics', 'customAnimations') ?? {}

		const customAnimations = merge(actorKeys, merge(userKeys, itemKeys)) as ReturnType<typeof this.getAnimations>
		const preparedOptions = this.prepRollOptions(array)
		const keys = merge(AnimCore.getKeys(), Object.keys(customAnimations))
		return keys
			.filter(key => preparedOptions.includes(key))
			.reduce((acc, key) => ({ ...acc, [key]: AnimCore.getAnimationsArray(key, customAnimations) }), {})
	}

	/**
	 Unfold a folder object consisting of `contents: AnimationDataObject[] | FolderObject` into a flat array of AnimationDataObject
	 All children under this folder inherit any other properties of the folder, such as `options`, `predicate`, etc.
	 The properties of children are not to be overriden by the parent folder, only concatenated or merged.
	 */
	static unfoldAnimations(folder: FolderObject | AnimationDataObject): AnimationDataObject[] {
		if (!isFolder(folder)) return [folder]
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
			.flatMap((x: AnimationDataObject | FolderObject) => isFolder(x) ? AnimCore.unfoldAnimations(x) : x)
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

		sequence.play({ preload: true, local: true })
	}

	static filterAnimations({ rollOptions: rollOptionsOG, item, trigger, narrow, actor }: {
		rollOptions: string[]
		item?: ItemPF2e | null
		trigger: TriggerTypes
		narrow: (a: AnimationDataObject) => boolean
		actor?: ActorPF2e | null
	}) {
		const rollOptions = this.prepRollOptions(rollOptionsOG)
		const animationTree = this.getMatchingAnimationTrees(rollOptions, actor, item)

		const validAnimations: { [key: string]: AnimationDataObject[] } = {}

		for (const [key, branch] of Object.entries(animationTree)) {
			let validBranchAnimations = branch.filter(a => a.trigger === trigger).filter(animation => game.pf2e.Predicate.test(animation.predicate, rollOptions)).filter(narrow)

			if (validBranchAnimations.filter(a => !a.default).length > 0) validBranchAnimations = validBranchAnimations.filter(a => !a.default)

			validAnimations[key] = validBranchAnimations
		}

		// Overrides handling
		Object.values(validAnimations)
			.map(anims => anims
				.flatMap(x => x.overrides)
				.filter(nonNullable),
			)
			.forEach((overrides) => {
				overrides.forEach(s => delete validAnimations[s])
			})

		return validAnimations
	}

	static async findAndAnimate({
		trigger,
		rollOptions,
		item,
		source,
		actor = item?.actor ?? source?.actor as ActorPF2e,
		...rest
	}: {
		item?: ItemPF2e | null
		actor?: ActorPF2e | null
		source?: TokenOrDoc | null
		rollOptions: string[]
		trigger: TriggerTypes
	}, narrow: (animation: AnimationDataObject) => boolean = () => true) {
		if (!actor) return log('No Actor Found! How did this happen?')
		if (!source) source = actor.getActiveTokens()[0] // TODO: Maybe rewrite to take multiple linked tokens into account?
		if (!source) return log('No Token Found to animate with! Aborting.')

		const validAnimations = this.filterAnimations({ rollOptions, item, trigger, narrow, actor })

		devMessage('Animating the Following', validAnimations, { trigger, rollOptions, item, actor, source })

		for (const anim of Object.values(validAnimations)) {
			const sequence = new Sequence({ inModuleName: 'pf2e-graphics', softFail: !dev })

			for (const animation of anim) {
				this.animate(
					foundry.utils.mergeObject({ options: rest }, animation),
					{ ...rest, sequence, item, actor, source },
				)
			}

			await sequence.play({ preload: true, local: true })
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
	| 'self-effect' // Unimplemented, not sure if there are any applicable use for those message types

interface AnimationDataObject {
	overrides?: string[]
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
