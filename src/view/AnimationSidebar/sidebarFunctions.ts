import type { AnimationSetData } from 'src/extensions';
import { ErrorMsg } from 'src/utils';
import AnimationDocumentApp from '../AnimationDocument/AnimationDocumentApp';

function addToWorld(animation: AnimationSetData) {
	window.pf2eGraphics.liveSettings.globalAnimations = [
		...window.pf2eGraphics.liveSettings.globalAnimations,
		animation,
	];
}

function addToCurrentUser(animation: AnimationSetData) {
	game.user.setFlag('pf2e-graphics', 'animations', [
		...((game.user.getFlag('pf2e-graphics', 'animations') ?? []) as AnimationSetData[]),
		animation,
	]);
}

function removeFromWorld(animation: AnimationSetData) {
	const animationId = animation.id;

	if (animation.source !== 'world') {
		throw ErrorMsg.send('Attempted to call "removeFromWorld" function with a non-world animation!');
	}

	window.pf2eGraphics.liveSettings.globalAnimations = window.pf2eGraphics.liveSettings.globalAnimations.filter(
		animation => animation.id !== animationId,
	);
}

function removeFromCurrentUser(animation: AnimationSetData) {
	const animationId = animation.id;
	const animations = (game.user.getFlag('pf2e-graphics', 'animations') ?? []) as AnimationSetData[];

	if (animation.source !== 'user') {
		throw ErrorMsg.send('Attempted to call "removeFromCurrentUser" function with a non-user animation!');
	}

	game.user.setFlag(
		'pf2e-graphics',
		'animations',
		animations.filter(animation => animation.id !== animationId),
	);
}

export function copyAnimation(animation: AnimationSetData) {
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

export function makeAnimation(name: string, type: string, location: string) {
	// TODO:
	const template = type === 'ranged' ? [] : [];

	switch (location) {
		case 'world':
			addToWorld({
				id: foundry.utils.randomID(),
				name,
				data: template,
				rollOption: game.pf2e.system.sluggify(name),
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
				rollOption: game.pf2e.system.sluggify(name),
				source: 'user',
			});
			break;
	}
}

export function removeAnimation(animation: AnimationSetData): void {
	if (animation.source === 'world') return removeFromWorld(animation);
	if (animation.source === 'user') return removeFromCurrentUser(animation);
	throw ErrorMsg.send('Failed to remove animation set (unknown source).');
}

export function openAnimation(animation: AnimationSetData): void {
	new AnimationDocumentApp({ animation }).render(true);
}
