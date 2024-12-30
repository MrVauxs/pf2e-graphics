import type { AnimationSetDocument, UserAnimationSetDocument, WorldAnimationSetDocument } from 'src/extensions';
import type { AnimationSet } from '../../../schema';
import { ErrorMsg } from 'src/utils';
import AnimationDocumentApp from '../AnimationDocument/AnimationDocumentApp';

function addToWorld(animation: WorldAnimationSetDocument) {
	window.pf2eGraphics.liveSettings.globalAnimations = [
		...window.pf2eGraphics.liveSettings.globalAnimations,
		animation,
	];
}

function addToCurrentUser(animation: UserAnimationSetDocument) {
	game.user.setFlag('pf2e-graphics', 'animations', [
		...((game.user.getFlag('pf2e-graphics', 'animations') ?? []) as AnimationSetDocument[]),
		animation,
	]);
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

// TODO: pop-up for 'duplicate as world/user animation set' (if permissions to write world animations; otherwise just do it as user automatically)
export function copyAnimation(animation: AnimationSetDocument): void {
	if (animation.source === 'world') {
		return addToWorld({
			...animation,
			name: `${animation.name} (Copy)`,
			id: foundry.utils.randomID(),
		});
	} else if (animation.source === 'user') {
		return addToCurrentUser({
			...animation,
			name: `${animation.name} (Copy)`,
			id: foundry.utils.randomID(),
		});
	} else if (animation.source === 'module') {
		// TODO: see above
		throw ErrorMsg.send(`Failed to copy animation set (provided by <code>${animation.module}</code>).`);
	} else {
		throw ErrorMsg.send('Failed to copy animation set (unknown source).');
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
				rollOption: game.pf2e.system.sluggify(name),
				animationSets: template,
				source: 'world',
			});
			break;
		case 'user':
		default:
			addToCurrentUser({
				id: foundry.utils.randomID(),
				name,
				user: game.userId,
				rollOption: game.pf2e.system.sluggify(name),
				animationSets: template,
				source: 'user',
			});
			break;
	}
}

export function removeAnimation(animation: AnimationSetDocument): void {
	if (animation.source === 'world') return removeFromWorld(animation);
	if (animation.source === 'user') return removeFromCurrentUser(animation);
	throw ErrorMsg.send('Failed to remove animation set (unknown source).');
}

export function openAnimation(animation: AnimationSetDocument): void {
	new AnimationDocumentApp({ animation }).render(true);
}
