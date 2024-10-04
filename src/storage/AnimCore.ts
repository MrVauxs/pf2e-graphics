import type { TokenOrDoc } from 'src/extensions';
import type { ModuleAnimationData } from 'src/schema';
import type { Animation, AnimationsData } from 'src/schema/animation';
import type { TokenImageData } from 'src/schema/tokenImages';
import type { liveSettings } from 'src/settings';
import type { Writable } from 'svelte/store';
import type { storeSettingsType } from '../settings';
import { addAnimationToSequence, type GameData } from 'src/presets';
import {
	dedupeStrings,
	dev,
	devLog,
	ErrorMsg,
	getPlayerOwners,
	log,
	mergeObjectsConcatArrays,
	nonNullable,
} from 'src/utils.ts';
import { PRESETS as presetList } from '../schema/presets';
import { type Trigger, TRIGGERS as triggersList } from '../schema/triggers';

export type JSONMap = Map<string, string | Animation[]>;

export type AnimationObject = Omit<Animation, 'reference' | 'contents' | 'default' | 'overrides'>;

interface AnimationHistoryObject {
	timestamp: number;
	rollOptions: string[];
	trigger: Trigger | Trigger[];
	animations: AnimationObject[];
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
		modules: ModuleAnimationData;
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

	static get animations(): JSONMap {
		if (dev) return this.getAnimations();
		if (!this._animations) this._animations = this.getAnimations();
		return this._animations;
	}

	static _animations: JSONMap;

	static getKeys(): string[] {
		return Array.from(this.animations.keys()).filter(x => !x.startsWith('_'));
	}

	static get keys(): string[] {
		if (dev) return this.getKeys();
		if (!this._keys) this._keys = this.getKeys();
		return this._keys;
	}

	static _keys: string[];

