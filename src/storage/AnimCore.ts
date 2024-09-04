import { ErrorMsg, dedupeStrings, dev, devMessage, findTokenByActor, getPlayerOwners, log, mergeObjectsConcatArrays, nonNullable } from 'src/utils.ts';
import type { TokenOrDoc } from 'src/extensions';
import type { liveSettings } from 'src/settings';
import type { Writable } from 'svelte/store';
import type { storeSettingsType } from '../settings';
import { clearEmpties } from '../utils';
import { type PresetKeys, presets } from './presets';

function hasReference(reference: AnimationDataObject | ReferenceObject): reference is ReferenceObject {
	return typeof (reference as ReferenceObject).reference === 'string';
}

function isFolder(folder: AnimationDataObject | FolderObject): folder is FolderObject {
	return (folder as FolderObject).contents !== undefined;
}

export type JSONData = Record<string, string | (ReferenceObject | AnimationDataObject)[]>;
interface TokenImageData { name: string; uuid?: ItemUUID; rules: TokenImageDataRule[]; requires?: string }
type TokenImageDataRule = (TokenImageShorthand | TokenImageRuleSource);
type TokenImageShorthand = [string, string, number];

function isShorthand(rule: TokenImageDataRule): rule is TokenImageShorthand {
	return !!Array.isArray(rule);
}

