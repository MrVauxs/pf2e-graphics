import type { TokenOrDoc } from '../extensions';
import type { Payload } from '../schema/payload';
import { addCustomExecutionContext, type ExecutionContext, offsetToVector2, positionToArgument, verifyPermissions } from '.';
import { ErrorMsg } from '../utils';

export async function executeAnimation(
	payload: Extract<Payload, { type: 'animation' }>,
	data: ExecutionContext,
): Promise<Sequence> {
	const seq = new Sequence();

	data = addCustomExecutionContext(payload.sources, payload.targets, data);

	for (const subject of payload.subjects) {
		if (subject === 'SOURCES') {
			for (const source of data.sources) {
				seq.addSequence(await processAnimation(source, payload, data));
			}
		} else if (subject === 'TARGETS') {
			for (const target of data.targets) {
				seq.addSequence(await processAnimation(target, payload, data));
			}
		} else {
			throw ErrorMsg.send('Failed to execute `animation` payload (unknown `targets`).');
		}
	}

	return seq;
}

async function processAnimation(
	token: TokenOrDoc,
	payload: Parameters<typeof executeAnimation>[0],
	data: ExecutionContext,
): Promise<AnimationSection> {
	if (!token.actor) {
		throw ErrorMsg.send(`Failed to execute \`animation\` on ${token.name} (couldn't find actor).`);
	}
	// TODO: Only actually run an animation if the user is the triggering user!
	if (!(await verifyPermissions(token.actor))) {
		throw ErrorMsg.send(
			`Failed to execute \`animation\` payload on token ${token.name} (you don\'t own this token).`,
		);
	}

	const seq = new Sequence().animation(token);

	// #region Common effect stuff
	if (payload.repeats) {
		if (typeof payload.repeats.delay === 'object') {
			seq.repeats(payload.repeats.count, payload.repeats.delay.min, payload.repeats.delay.max);
		} else {
			seq.repeats(payload.repeats.count, payload.repeats.delay ?? 0);
		}
		if (payload.repeats.async) seq.async();
	}
	if (payload.waitUntilFinished) {
		if (typeof payload.waitUntilFinished === 'object') {
			seq.waitUntilFinished(payload.waitUntilFinished.min, payload.waitUntilFinished.max);
		} else {
			seq.waitUntilFinished(payload.waitUntilFinished);
		}
	}
	if (payload.probability) seq.playIf(() => Math.random() < payload.probability!);
	if (payload.delay) {
		if (typeof payload.delay === 'object') {
			seq.delay(payload.delay.min, payload.delay.max);
		} else {
			seq.delay(payload.delay);
		}
	}
	if (payload.fadeIn) seq.fadeIn(payload.fadeIn.duration, payload.fadeIn);
	if (payload.fadeOut) seq.fadeOut(payload.fadeOut.duration, payload.fadeOut);
	// #endregion

	// #region Animation-specific stuff
	if (payload.position) {
		if (payload.position.type === 'move') {
			// TODO: Sequencer types make this partial
			const options = {
				// `delay` is redundant here due to top-level `delay` (see above)
				ease: payload.position.ease,
				relativeToCenter: !payload.position.placeCorner,
			};
			// @ts-expect-error TODO: fix Sequencer type
			seq.moveTowards(positionToArgument(payload.position.location, data), options);
			if (payload.position.duration) seq.duration(payload.position.duration);
			if (payload.position.speed) seq.moveSpeed(payload.position.speed);
		} else if (payload.position.type === 'teleport') {
			seq.teleportTo(payload.position.location, {
				delay: 0, // TODO: make optional on Sequencer type
				relativeToCenter: !!payload.position.placeCorner,
			});
		} else {
			throw ErrorMsg.send(
				`Failed to execute \`animation\` payload on token ${token.name} (unknown \`position.type\`).`,
			);
		}
		if (payload.position.offset) seq.offset(offsetToVector2(payload.position.offset));
		if (payload.position.noCollision) seq.closestSquare();
		if (!payload.position.noSnap) seq.snapToGrid();
	}
	if (payload.rotation) {
		if (payload.rotation.type === 'directed') {
			seq.rotateTowards(positionToArgument(payload.rotation.target, data), {
				duration: payload.rotation.spin?.duration ?? 0,
				ease: payload.rotation.spin?.ease ?? 'linear',
				delay: payload.rotation.spin?.delay ?? 0,
				rotationOffset: payload.rotation.rotationOffset ?? 0,
				// TODO: Sequencer types to make this partial
				towardsCenter: true,
				cacheLocation: false,
			});
		} else if (payload.rotation.type === 'absolute') {
			seq.rotateIn(
				payload.rotation.angle,
				payload.rotation.spin?.duration ?? 0,
				payload.rotation.spin ?? {},
			);
			if (payload.rotation.spin?.initialAngle) seq.rotate(payload.rotation.spin.initialAngle);
		} else if (payload.rotation.type === 'additive') {
			seq.rotateIn(
				token.rotation + payload.rotation.angle,
				payload.rotation.spin?.duration ?? 0,
				payload.rotation.spin ?? {},
			);
			if (payload.rotation.spin?.initialAngle)
				seq.rotate(token.rotation + payload.rotation.spin.initialAngle);
		} else {
			throw ErrorMsg.send(
				`Failed to execute \`animation\` payload on token ${token.name} (unknown \`rotation.type\`}).`,
			);
		}
	}
	if (payload.visibility) {
		if (payload.visibility.opacity) seq.opacity(payload.visibility.opacity);
		if (payload.visibility.state) {
			if (payload.visibility.state === 'hide') {
				seq.hide();
			} else if (payload.visibility.state === 'show') {
				seq.show();
			} else {
				throw ErrorMsg.send(
					`Failed to execute \`animation\` payload on token ${token.name} (unknown \`visibility.state\`).`,
				);
			}
		}
	}
	if (payload.tint) seq.tint(payload.tint as `#${string}`); // Required due to Sequencer typings
	// #endregion

	return seq;
}
