import type { ArrayAnimationSet } from 'src/extensions';
import { ErrorMsg } from 'src/utils';
import AnimationDocumentApp from '../AnimationDocument/AnimationDocumentApp';

function addToWorld(animation: ArrayAnimationSet[number]) {
	window.pf2eGraphics.liveSettings.globalAnimations = [
		...window.pf2eGraphics.liveSettings.globalAnimations,
		animation,
	];
}

function addToCurrentUser(animation: ArrayAnimationSet[number]) {
	game.user.setFlag('pf2e-graphics', 'animations', [
		...(game.user.getFlag('pf2e-graphics', 'animations') as ArrayAnimationSet[] || []),
		animation,
	]);
}

function removeFromWorld(animation: ArrayAnimationSet[number]) {
	const animationId = animation.id;

	if (animation.source !== 'world') {
		throw new ErrorMsg('Attempted to call "removeFromWorld" function with a non-world animation!');
	}

	window.pf2eGraphics.liveSettings.globalAnimations
		= window.pf2eGraphics.liveSettings.globalAnimations.filter(
			animation => animation.id !== animationId,
		);
}

function removeFromCurrentUser(animation: ArrayAnimationSet[number]) {
	const animationId = animation.id;
	const animations = game.user.getFlag('pf2e-graphics', 'animations') as ArrayAnimationSet || [];

	if (animation.source !== 'user') {
		throw new ErrorMsg('Attempted to call "removeFromCurrentUser" function with a non-user animation!');
	}

	game.user.setFlag('pf2e-graphics', 'animations', animations.filter(
		animation => animation.id !== animationId,
	));
}

export function copyAnimation(animation: ArrayAnimationSet[number]) {
	switch (animation.source) {
		case 'world':
			addToWorld({
				...animation,
				name: `${animation.name} (Copy)`,
				id: foundry.utils.randomID(),
			});
			break;
		case 'user':
		default:
			addToCurrentUser({
				...animation,
				name: `${animation.name} (Copy)`,
				id: foundry.utils.randomID(),
			});
			break;
	}
}

export function makeAnimation(name: string,	type: string, location: string) {
	// TODO:
	const template = type === 'ranged' ? [] : [];

	switch (location) {
		case 'world':
			addToWorld({
				id: foundry.utils.randomID(),
				name,
				data: template,
				key: game.pf2e.system.sluggify(name),
				source: 'world',
			});
			break;
		case 'user':
		default:
			addToCurrentUser({
				id: foundry.utils.randomID(),
				name,
				user: game.userId,
				data: template,
				key: game.pf2e.system.sluggify(name),
				source: 'user',
			});
			break;
	}
}

export function removeAnimation(animation: ArrayAnimationSet[number]) {
	switch (animation.source) {
		case 'world':
			removeFromWorld(animation);
			break;
		case 'user':
			removeFromCurrentUser(animation);
			break;
	}
}

export function openAnimation(animation: ArrayAnimationSet[number]) {
	new AnimationDocumentApp({ animation }).render(true);
}
