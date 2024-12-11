import type { AnimationPayload } from '../schema/animation';
import { type ExecutionContext, offsetToVector2, type SequencerTypes, targetToArgument, verifyPermissions } from '.';
import { log } from '../utils';

export async function executeAnimation(
	_seq: SequencerTypes,
	payload: Extract<AnimationPayload, { type: 'animation' }>,
	data: ExecutionContext,
) {
	let seq = _seq;

	for (const subject of payload.subjects) {
		if (subject === 'SOURCES') {
			for (const source of data.sources) {
				seq = processAnimation(seq, source, payload, data);
			}
		} else if (subject === 'TARGETS') {
			for (const target of data.targets) {
				seq = processAnimation(seq, target, payload, data);
			}
		} else {
			log('Failed to execute `animation` payload (unknown `targets`).');
		}
	}

	return _seq;
}

function processAnimation(
	_seq: SequencerTypes,
	token: TokenPF2e,
	payload: Parameters<typeof executeAnimation>[1],
	data: ExecutionContext,
): SequencerTypes {
	if (!token.actor) {
		log(`Failed to execute \`animation\` on ${token.name} (couldn't find actor).`);
		return _seq;
	}
	if (!verifyPermissions(token.actor)) {
		log(`Failed to execute \`animation\` payload on token ${token.name} (you don\'t own this token).`);
		return _seq;
	}

	const seq = _seq.animation(token);

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
	if (payload.fadeOut) seq.fadeIn(payload.fadeOut.duration, payload.fadeOut);
	// #endregion

	// #region Animation-specific stuff
	if (payload.position) {
		if (payload.position.type === 'MOVE') {
			// TODO: Sequencer types make this partial
			const options = {
				// `delay` is redundant here due to top-level `delay` (see above)
				ease: payload.position.ease,
				relativeToCenter: !payload.position.placeCorner,
			};
			/* @ts-expect-error TODO: fix Sequencer type */
			seq.moveTowards(targetToArgument(payload.position.target, data), options);
			if (payload.position.duration) seq.duration(payload.position.duration);
			if (payload.position.speed) seq.moveSpeed(payload.position.speed);
		} else if (payload.position.type === 'TELEPORT') {
			seq.teleportTo(payload.position.target, {
				delay: 0, // TODO: make optional on Sequencer type
				relativeToCenter: !payload.position.placeCorner,
			});
		} else {
			log(`Failed to execute \`animation\` payload on token ${token.name} (unknown \`position.type\`).`);
			return _seq;
		}
		if (payload.position.offset) seq.offset(offsetToVector2(payload.position.offset));
		if (payload.position.noCollision) seq.closestSquare();
		if (!payload.position.noSnap) seq.snapToGrid();
	}
	if (payload.rotation) {
		if (payload.rotation.type === 'DIRECTED') {
			seq.rotateTowards(targetToArgument(payload.rotation.target, data), {
				duration: payload.rotation.spin?.duration ?? 0,
				ease: payload.rotation.spin?.ease ?? 'linear',
				delay: payload.rotation.spin?.delay ?? 0,
				rotationOffset: payload.rotation.rotationOffset ?? 0,
				// TODO: Sequencer types to make this partial
				towardsCenter: true,
				cacheLocation: false,
			});
		} else if (payload.rotation.type === 'ABSOLUTE') {
			seq.rotateIn(
				payload.rotation.angle,
				payload.rotation.spin?.duration ?? 0,
				payload.rotation.spin ?? {},
			);
			if (payload.rotation.spin?.initialAngle) seq.rotate(payload.rotation.spin.initialAngle);
		} else if (payload.rotation.type === 'ADDITIVE') {
			seq.rotateIn(
				token.mesh.angle + payload.rotation.angle,
				payload.rotation.spin?.duration ?? 0,
				payload.rotation.spin ?? {},
			);
			if (payload.rotation.spin?.initialAngle)
				seq.rotate(token.mesh.angle + payload.rotation.spin.initialAngle);
		} else {
			log(`Failed to execute \`animation\` payload on token ${token.name} (unknown \`rotation.type\`}).`);
			return _seq;
		}
	}
	if (payload.visibility) {
		if (payload.visibility.opacity) seq.opacity(payload.visibility.opacity);
		if (payload.visibility.state) {
			if (payload.visibility.state === 'HIDE') {
				seq.hide();
			} else if (payload.visibility.state === 'SHOW') {
				seq.show();
			} else {
				log(
					`Failed to execute \`animation\` payload on token ${token.name} (unknown \`visibility.state\`).`,
				);
				return _seq;
			}
		}
	}
	if (payload.tint) seq.tint(payload.tint as `#${string}`); // Required due to Sequencer typings
	// #endregion

	return seq;
}
