import type { AnimationSetDocument, UserAnimationSetDocument, WorldAnimationSetDocument } from 'src/extensions';
import type { AnimationSet } from '../../../schema';
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import { ErrorMsg, i18n } from 'src/utils';
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

export function copyAnimation(animation: AnimationSetDocument, addCopy: boolean = true): void | AnimationSetDocument {
	if (animation.source === 'world') {
		return addToWorld({
			...animation,
			name: addCopy ? `${animation.name} (Copy)` : animation.name,
			id: foundry.utils.randomID(),
		});
	} else if (animation.source === 'user') {
		return addToCurrentUser({
			...animation,
			name: addCopy ? `${animation.name} (Copy)` : animation.name,
			id: foundry.utils.randomID(),
		});
	} else if (animation.source === 'module') {
		popupCreateAnimation('copy', animation);
	} else {
		throw ErrorMsg.send('Failed to copy animation set (unknown source).');
	}
}

export function makeAnimation(name: string, type: string, location: string, animation?: AnimationSetDocument): AnimationSetDocument {
	// TODO:
	const template: AnimationSet[] = type === 'ranged' ? [] : [];

	switch (location) {
		case 'world':
			return addToWorld({
				animationSets: template,
				rollOption: game.pf2e.system.sluggify(name), // TODO: if this is just template data, make sure the user gets shouted at if they leave it like this (remember you can use the `rollOption` Zod schema to at least check it's got the right format)

				// Ordering here is important, animation has to override animationSets and rollOption
				...animation,
				id: foundry.utils.randomID(),
				name,
				source: 'world',
			});
			break;
		case 'user':
		default:
			return addToCurrentUser({
				animationSets: template,
				rollOption: game.pf2e.system.sluggify(name), // TODO: as above

				// Ordering here is important, animation has to override animationSets and rollOption
				...animation,
				id: foundry.utils.randomID(),
				name,
				user: game.userId,
				source: 'user',
			});
			break;
	}
}

export function removeAnimation(animation: AnimationSetDocument): void {
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
				// @ts-expect-error TJS-2-TS Fix in the next update maybe?
				class: CreateAnimation,
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
