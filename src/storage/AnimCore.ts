import type { TokenOrDoc } from 'src/extensions';
import type { liveSettings } from 'src/settings';
import type { Writable } from 'svelte/store';
import type { storeSettingsType } from '../settings';
import { addAnimationToSequence, type GameData } from 'src/presets';
import { dedupeStrings, dev, devLog, ErrorMsg, getPlayerOwners, log, mergeObjectsConcatArrays, nonNullable } from 'src/utils.ts';
import { type EffectOptions, type Preset, presetList, type Trigger, triggersList } from './animationsSchema';

export type JSONData = Record<string, string | JSONDataObject[]>;
type TokenImageDataRule = TokenImageShorthand | TokenImageRuleSource;
type TokenImageShorthand = [string, string, number];

export type AnimationObject = Omit<JSONDataObject, 'reference' | 'contents' | 'default' | 'overrides'>;

interface JSONDataObject {
	trigger: Trigger | Trigger[];
	preset: Preset;
	file: string | string[];
	predicate?: PredicateStatement[];
	options?: EffectOptions;
	// Removed in search() or made irrelevant
	overrides?: string[];
	default?: true;
	reference?: string;
	contents?: JSONDataObject[];
}

interface TokenImageData {
	name: string;
	uuid?: ItemUUID;
	rules: TokenImageDataRule[];
	requires?: string;
}

interface AnimationHistoryObject {
	timestamp: number;
	rollOptions: string[];
	trigger: Trigger | Trigger[];
	animations: AnimationObject[];
	item?: { name: string; uuid: string };
	actor: { name: string; uuid: string };
};

declare global {
	interface Window {
		pf2eGraphics: pf2eGraphics;
		AnimCore: typeof AnimCore;
	}
	interface pf2eGraphics {
		modules: Record<string, JSONData>;
		AnimCore: typeof AnimCore;
		liveSettings: liveSettings;
		storeSettings: storeSettingsType;
		history: Writable<AnimationHistoryObject[]>;
	}
}