export let AnimCore = class AnimCore {
	/**
	 * Returns animation data:
	 * - "reference:to:another:animation"
	 * - [ { file: "123" } ]
	 * - [ { reference: "reference:to:another:animation", "predicate": ["gate:air"] } ]
	 */
	static getAnimations(): JSONData {
		return Object.keys(window.pf2eGraphics.modules).sort((a, b) => a === 'pf2e-graphics' ? -1 : b === 'pf2e-graphics' ? 1 : 0).reduce((acc, key) => ({ ...acc, ...window.pf2eGraphics.modules[key] }), {});
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

	static getReferences(data: AnimationDataObject | ReferenceObject): AnimationDataObject[] {
		if (!hasReference(data)) return [data];

		let animationObject = this.getAnimations()[data.reference];

		if (typeof animationObject === 'string')
			animationObject = AnimCore.getAnimationsArray(animationObject);

		animationObject = animationObject.map(x => foundry.utils.mergeObject(x, { ...data, reference: undefined }));

		return animationObject.flatMap(x => this.getReferences(x));
	}

	static getAnimationsArray(
		key: string | undefined,
		additionalAnimations?: ReturnType<typeof this.getAnimations>,
	): AnimationDataObject[] {
		if (!key || typeof key !== 'string') {
			throw new ErrorMsg(`You are trying to call 'getAnimationsArray' with a non-string value (${key})!`);
		}

		let animationObject = { ...this.getAnimations(), ...(additionalAnimations || {}) }[key];

		if (typeof animationObject === 'string') {
			animationObject = AnimCore.getAnimationsArray(animationObject);
		}

		if (!nonNullable(animationObject)) return [];

		return animationObject
			.flatMap(x => AnimCore.getReferences(x))
			.flatMap(x => AnimCore.unfoldAnimations(x));
	}

	// Removes any inline {randomOptions} from the file path and returns the valid file path with one of the options randomly picked
	static parseFile(file: string = ''): string {
		const match = file.match(/\{(.*?)\}/);
		if (!match)
			return file;

		const [_, options] = match;
		const parsedOptions = options.split(',');
		const randomOption = Sequencer.Helpers.random_array_element(parsedOptions);
		return file.replace(`{${options}}`, randomOption);
	}

	static prepRollOptions(array: string[]) {
		return dedupeStrings(this.uglifyRollOptions(array)
			.concat(
				[
					`settings:quality:${window.pf2eGraphics.liveSettings.quality}`,
					window.pf2eGraphics.liveSettings.persistent ? 'settings:persistent' : null,
					game.modules.get('jb2a_patreon')?.active ? 'jb2a:patreon' : null,
					game.modules.get('JB2A_DnD5e')?.active ? 'jb2a:free' : null,
				].filter(x => typeof x === 'string'),
			));
	}

	static allAnimations(): { [key: string]: AnimationDataObject[] } {
		return this.keys.reduce((acc, key) => ({ ...acc, [key]: AnimCore.getAnimationsArray(key) }), {});
	}

	/** Not sure if this is a good idea, muddying up the waters. */
	static uglifyRollOptions(array: string[]) {
		return array;
		// return array.flatMap(x => /self:|origin:/.exec(x) ? [x, x.split(':').slice(1).join(':')] : x)
	}

	/**
	 * Array of predicates is always required.
	 * The owner of the actor/item is required, but can be assumed to be the client if absent.
	 * The item is not required, as there can be item-less rolls with roll options.
	 * The actor is not required, for purposes of customizing item animations in the sidebar.
	 */
	static getMatchingAnimationTrees(
		rollOptions: string[] = [],
		actor?: ActorPF2e | null,
		item?: ItemPF2e | null,
	): { animations: Record<string, AnimationDataObject[]>; sources: Record<string, string[]> } {
		const obj = {
			animations: {},
			sources: {},
		};
		if (!rollOptions.length) return obj;

		// Allow deletions in event players just dont want an animation at all.
		const merge = foundry.utils.mergeObject;

		/*
			From a list of owners, find either the "true" owner (assigned user) or yourself if you are one of them.
			Otherwise, default to whoever is first.
		*/
		const owners = actor ? getPlayerOwners(actor) : [game.user];
		const user = owners.find(x => x.id === game.user.id) || owners[0];

		// TODO: Make a PR to the system to make this roll option dance unnecessary and get it from getOriginData()
		const itemOriginId = rollOptions.find(x => x.includes('origin:item:id:'))?.split(':').at(-1);
		const itemOrigin = item?.origin?.items.get(itemOriginId || '');

		// Get all the flags.
		const userKeys = user.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const actorOriginKeys = item?.origin?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const itemOriginKeys = itemOrigin?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const actorKeys = actor?.getFlag('pf2e-graphics', 'customAnimations') ?? {};
		const itemKeys = item?.getFlag('pf2e-graphics', 'customAnimations') ?? {};

		// Priority (highest to lowest): Item > Actor (Affected) > Item (Origin) > Actor (Origin) > User > Global
		const customAnimations = merge(
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
		) as ReturnType<typeof this.getAnimations>;

		const customSources = {
			preset: AnimCore.keys,
			world: Object.keys(window.pf2eGraphics.liveSettings.worldAnimations),
			user: Object.keys(userKeys),
			origin: Object.keys(itemOriginKeys),
			actorOrigin: Object.keys(actorOriginKeys),
			itemOrigin: Object.keys(itemOriginKeys),
			actor: Object.keys(itemKeys),
			item: Object.keys(itemKeys),
		} as const;

		const preparedOptions = this.prepRollOptions(rollOptions);
		const keys = merge(AnimCore.keys, Object.keys(customAnimations));

		obj.animations = keys
			.filter(key => preparedOptions.includes(key))
			.reduce((acc, key) => ({ ...acc, [key]: AnimCore.getAnimationsArray(key, customAnimations) }), {});

		obj.sources = clearEmpties(
			(Object.keys(customSources) as (keyof typeof customSources)[])
				.reduce((value, sourceKey) => {
					Object.assign(value, { [sourceKey]: customSources[sourceKey].filter(x => preparedOptions.includes(x)) });
					return value;
				}, {}),
		);

		return obj;
	}

	/**
	 Unfold a folder object consisting of `contents: AnimationDataObject[] | FolderObject` into a flat array of AnimationDataObject
	 All children under this folder inherit any other properties of the folder, such as `options`, `predicate`, etc.
	 The properties of children are not to be overriden by the parent folder, only concatenated or merged.
	 */
	static unfoldAnimations(folder: FolderObject | AnimationDataObject): AnimationDataObject[] {
		if (!isFolder(folder)) return [folder];
		const { contents, ...parentProps } = folder;

		const mergeProps = (parent: FolderObject, child: AnimationDataObject) => {
			const result = mergeObjectsConcatArrays(parent, child);

			return result;
		};

		return (contents || [])
			.flatMap((x: AnimationDataObject | FolderObject) => isFolder(x) ? AnimCore.unfoldAnimations(x) : x)
			.map(child => mergeProps(parentProps, child));
	}

	static animate(animation: AnimationDataObject, data: Record<string, any> & { sequence?: Sequence }): void {
		devMessage('Animate', animation, data);

		if (!data.sequence) throw new ErrorMsg('No Sequence defined in AnimCore.animate()!');

		data.sequence.preset(animation.preset, { file: animation.file, options: animation.options, ...data });
	}

	static testAnimation(animationData: AnimationDataObject, item: ItemPF2e) {
		const sequence = new Sequence({ inModuleName: 'pf2e-graphics' });
		this.animate(
			animationData,
			{
				targets: Array.from(game.user.targets),
				source: findTokenByActor(item.actor) ?? canvas.tokens.controlled[0],
				item,
				sequence,
			},
		);

		sequence.play({ preload: true, local: true });
	}

	static filterAnimations({ rollOptions: rollOptionsOG, item, trigger, narrow, actor }: {
		rollOptions: string[];
		item?: ItemPF2e | null;
		trigger: TriggerTypes;
		narrow: (a: AnimationDataObject) => boolean;
		actor?: ActorPF2e | null;
	}) {
		const rollOptions = this.prepRollOptions(rollOptionsOG);
		const animationTree = this.getMatchingAnimationTrees(rollOptions, actor, item).animations;

		const validAnimations: { [key: string]: AnimationDataObject[] } = {};

		for (const [key, branch] of Object.entries(animationTree)) {
			let validBranchAnimations = branch
				.filter(a => [a.trigger].flat().includes(trigger))
				.filter(animation => game.pf2e.Predicate.test(animation.predicate, rollOptions))
				.filter(narrow);

			if (validBranchAnimations.filter(a => !a.default).length > 0) validBranchAnimations = validBranchAnimations.filter(a => !a.default);

			validAnimations[key] = validBranchAnimations;
		}

		// Overrides handling
		Object.values(validAnimations).map(anims => anims
			.flatMap(x => x.overrides)
			.filter(nonNullable),
		).forEach((overrides) => {
			overrides.forEach(s => delete validAnimations[s]);
		});

		return validAnimations;
	}

	static async findAndAnimate({
		trigger,
		rollOptions,
		item,
		source,
		actor = item?.actor ?? source?.actor as ActorPF2e,
		animationOptions,
		...rest
	}: {
		item?: ItemPF2e | null;
		actor?: ActorPF2e | null;
		source?: TokenOrDoc | null;
		rollOptions: string[];
		trigger: TriggerTypes;
		animationOptions?: object;
	}, narrow: (animation: AnimationDataObject) => boolean = () => true) {
		if (!actor) return log('No actor found! Aborting.');
		if (!source) source = actor.getActiveTokens()[0]; // TODO: Maybe rewrite to take multiple linked tokens into account?
		if (!source) return log('No source token found on the active scene! Aborting.');

		const validAnimations = this.filterAnimations({ rollOptions, item, trigger, narrow, actor });

		devMessage(
			'Animating the Following',
			validAnimations,
			{
				trigger,
				rollOptions,
				item,
				actor,
				source,
			},
		);

		this.createHistoryEntry({
			trigger,
			rollOptions,
			animations: Object.entries(validAnimations).flatMap(([k, v]) => v.map(x => ({ ...x, predicate: [k, ...(x.predicate ?? [])] }))),
			item: item ? { name: item?.name, uuid: item.uuid } : undefined,
			actor: { name: actor.name, uuid: actor.uuid },
		});

		for (const anim of Object.values(validAnimations)) {
			if (!anim.length) continue;

			const sequence = new Sequence({ inModuleName: 'pf2e-graphics', softFail: !dev });

			for (const animation of anim) {
				this.animate(
					{ ...animation, ...animationOptions },
					{ ...rest, sequence, item, actor, source, rollOptions },
				);
			}

			sequence.play({ preload: true, local: true });
		}
	}

	static createHistoryEntry(data: Omit<AnimationHistoryObject, 'timestamp'>) {
		window.pf2eGraphics.history.update((v) => {
			v.push({
				timestamp: Date.now(),
				...data,
			});
			return v;
		});
	}

	static CONST = {
		TEMPLATE_ANIMATION: (): AnimationDataObject => ({
			trigger: this.CONST.TRIGGERS[0],
			preset: this.CONST.PRESETS[0],
			file: '',
			options: {},
		}),
		PRESETS: Object.keys(presets) as PresetKeys[],
		TRIGGERS: [
			'attack-roll',
			'damage-roll',
			'place-template',
			'action',
			'toggle',
			'effect',
			'self-effect',
			'startTurn',
			'endTurn',
			'damage-taken',
			'saving-throw',
			'check',
			'skill-check',
			'flat-check',
			'initiative',
			'perception-check',
			'counteract-check',
			'modifiers-matter',
		],
	} as const;

	static addNewAnimation(data: JSONData, overwrite = true) {
		return foundry.utils.mergeObject(window.pf2eGraphics.modules, data, { overwrite });
	}
};

Hooks.once('ready', () => {
	if (!game.modules.get('pf2e-modifiers-matter')?.active)
		// @ts-expect-error Modifiers Matter Safeguards
		AnimCore.CONST.TRIGGERS = AnimCore.CONST.TRIGGERS.filter(x => x !== 'modifiers-matter');
});

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

// Types Below

// #region JSON Data Parsing
type FolderObject = Partial<AnimationDataObject> & { contents?: (AnimationDataObject | FolderObject)[] };
export type ReferenceObject = Partial<AnimationDataObject> & { reference: string };
// #endregion

// #region Animation Data Parsing
export type TriggerTypes = typeof AnimCore['CONST']['TRIGGERS'][number];

export interface AnimationDataObject {
	overrides?: string[];
	trigger: TriggerTypes | TriggerTypes[];
	preset: PresetKeys;
	file: string;
	default?: boolean;
	predicate?: PredicateStatement[];
	options?: any;
	[key: string]: any;
}

// #endregion

interface AnimationHistoryObject {
	timestamp: number;
	rollOptions: string[];
	trigger: TriggerTypes | TriggerTypes[];
	animations: AnimationDataObject[];
	item?: { name: string; uuid: string };
	actor: { name: string; uuid: string };
};

declare global {
	interface Window {
		pf2eGraphics: pf2eGraphics;
		AnimCore: typeof AnimCore;
	}
	interface pf2eGraphics {
		modules: Record<string, Record<string, string | ReferenceObject | AnimationDataObject[]>>;
		AnimCore: typeof AnimCore;
		liveSettings: liveSettings;
		storeSettings: storeSettingsType;
		history: Writable<AnimationHistoryObject[]>;
	}
}
