import type { AnimationSetData } from 'src/extensions';
import type { Readable } from 'svelte/store';
import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document';
import { deslugify } from 'src/utils';
import { derived } from 'svelte/store';

export function initVariables() {
	const userDocs = game.users.map(x => new TJSDocument(x));
	const users: Readable<Extract<AnimationSetData, { source: 'user' }>[]> = derived(userDocs, $userDocs =>
		$userDocs.flatMap(
			user =>
				((user.getFlag('pf2e-graphics', 'animations') ?? []) as AnimationSetData[]).map(anim => ({
					...anim,
					source: 'user',
					user: user.id,
				})) as Extract<AnimationSetData, { source: 'user' }>[],
		));

	const core: Readable<Extract<AnimationSetData, { source: 'module' }>[]> = derived(
		window.pf2eGraphics.AnimCore.animationsStore,
		$animations =>
			Array.from($animations.entries()).map(([rollOption, data]) => ({
				source: 'module' as const,
				module: data.module,
				name: deslugify(rollOption),
				rollOption,
				animationSets: data.animationSets,
			})),
	);

	const world: Readable<Extract<AnimationSetData, { source: 'world' }>[]> = derived(
		window.pf2eGraphics.storeSettings.getReadableStore('globalAnimations') as Readable<
			Extract<AnimationSetData, { source: 'world' }>[]
		>,
		$animations =>
			Array.from($animations).map((data: any) => ({
				rollOption: '',
				source: 'world',
				...data,
			})) as Extract<AnimationSetData, { source: 'world' }>[],
	);

	return derived([users, core, world], ([$users, $core, $world]) => $users.concat($core).concat($world));
}
