import type { TokenOrDoc } from '../extensions';
import type { liveSettings, storeSettingsType } from '../settings.ts';
import { get, writable, type Writable } from 'svelte/store';
import {
	type AnimationSet,
	type AnimationSetsObject,
	type ModuleDataObject,
	payloadTypeList,
	type TokenImage,
	type Trigger,
	triggerList,
} from '../../schema';
import { decodePayload } from '../payloads/index.ts';
import {
	dedupeStrings,
	dev,
	devLog,
	ErrorMsg,
	getPlayerOwners,
	log,
	mergeObjectsConcatArrays,
	nonNullable,
} from '../utils.ts';

/**
 * A reduced copy of `ModuleDataObject`—the complete, merged JSON data available to *PF2e Graphics*—written as a JavaScript `Map`. `_tokenImages` is excluded for simplicity.
 */
export type JSONMap = Map<string, string | AnimationSet[]>;

/**
 * A validated, verified, applicable, unrolled animation set.
 *
 * @remarks An object with this type, strictly, should lack `reference`, `overrides`, `contents`, and `default`. This might not always *actually* always be the case to keep the code simple, so avoid iterating over keys where possible! Additionally, the modifications on `AnimationSet` (especially the requirement of `execute`) are only actually guaranteed if the input data validates against the schema; many aspects aren't verified at runtime.
 *
 * @todo `unfoldAnimationSets()` is the source of the above inexactness.
 */
export type ExecutableAnimation = Omit<AnimationSet, 'reference' | 'contents' | 'default' | 'overrides'> &
	Required<Pick<AnimationSet, 'execute'>>;

export interface AnimationHistoryObject {
	timestamp: number;
	rollOptions: string[];
	trigger: Trigger | Trigger[];
	animations: ExecutableAnimation[];
	actor: { name: string; uuid: string };
	item?: { name: string; uuid: string };
	user?: { name: string; id: string };
}

declare global {
	interface Window {
		pf2eGraphics: pf2eGraphics;
		AnimCore: typeof AnimCore;
	}
	interface pf2eGraphics {
		socket: SocketlibSocket;
		modules: ModuleDataObject;
		AnimCore: typeof AnimCore;
		liveSettings: liveSettings;
		storeSettings: storeSettingsType;
		history: Writable<AnimationHistoryObject[]>;
		locations: Writable<{ name: string; location: object }[]>;
	}
}