export let AnimCore = class AnimCore {
	// #region Data Retrieval
	/**
	 * Returns raw animation data, with contents, references, etc.
	 */
	static getAnimations(): JSONData {
		// Sort "pf2e-graphics" module to be the first one, so everyone overrides it
		return Object.keys(window.pf2eGraphics.modules)
			.sort((a, b) => a === 'pf2e-graphics' ? -1 : b === 'pf2e-graphics' ? 1 : 0)
			.reduce((acc, key) => ({ ...acc, ...window.pf2eGraphics.modules[key] }), {});
	}

	static get animations(): JSONData {
		if (dev) return this.getAnimations();
		if (!this._animations) this._animations = this.getAnimations();
		return this._animations;
	}

	static _animations: JSONData;

	static getKeys(): string[] {
		return Object.keys(this.animations).filter(x => !x.startsWith('_'));
	}

	static get keys(): string[] {
		if (dev) return this.getKeys();
		if (!this._keys) this._keys = this.getKeys();
		return this._keys;
	}

	static _keys: string[];

	static getTokenImages() {
		return Object.keys(window.pf2eGraphics.modules).flatMap(key => window.pf2eGraphics.modules[key]._tokenImages as unknown as TokenImageData[]).filter(nonNullable).filter(x => x?.requires ? !!game.modules.get(x.requires) : true).map(x => ({
			...x,
			rules: x.rules.map((rule: TokenImageDataRule) => {
				if (!isShorthand(rule)) return rule;
				return {
					key: 'TokenImage',
					predicate: [`self:effect:${rule[0]}`],
					value: rule[1],
					scale: rule[2],
				} as TokenImageRuleSource;
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
		if (!match)
			return [file];

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

	static addNewAnimation(data: JSONData, overwrite = true) {
		return foundry.utils.mergeObject(window.pf2eGraphics.modules, data, { overwrite });
	}
	// #endregion

	// #region Method 0.10

	/**
	 * Trigger Data in.
	 * - Run retrieve() to get all the animations proper.
	 * - Run search() on retrieved animations to get what we are looking for.
	 * - Run play() on found animations.
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
		}: {
			rollOptions: string[];
			trigger: Trigger;
			actor: ActorPF2e | null;
			sources: TokenOrDoc[];
			item?: ItemPF2e | null;
			animationOptions?: object;
			targets?: (TokenOrDoc | string | Point)[];
		},
		devName?: string,
	) {
		// eslint-disable-next-line prefer-rest-params
		devLog(devName, arguments[0]);
		if (!actor) return log('No actor found! Aborting.');
		if (!sources) return log('No source token found on the active scene! Aborting.');

		const allAnimations = AnimCore.retrieve(rollOptions, item, actor).animations;
		const foundAnimations = AnimCore.search(rollOptions, [trigger], allAnimations);
		const appliedAnimations = Object.values(foundAnimations).flat().map(x => foundry.utils.mergeObject(x, { options: animationOptions }));

		this.createHistoryEntry({
			rollOptions,
			actor,
			animations: appliedAnimations,
			trigger,
			item: nonNullable(item) ? item : undefined,
		});

		return this.play(appliedAnimations, sources, targets, nonNullable(item) ? item : undefined);
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
	): { animations: JSONData; sources: Record<string, string[]> } {
		const obj = {
			animations: {},
			sources: {},
		};
		const merge = foundry.utils.mergeObject;
		/*
			From a list of owners, find either the "true" owner (assigned user) or yourself if you are one of them.
			Otherwise, default to whoever is first.
		*/
		const owners = actor ? getPlayerOwners(actor) : [game.user];

		const itemOriginId = rollOptions.find(x => x.includes('origin:item:id:'))?.split(':').at(-1);
		const itemOrigin = item?.origin?.items?.get(itemOriginId || '');

		// Get all the flags.
		const userKeys = owners.map(u => u.getFlag('pf2e-graphics', 'customAnimations') ?? {}).reduce((p, c) => merge(p, c), {});
		const actorOriginKeys = item?.origin?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const itemOriginKeys = itemOrigin?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const actorKeys = actor?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const itemKeys = item?.getFlag('pf2e-graphics', 'customAnimations') ?? {};

		// Priority (highest to lowest): Item > Actor (Affected) > Item (Origin) > Actor (Origin) > User > Global
		obj.animations = merge(
			AnimCore.animations,
			merge(
				window.pf2eGraphics.liveSettings.worldAnimations,
				merge(
					userKeys,
					merge(
						actorOriginKeys,
						merge(
							itemOriginKeys,
							merge(
								actorKeys,
								itemKeys,
							),
						),
					),
				),
			),
		) as ReturnType<typeof this.getAnimations>;

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
	static search(rollOptions: string[], triggers: string[] = [], animations: JSONData = AnimCore.animations): Record<string, AnimationObject[]> {
		const matchingBranches = Object.entries(animations).filter(([k]) => rollOptions.includes(k));
		const animationsNoStrings = matchingBranches.map(([k, v]) => [k, parseStrings(v, k)] as const satisfies [string, object[]]);
		const animationsNoRefs = animationsNoStrings.map(([k, v]) => [k, parseReferences(v, k)] as const satisfies [string, object[]]);
		const filteredAnimations = animationsNoRefs.map(([k, v]) => [k, filterChildren(v)] as const satisfies [string, object[]]);
		const unfoldedAnimations = filteredAnimations.map(([k, v]) => [k, unfoldAnimations(v)] as const satisfies [string, object[]]);
		// Do not bother if there are no triggers. We dont want to discriminate animations that *can* happen.
		if (triggers.length) {
			const notTriggeredAnimations = unfoldedAnimations.map(([k, v]) => [k, filterByTriggers(v)] as const satisfies [string, object[]]);
			const notOverridenAnimations = filterByOverride(notTriggeredAnimations);

			return foundry.utils.deepClone(Object.fromEntries(notOverridenAnimations));
		} else {
			return foundry.utils.deepClone(Object.fromEntries(unfoldedAnimations));
		}

		function parseStrings(
			v: string | JSONDataObject[],
			k: string,
		): JSONDataObject[] {
			let recursion = 0;
			while (typeof v === 'string') {
				if (recursion < 10) {
					recursion++;
					v = animations[v];
				} else {
					throw new ErrorMsg(`The ${k} animation recurses too many times! Check if the animation isnt perhaps an infinite loop.`);
				}
			}
			return v;
		}

		function parseReferences(
			v: JSONDataObject[],
			k: string,
		): Omit<JSONDataObject, 'reference'>[] {
			const parsed = v.map((obj) => {
				if ('reference' in obj && obj.reference) {
					const ref = parseStrings(animations[obj.reference], k);

					// We are asserting that a Reference cannot have contents, otherwise we are mixing two contents at once and pretty much making mixins.
					obj.contents = ref;
				}
				// Remove reference.
				// This cannot be moved above since its in the context of ReferenceObject where reference is required, not optional.
				if ('reference' in obj)	delete obj.reference;

				return obj;
			});
			return parsed;
		}

		function unfoldAnimations(
			v: Omit<JSONDataObject, 'reference'>[],
		): Omit<JSONDataObject, 'reference' | 'contents'>[] {
			function unfoldSingle(folder: JSONDataObject): AnimationObject[] {
				let { contents = [], ...parentProps } = folder;

				if (contents.length && contents.some(x => x.default)) {
					const valid = contents.filter(x => x.predicate?.length && game.pf2e.Predicate.test(x.predicate, rollOptions));
					if (valid.length) {
						contents = valid;
					} else {
						contents = contents.filter(x => x.default);
					}
				}

				// Remove parent default. Default should only appear on the very last element in the chain.
				delete parentProps.default;

				return contents
					.flatMap(child => child.contents ? unfoldSingle(child) : child)
					.map(child => mergeObjectsConcatArrays(parentProps, child as any));
			}

			const completed = v.flatMap(folder => folder.contents ? unfoldSingle(folder) : folder);

			return completed;
		}

		function filterChildren<T extends { predicate?: PredicateStatement[] }>(
			v: T[],
		) {
			return v.filter(x => game.pf2e.Predicate.test(x.predicate, rollOptions));
		}

		function filterByTriggers<T extends { trigger: string | string[] }>(
			v: T[],
		) {
			return v.filter(a => [a.trigger].flat().find(t => triggers.includes(t)));
		}

		function filterByOverride<T extends { overrides?: string[] }>(
			array: [ k: string, v: T[] ][],
		): [ k: string, v: Omit<T, 'overrides'>[] ][] {
			for (const objects of array) {
				for (const object of objects[1]) {
					if (!object.overrides || !object.overrides.length) continue;

					for (const override of object.overrides) {
						array = array.filter(([k]) => !override.includes(k));
					}
				}
			}

			return array;
		}
	}

	static createSequenceInQueue(
		queue: Sequence[],
		animation: AnimationObject,
		data: GameData,
		index: number = -1,
	) {
		const sequence = new Sequence({ inModuleName: 'pf2e-graphics', softFail: !dev });

		addAnimationToSequence(
			sequence,
			animation,
			data,
		);

		queue.splice(index, 0, sequence);
	}

	/**
	 * Animations in, Sequences out.
	 */
	static play(
		animations: AnimationObject[],
		sources: TokenOrDoc[],
		targets?: (TokenOrDoc | string | Point)[],
		item?: ItemPF2e<any>,
	): Promise<Sequence>[] {
		const sequences: Sequence[] = [];

		animations.forEach((animation, index) => {
			this.createSequenceInQueue(sequences, animation, {
				sources,
				targets,
				item,
				queue: sequences,
				currentIndex: index,
				animations,
			});
		});

		// TODO: Uncomment when https://github.com/fantasycalendar/FoundryVTT-Sequencer/issues/312 is done
		return sequences.map(x => x.play({ local: true /* , preload: true */ }));
	}
	// #endregion
};

function isShorthand(rule: TokenImageDataRule): rule is TokenImageShorthand {
	return !!Array.isArray(rule);
}

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