	static getTokenImages() {
		return ((this.animations.get('_tokenImages') ?? []) as TokenImageData[])
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
	static parseFiles(files: string[] | string): string[] {
		return [files].flat().flatMap(s => this._parseFile(s));
	}

	static _parseFile(file: string = ''): string[] {
		const match = file.match(/\{(.*?)\}/);
		if (!match) return [file];

		const [_, options] = match;
		const parsedOptions = options.split(',');
		return parsedOptions.map(x => file.replace(`{${options}}`, x));
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
		PRESETS: presetList,
		TRIGGERS: triggersList,
	};

	static addNewAnimation(data: AnimationsData, overwrite = true) {
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
			new Map(Object.entries(allAnimations as AnimationsData)), // Technically false, but we can ignore `_tokenImages` here
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
	): { animations: ModuleAnimationData; sources: Record<string, string[]> } {
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
			...window.pf2eGraphics.liveSettings.worldAnimations,
			...userKeys,
			...actorOriginKeys,
			...itemOriginKeys,
			...actorKeys,
			...itemKeys,
		} as ReturnType<typeof this.getAnimations>;

		obj.sources = {
			preset: AnimCore.keys,
			world: Object.keys(window.pf2eGraphics.liveSettings.worldAnimations),
			user: Object.keys(userKeys),
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
		animations: JSONMap = AnimCore.animations,
	): Record<string, AnimationObject[]> {
		const unfoldedAnimations: [string, ReturnType<typeof unfoldAnimations>][] = [];
		for (const [k, v] of animations.entries()) {
			if (!rollOptions.includes(k)) continue;
			const animationNoStrings = parseStrings(v, k);
			const animationNoRefs = parseReferences(animationNoStrings, k);
			const filteredAnimation = filterChildren(animationNoRefs);
			const unfoldedAnimation = unfoldAnimations(filteredAnimation);
			unfoldedAnimations.push([k, unfoldedAnimation]);
		}
		// Do not bother if there are no triggers. We don't want to discriminate animations that *can* happen.
		if (triggers.length) {
			const notTriggeredAnimations = unfoldedAnimations.map(
				([k, v]) => [k, filterByTriggers(v)] as const satisfies [string, object[]],
			);
			const notOverridenAnimations = filterByOverride(notTriggeredAnimations);

			return foundry.utils.deepClone(Object.fromEntries(notOverridenAnimations));
		} else {
			return foundry.utils.deepClone(Object.fromEntries(unfoldedAnimations));
		}

		function parseStrings(v: string | Animation[], k: string): Animation[] {
			let recursion = 0;
			while (typeof v === 'string') {
				if (recursion < 10) {
					recursion++;
					v = animations.get(v)!;
				} else {
					throw new ErrorMsg(
						`The ${k} animation recurses too many times! Do its references form an infinite loop?`,
					);
				}
			}
			return v;
		}

		function parseReferences(v: Animation[], k: string): Omit<Animation, 'reference'>[] {
			return v.map((obj) => {
				if ('reference' in obj && obj.reference) {
					const ref = parseStrings(animations.get(obj.reference)!, k);

					// We are asserting that a Reference cannot have contents, otherwise we are mixing two contents at once and pretty much making mixins.
					obj.contents = ref;
				}
				// Remove reference.
				// This cannot be moved above since its in the context of ReferenceObject where reference is required, not optional.
				if ('reference' in obj) delete obj.reference;

				return obj;
			});
		}

		function unfoldAnimations(v: Omit<Animation, 'reference'>[]): Omit<Animation, 'reference' | 'contents'>[] {
			function unfoldSingle(folder: Animation): AnimationObject[] {
				let { contents = [], ...parentProps } = folder;

				if (contents.length && contents.some(x => x.default)) {
					const valid = contents.filter(
						x => x.predicates?.length && game.pf2e.Predicate.test(x.predicates, rollOptions),
					);
					if (valid.length) {
						contents = valid;
					} else {
						contents = contents.filter(x => x.default);
					}
				}

				// Remove parent default. Default should only appear on the very last element in the chain.
				delete parentProps.default;

				return contents
					.flatMap(child => (child.contents ? unfoldSingle(child) : child))
					.map(child => mergeObjectsConcatArrays(parentProps, child))
					.filter(child => game.pf2e.Predicate.test(child.predicates, rollOptions));
			}

			return v.flatMap(folder => (folder.contents ? unfoldSingle(folder) : folder));
		}

		function filterChildren<T extends { predicates?: PredicateStatement[] }>(v: T[]) {
			return v.filter(x => game.pf2e.Predicate.test(x.predicates, rollOptions));
		}

		function filterByTriggers<T extends { triggers?: Trigger[] }>(v: T[]) {
			return v.filter(a => a.triggers?.flat().find(t => triggers.includes(t)));
		}

		function filterByOverride<T extends { overrides?: string[] }>(
			array: [k: string, v: T[]][],
		): [k: string, v: Omit<T, 'overrides'>[]][] {
			for (const objects of array) {
				for (const object of objects[1]) {
					if (!object.overrides || !object.overrides.length) continue;

					for (const override of object.overrides) {
						if (override === '*') {
							array = [objects];
						} else {
							array = array.filter(([k]) => !k.includes(override));
						}
					}
				}
			}

			return array;
		}
	}

	static async createSequenceInQueue(
		queue: Sequence[],
		animation: AnimationObject,
		data: GameData,
		index: number = -1,
		replace: boolean = false,
	) {
		const sequence = new Sequence({ inModuleName: 'pf2e-graphics', softFail: !dev });

		await addAnimationToSequence(sequence, animation, data);

		queue.splice(index, replace ? 1 : 0, sequence);
	}

	/**
	 * Animations in, Sequences out.
	 */
	static async play(
		rawAnimationSets: AnimationObject[][],
		sources: TokenOrDoc[],
		targets?: (TokenOrDoc | string | Point)[],
		item?: ItemPF2e<any>,
		user?: string,
	) {
		const sequences: Sequence[] = [];

		type addOnGenericAnimation = AnimationObject & {
			generic: Extract<Animation['generic'], { type: 'add-on' }>;
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
				if (addOn.id) {
					// If the add-on has an ID, then look for a matching `slot` to fill.
					const slotPosition = animationSet.findIndex(
						animation => animation.generic?.type === 'slot' && animation.id === addOn.id,
					);

					// If slot can't be found (either it doesn't exist or it's been overridden), then just skip the add-on.
					if (slotPosition === -1) continue;

					// Slot has been found! Replace it with the add-on.
					animationSet.splice(slotPosition, 1, addOn);
				} else {
					// If the add-on has no ID, or the ID isn't found in the animation set, simply prepend/append the add-on as determined by `generic.order`.
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
				await addAnimationToSequence(sequence, animation, {
					queue: sequences,
					currentIndex: index,
					animations: animationSet,
					targets,
					item,
					sources,
					user,
				});
			}

			sequences.push(sequence);
		}

		return sequences.map(x => x.play({ local: true, preload: true }));
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
			ui.notifications.info('AnimCore updated!');
		}
	});
}
