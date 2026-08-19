import type {
	AnimationSet,
	AnimationSetDocument,
	UserAnimationSetDocument,
	WorldAnimationSetDocument,
} from 'schema';
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import { trlComponent } from 'src/shims/trlComponent';
import { error, ErrorMsg, i18n } from 'src/utils';
import AnimationDocumentApp from '../AnimationDocument/AnimationDocumentApp';
import CreateAnimation from './CreateAnimation.svelte';

function addToWorld(animation: WorldAnimationSetDocument) {
	window.pf2eGraphics.liveSettings.globalAnimations = [
		...window.pf2eGraphics.liveSettings.globalAnimations,
		animation,
	];
	return animation;
}

function addToCurrentUser(animation: UserAnimationSetDocument) {
	game.user.setFlag('pf2e-graphics', 'animations', [
		...((game.user.getFlag('pf2e-graphics', 'animations') ?? []) as AnimationSetDocument[]),
		animation,
	]);
	return animation;
}

function removeFromWorld(animation: WorldAnimationSetDocument) {
	const animationId = animation.id;

	if (animation.source !== 'world') {
		throw ErrorMsg.send('Attempted to call "removeFromWorld" function with a non-world animation!');
	}

	window.pf2eGraphics.liveSettings.globalAnimations = window.pf2eGraphics.liveSettings.globalAnimations.filter(
		animation => animation.id !== animationId,
	);
}

function removeFromCurrentUser(animation: UserAnimationSetDocument) {
	const animationId = animation.id;
	const animations = (game.user.getFlag('pf2e-graphics', 'animations') ?? []) as Extract<
		AnimationSetDocument,
		{ source: 'user' }
	>[];

	if (animation.source !== 'user') {
		throw ErrorMsg.send('Attempted to call "removeFromCurrentUser" function with a non-user animation!');
	}

	game.user.setFlag(
		'pf2e-graphics',
		'animations',
		animations.filter(animation => animation.id !== animationId),
	);
}

export function sluggify(name: string) {
	return game.pf2e.system
		.sluggify(name)
		.replaceAll(/((spell-)?effect)-/g, 'effect:')
		.replaceAll(/(spell|item)-/g, '$1:');
}

export function getAnimationNameAndID(name?: string, id?: string) {
	const _id = id || foundry.utils.randomID();
	const _name = name || `Untitled Animation Set ${_id.slice(0, 5)}`;
	return {
		_name,
		_id,
	};
}

export type AnimationPresetType = 'custom' | 'ranged' | 'melee' | 'onToken' | 'template';
export function makeAnimation(
	name: string,
	type: AnimationPresetType,
	location: string,
	animation?: AnimationSetDocument,
): AnimationSetDocument {
	const { _name, _id } = getAnimationNameAndID(name);

	// TODO:
	const preset: AnimationSet[] = [];

	if (type === 'custom') {
		// Do nothing
	} else if (type === 'ranged') {
		preset.push({
			label: `${_name} (Projectile)`,
			triggers: ['attack-roll'],
			execute: {
				type: 'graphic',
				graphic: ['jb2a.arrow'],
				position: {
					type: 'static',
					location: 'SOURCES',
				},

				size: {
					type: 'directed',
					endpoint: 'TARGETS',
				},
			},
		});
	} else if (type === 'melee') {
		preset.push({
			label: `${_name} (Melee)`,
			triggers: ['attack-roll'],
			predicates: ['melee', { gt: ['target:distance', 0] }],
			execute: {
				type: 'graphic',
				graphic: ['jb2a.melee_attack.02.handaxe.01'],
				position: {
					type: 'static',
					location: 'SOURCES',
					anchor: {
						x: 0.4,
					},
				},
				reflection: {
					y: 'random',
				},
				size: {
					type: 'relative',
					relativeTo: 'SOURCES',
					scaling: 5,
				},
				rotation: {
					type: 'relative',
					location: 'TARGETS',
				},
			},
		});
	} else if (type === 'onToken') {
		preset.push({
			label: `${_name} (On Token)`,
			triggers: ['effect'],
			execute: {
				type: 'graphic',
				graphic: ['jb2a.shield.01.complete.01'],
				position: {
					type: 'dynamic',
					location: 'SOURCES',
				},
				size: {
					type: 'relative',
					relativeTo: 'SOURCES',
				},
			},
		});
	} else if (type === 'template') {
		preset.push({
			label: `${_name} (Template)`,
			triggers: ['place-template'],
			execute: {
				type: 'graphic',
				graphic: [
					'jb2a.burning_hands.01.orange',
				],
				position: {
					type: 'dynamic',
					location: 'TEMPLATES',
				},
				size: {
					type: 'directed',
					endpoint: 'TEMPLATES',
				},
			},
		});
	} else {
		error('Unknown preset type!');
	}

	if (location === 'world') {
		return addToWorld({
			animationSets: preset,
			rollOption: sluggify(_name), // TODO: if this is just template data, make sure the user gets shouted at if they leave it like this (remember you can use the `rollOption` Zod schema to at least check it's got the right format)

			// Ordering here is important, animation has to override animationSets and rollOption
			...animation,
			id: _id,
			name: _name,
			source: 'world',
		});
	}
	return addToCurrentUser({
		animationSets: preset,
		rollOption: sluggify(_name), // TODO: as above

		// Ordering here is important, animation has to override animationSets and rollOption
		...animation,
		id: _id,
		name: _name,
		user: game.userId,
		source: 'user',
	});
}

export function removeAnimation(animation: AnimationSetDocument): void {
	// TODO: Add a confirmation button
	if (animation.source === 'world') return removeFromWorld(animation);
	if (animation.source === 'user') return removeFromCurrentUser(animation);
	if (animation.source === 'module')
		throw ErrorMsg.send(`Failed to remove animation set (provided by <code>${animation.module}</code>).`);
	throw ErrorMsg.send('Failed to remove animation set (unknown source).');
}

export function openAnimation(animation: AnimationSetDocument): void {
	AnimationDocumentApp.show({ animation });
}

export function popupCreateAnimation(mode: 'make' | 'copy' = 'make', animation?: AnimationSetDocument) {
	const sidebarRect = document.querySelector('#create-animation')!.getBoundingClientRect();
	new TJSDialog(
		{
			title: i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.popup.title'),
			content: {
				class: trlComponent(CreateAnimation),
				props: {
					mode,
					animation,
				},
			},
			focusFirst: true,
		},
		{
			headerIcon: 'modules/pf2e-graphics/assets/module/Vauxs_by_Bishop.png',
			classes: ['pf2e-g'],
			left: sidebarRect.x - 310,
			top: sidebarRect.y - 5,
			width: 300,
		},
	).render(true, { focus: true });
}