export let AnimCore = class AnimCore {
	// #region Data Retrieval
	/**
	 * Returns raw animation data, with contents, references, etc.
	 */
	static getAnimations(): JSONMap {
		// Sort "pf2e-graphics" module to be the first one, so everyone overrides it
		return new Map(
			Object.keys(window.pf2eGraphics.modules)
				.sort((a, b) => (a === 'pf2e-graphics' ? -1 : b === 'pf2e-graphics' ? 1 : 0))
				.flatMap(key => Object.entries(window.pf2eGraphics.modules[key])),
		);
	}

	static updateAnimations() {
		this.animationsStore.set(this.getAnimations());
		this.keysStore.set(this.getKeys());
	}

	static animationsStore: Writable<JSONMap> = writable(new Map());

	static get animations(): JSONMap {
		return get(this.animationsStore);
	}

	static getKeys(): string[] {
		return Array.from(this.animations.keys()).filter(x => !x.startsWith('_'));
	}

	static keysStore: Writable<string[]> = writable(this.getKeys());

	static get keys(): string[] {
		return get(this.keysStore);
	}

	static getTokenImages() {
		// We can just handily assume that this is real :)
		return ((this.animations.get('_tokenImages') ?? []) as unknown as TokenImage[])
			.filter(x => (x?.requires ? !!game.modules.get(x.requires) : true))
			.map(x => ({
				...x,
				rules: x.rules.map((rule) => {
					if (!Array.isArray(rule)) return rule;
					return {
						key: 'TokenImage',
						predicate: [`self:effect:${rule[0]}`],
						value: rule[1],
						scale: rule[2],
						ring: {
							subject: {
								texture: rule[3],
								scale: rule[4],
							},
						},
					};
				}),
			}));
	}
	// #endregion

	// #region Utils
	static parseFiles(files: string[]): string {
		const noHandlebars = files.flatMap((file) => {
			const match = file.match(/\{(.*?)\}/);
			if (!match) return file;

			const options = match[1];
			const parsedOptions = options.split(',');
			return parsedOptions.map(x => file.replace(`{${options}}`, x));
		});
		return Sequencer.Helpers.random_array_element(noHandlebars);
	}

	static prepRollOptions(array: string[]): string[] {
		const extras: string[] = [];

		extras.push(`settings:quality:${window.pf2eGraphics.liveSettings.quality}`);

		if (window.pf2eGraphics.liveSettings.persistent) extras.push('settings:persistent');

		if (dev) {
			extras.push(`jb2a:${window.pf2eGraphics.liveSettings.jb2aMode}`);
		} else {
			if (game.modules.get('jb2a_patreon')?.active) extras.push('jb2a:patreon');
			if (game.modules.get('JB2A_DnD5e')?.active) extras.push('jb2a:free');
		}

		return dedupeStrings(array.concat(extras));
	}

	static createHistoryEntry(data: Omit<AnimationHistoryObject, 'timestamp'>) {
		log('Added a new animation history entry.', data);
		window.pf2eGraphics.history.update((v) => {
			v.push({
				timestamp: Date.now(),
				...data,
				actor: { name: data.actor.name, uuid: data.actor.uuid },
				item: nonNullable(data.item) ? { name: data.item.name, uuid: data.item.uuid } : undefined,
			});
			return v;
		});
	}

	static CONST = {
		PAYLOAD_TYPES: payloadTypeList,
		TRIGGERS: triggerList,
	};

	static addNewAnimation(data: AnimationSetsObject, overwrite = true) {
		return foundry.utils.mergeObject(window.pf2eGraphics.modules, data, { overwrite });
	}
	// #endregion

	// #region Method 0.10

	/**
	 * Trigger Data in.
	 *
	 * 1. Run `retrieve()` to get all the animations proper.
	 * 2. Run `search()` on retrieved animations to get what we are looking for.
	 * 3. Run `play()` on found animations.
	 *
	 * Exit.
	 */
	static animate(
		{
			trigger,
			rollOptions,
			item,
			actor,
			targets,
			sources,
			animationOptions = {},
			user,
		}: {
			rollOptions: string[];
			trigger: Trigger;
			actor: ActorPF2e | null;
			sources: TokenOrDoc[];
			item?: ItemPF2e | null;
			animationOptions?: object;
			targets?: (TokenOrDoc | string | Point)[];
			user?: string;
		},
		devName?: string,
	) {
		// eslint-disable-next-line prefer-rest-params
		devLog(devName, arguments[0]);
		if (!actor) return log('No actor found! Aborting.');
		if (!sources) return log('No source token found on the active scene! Aborting.');

		rollOptions = this.prepRollOptions(rollOptions);

		const allAnimations = AnimCore.retrieve(rollOptions, item, actor).animations;
		const foundAnimations = AnimCore.search(
			rollOptions,
			[trigger],
			new Map(Object.entries(allAnimations as AnimationSetsObject)), // Technically false, but we can ignore `_tokenImages` here
		);
		const appliedAnimations = Object.values(foundAnimations).map(x =>
			x.map(x => mergeObjectsConcatArrays({ options: animationOptions } as any, x)),
		);
		this.createHistoryEntry({
			rollOptions,
			actor,
			animations: appliedAnimations.flat(),
			trigger,
			item: nonNullable(item) ? item : undefined,
			user: user ? { name: game.users.get(user)!.name, id: user } : undefined,
		});

		return this.play(appliedAnimations, sources, targets, nonNullable(item) ? item : undefined, user);
	}

	/**
	 * Documents in, Stored Animations out.
	 * Retrieves all available animations from the item, actor, user, world, settings, etc.
	 * These animations are RAW.
	 */
	static retrieve(
		rollOptions: string[] = [],
		item?: ItemPF2e<any> | null,
		actor: ActorPF2e<any> | null | undefined = item?.actor,
	): { animations: ModuleDataObject; sources: Record<string, string[]> } {
		const obj = {
			animations: {},
			sources: {},
		};
		/*
			From a list of owners, find either the "true" owner (assigned user) or yourself if you are one of them.
			Otherwise, default to whoever is first.
		*/
		const owners = actor ? getPlayerOwners(actor) : [game.user];

		const itemOriginId = rollOptions
			.find(x => x.includes('origin:item:id:'))
			?.split(':')
			.at(-1);
		const itemOrigin = item?.origin?.items?.get(itemOriginId || '');

		// Get all the flags.
		// TODO: Convert flags to arrays, and then from those arrays to objects here.
		const userKeys = owners
			.map(u => u.getFlag('pf2e-graphics', 'customAnimations') ?? {})
			.reduce((p, c) => foundry.utils.mergeObject(p, c), {});
		const actorOriginKeys = item?.origin?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const itemOriginKeys = itemOrigin?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const actorKeys = actor?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const itemKeys = item?.getFlag('pf2e-graphics', 'customAnimations') ?? {};

		// Priority (highest to lowest): Item > Actor (Affected) > Item (Origin) > Actor (Origin) > User > Global
		obj.animations = {
			...Object.fromEntries(AnimCore.animations.entries()),
			// ...window.pf2eGraphics.liveSettings.globalAnimations,
			// ...userKeys,
			...actorOriginKeys,
			...itemOriginKeys,
			...actorKeys,
			...itemKeys,
		} as ReturnType<typeof this.getAnimations>;

		obj.sources = {
			preset: AnimCore.keys,
			// world: Object.keys(window.pf2eGraphics.liveSettings.globalAnimations),
			// user: Object.keys(userKeys),
			origin: Object.keys(itemOriginKeys),
			actorOrigin: Object.keys(actorOriginKeys),
			itemOrigin: Object.keys(itemOriginKeys),
			actor: Object.keys(itemKeys),
			item: Object.keys(itemKeys),
		} as const;

		return obj;
	}

	/**
	 * Trigger Data in, Animations out.
	 * Checks the rollOptions against provided animations and outputs whatever matches.
	 * Meant to be used in conjunction with retrieve() for the second parameter.
	 */
	static search(
		rollOptions: string[],
		triggers: string[] = [],
		animationData: JSONMap = AnimCore.animations,
	): Record<string, ExecutableAnimation[]> {
		const unfoldedAnimationSets: [string, ReturnType<typeof unfoldAnimationSets>][] = [];

		for (const [rollOption, animations] of animationData.entries()) {
			if (!rollOptions.includes(rollOption)) continue;
			const animationObjects = parseStrings(animations, rollOption);
			const animationObjectsSansReference = parseReferences(animationObjects, rollOption);
			const applicableAnimations = filterChildren(animationObjectsSansReference);
			const unfoldedAnimations = unfoldAnimationSets(applicableAnimations);
			unfoldedAnimationSets.push([rollOption, unfoldedAnimations]);
		}

		// Limit ourselves to the animations that match our triggers.
		// TODO: Optimize this to not run on every animation and skip the `map` entirely if no triggers are present.
		const triggeredAnimations = unfoldedAnimationSets.map(
			([rollOption, animations]) =>
				[rollOption, filterByTriggers(animations)] as (typeof unfoldedAnimationSets)[0],
		);

		const notOverriddenAnimations = filterByOverride(triggeredAnimations);

		return Object.fromEntries(notOverriddenAnimations) as Record<string, ExecutableAnimation[]>;

		// #region Functions

		/**
		 * De-references a `ModuleAnimationData` roll option of shorthand string references, returning a strict collection of `AnimationSet` objects.
		 *
		 * For example, if the module has the following animation data
		 * ```json
		 * {
		 * 	"roll-option-1": "roll-option-2",
		 * 	"roll-option-2": [ { "props": "etc." } ],
		 * 	"unrelated-roll-option": [ { "something": "else" } ],
		 * }
		 * ```
		 * the triggering roll data matches predicate `roll-option-1`, then this function returns with
		 * ```ts
		 * [ { props: "etc." } ]
		 * ```
		 * @param animationSet The payload attached to `rollOption`.
		 * @param rollOption The triggering roll option (for error-reporting only).
		 * @param recursionDepth How many look-ups were needed to reach this point. (Internal use only; defaults to 0.)
		 * @returns An array of (folded-up) `AnimationSet` objects.
		 */
		function parseStrings(
			animationSet: string | AnimationSet[] | undefined,
			rollOption: string,
			recursionDepth: number = 0,
		): AnimationSet[] {
			if (recursionDepth > 30) {
				throw new ErrorMsg(
					`Animation for \`${rollOption}\` recurses too many times! Do its references form an infinite loop?`,
				);
			}
			if (typeof animationSet === 'object') return foundry.utils.deepClone(animationSet);
			if (typeof animationSet !== 'string')
				throw new ErrorMsg('Could not find referenced payload in ${}—run validation scripts to verify.');
			return parseStrings(animationData.get(animationSet), rollOption, recursionDepth + 1);
		}

		/**
		 * Transforms `AnimationSet` objects by copying its `reference` into its `contents` (overwriting any `contents` already included).
		 * @param animations An array of `AnimationSet` objects that potentially contain the `reference` property.
		 * @param rollOption The triggering roll option (for error-reporting only)
		 * @returns An array of `AnimationSet` objects with no `reference` property.
		 */
		function parseReferences(
			animations: AnimationSet[],
			rollOption: string,
		): Omit<AnimationSet, 'reference'>[] {
			return animations.map((obj) => {
				if ('reference' in obj) {
					const ref = parseStrings(animationData.get(obj.reference!)!, rollOption);

					// We are asserting that a Reference cannot have contents, otherwise we are mixing two contents at once and pretty much making mixins.
					obj.contents = ref;

					// Remove reference.
					delete obj.reference;
				}
				return obj;
			});
		}

		/**
		 * Filters `AnimationSet` objects based on its topmost `predicates` property.
		 * @remarks Unfolding animations is costly, and most payloads will be filtered out anyway, so predicates are checked early.
		 * @remarks Inputs with `predicates` left undefined or empty are never filtered out.
		 * @param animations An array of `AnimationSet` objects.
		 * @returns An array of `AnimationSet` objects with matching topmost `predicates`.
		 */
		function filterChildren<T extends { predicates?: PredicateStatement[] }>(animations: T[]) {
			return animations.filter(animation => game.pf2e.Predicate.test(animation.predicates, rollOptions));
		}

		/**
		 * 'Unfolds' `AnimationSet`s into their 'executable' form. This removes all remaining references, shorthands, and nested structures. Unfolded `AnimationSet`s are tested against the triggering roll data and only returned if they match.
		 * @param animationSet An array of `AnimationSet` objects without any `reference` properties.
		 * @returns An array of `AnimationSet` objects without any `reference`, `default`, or `contents` properties (i.e. an array of unfolded `AnimationSet`s).
		 */
		function unfoldAnimationSets(
			animationSet: Omit<AnimationSet, 'reference'>[],
		): Omit<AnimationSet, 'reference' | 'default' | 'contents'>[] {
			return animationSet.flatMap((folder) => {
				// `default` affects the child-selection process (see below), so can be deleted.
				delete folder.default;

				// Childless animations don't need unfolding.
				if (!folder.contents) return folder;

				// First get the children with valid predicates. Children with no predicates will match.
				let validChildren = folder.contents.filter(x =>
					game.pf2e.Predicate.test(x.predicates, rollOptions),
				);

				// One child animation can be labelled as `default`, which causes it to be applied if and only if no child animations' predicates match.
				if (!validChildren.length && folder.contents.some(x => x.default)) {
					// If there are no valid children, then we need to find the default children and make them valid.
					validChildren = folder.contents.filter(x => x.default);
				} else {
					// If there are valid children, remove the default children from the valid options.
					validChildren = validChildren.filter(x => !x.default);
				}

				// We no longer need this.
				delete folder.contents;

				// Recurse to unfold the children's children, and then perform a final predicate test.
				return unfoldAnimationSets(
					// Merge children into the parent.
					validChildren.map(child => mergeObjectsConcatArrays(folder, child)),
				).filter(child => game.pf2e.Predicate.test(child.predicates, rollOptions));
			});
		}

		/**
		 * Filters `AnimationSet` objects based on its topmost `triggers` property.
		 * @remarks Inputs with `triggers` left undefined or empty are never filtered out.
		 * @param animations An array of `AnimationSet` objects.
		 * @returns An array of `AnimationSet` objects with matching `triggers`.
		 */
		function filterByTriggers<T extends { triggers?: Trigger[] }>(animations: T[]) {
			return animations.filter(
				animation =>
					// TODO: Optimize this to not run on every animation
					!animation.triggers?.length // Undefined or empty `triggers` is interpreted as triggering on everything
					|| animation.triggers.find(t => triggers.includes(t)),
			);
		}

		function filterByOverride(
			animationSets: [string, ReturnType<typeof unfoldAnimationSets>][],
		): [string, ReturnType<typeof unfoldAnimationSets>][] {
			for (const animationSet of animationSets) {
				for (const animation of animationSet[1]) {
					if (!animation.overrides) continue;
					for (const override of animation.overrides) {
						if (override === '*') return [animationSet]; // Overrides everything
						animationSets = animationSets.filter(([rollOption]) => !rollOption.startsWith(override));
					}
				}
			}
			return animationSets;
		}

		// #endregion
	}

	// TODO: unused; delete?
	// static async createSequenceInQueue(
	// 	queue: Sequence[],
	// 	animation: ExecutableAnimation,
	// 	data: GameData,
	// 	index: number = -1,
	// 	replace: boolean = false,
	// ) {
	// 	const sequence = new Sequence({ inModuleName: 'pf2e-graphics', softFail: !dev });

	// 	await addAnimationToSequence(sequence, animation.execute, data);

	// 	queue.splice(index, replace ? 1 : 0, sequence);
	// }

	/**
	 * Animations in, Sequences out.
	 */
	static async play(
		rawAnimationSets: ExecutableAnimation[][],
		sources: TokenOrDoc[],
		targets?: (TokenOrDoc | string | Point)[],
		item?: ItemPF2e<any>,
		user?: string,
	) {
		const sequences: Sequence[] = [];

		type addOnGenericAnimation = ExecutableAnimation & {
			generic: Extract<AnimationSet['generic'], { type: 'add-on' }>;
		};
		const addOns: addOnGenericAnimation[] = [];

		// Move every add-on to `addOns`
		const animationSets = rawAnimationSets
			.map(set =>
				set.filter((animation) => {
					if (animation.generic?.type !== 'add-on') return true;
					addOns.push(animation as addOnGenericAnimation);
					return false;
				}),
			)
			.filter(set => set.length);

		for (const animationSet of animationSets) {
			// Generic animations need to be merged into their 'templates'.
			for (const addOn of addOns) {
				if (addOn.name) {
					// If the add-on has a name ID, then look for a matching `slot` to fill.
					const slotPosition = animationSet.findIndex(
						animation => animation.generic?.type === 'slot' && animation.name === addOn.name,
					);

					// If slot can't be found (either it doesn't exist or it's been overridden), then just skip the add-on.
					if (slotPosition === -1) continue;

					// Slot has been found! Replace it with the add-on.
					animationSet.splice(slotPosition, 1, addOn);
				} else {
					// If the add-on has no name ID, or the name ID isn't found in the animation set, simply prepend/append the add-on as determined by `generic.order`.
					// Note that `addOn.generic.order === 'first'` is the default.
					if (addOn.generic.order === 'last') {
						animationSet.push(addOn);
					} else {
						animationSet.unshift(addOn);
					}
				}
			}

			// Time to construct the sequence!
			const sequence = new Sequence({ inModuleName: 'pf2e-graphics', softFail: !dev });
			for (const [index, animation] of animationSet.entries()) {
				const decodedPayload = await decodePayload(animation.execute, {
					// queue: sequences,
					currentIndex: index,
					// animations: animationSet,
					targets,
					item,
					sources,
					user,
				});
				if (decodedPayload.type === 'sequence') {
					sequence.addSequence(decodedPayload.data);
				} else if (decodedPayload.type === 'namedLocation') {
					sequence.addNamedLocation(decodedPayload.data.name, decodedPayload.data.position);
				} else if (decodedPayload.type === 'null') {
					// do nothing
				} else {
					throw new ErrorMsg('Execution failed (fatal error in `decodePayload()`!).');
				}
			}

			sequences.push(sequence);
		}

		return sequences.map(seq => seq.play({ local: true, preload: true }));
	}
	// #endregion
};

Hooks.once('ready', () => {
	if (!game.modules.get('pf2e-modifiers-matter')?.active)
		// @ts-expect-error Modifiers Matter Safeguards
		AnimCore.CONST.TRIGGERS = AnimCore.CONST.TRIGGERS.filter(x => x !== 'modifiers-matter');
});

// HMR
if (import.meta.hot) {
	import.meta.hot.accept((newModule) => {
		if (newModule) {
			AnimCore = newModule?.AnimCore;
			window.pf2eGraphics.AnimCore = newModule?.AnimCore;
			window.AnimCore = newModule?.AnimCore;
			AnimCore.updateAnimations();
			ui.notifications.info('AnimCore updated!');
		}
	});
}
