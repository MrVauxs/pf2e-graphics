import type { ArrayAnimationSet } from 'src/extensions';
import type { Readable } from 'svelte/store';
import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document';
import { AnimCore } from 'src/storage/AnimCore';
import { deslugify } from 'src/utils';
import { derived } from 'svelte/store';

const userDocs = game.users.map(x => new TJSDocument(x));
const users: Readable<ArrayAnimationSet> = derived(userDocs, ($userDocs) => {
	return $userDocs.flatMap(
		user =>
			(user.getFlag('pf2e-graphics', 'animations') as ArrayAnimationSet || [])
				.map(anim => ({
					...anim,
					source: 'user',
					user: user.id,
				})) as ArrayAnimationSet,
	);
});

const core: Readable<ArrayAnimationSet> = derived(
	AnimCore.animationsStore,
	$animations =>
		Array.from($animations).map(([key, data]) => ({
			name: deslugify(key),
			source: 'module',
			data,
			key,
		})) as ArrayAnimationSet,
);

const world: Readable<ArrayAnimationSet> = derived(
	window.pf2eGraphics.storeSettings.getReadableStore('globalAnimations') as Readable<ArrayAnimationSet>,
	$animations =>
		Array.from($animations).map((data: any) => ({
			key: '',
			source: 'world',
			...data,
		})) as ArrayAnimationSet,
);

export const animationsList = derived(
	[users, core, world],
	([$users, $core, $world]) => $users.concat($core).concat($world),
);
