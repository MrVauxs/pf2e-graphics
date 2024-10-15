import type { AnimationPayload } from '../schema/animation';
import { type GameData, graphicOptions, parseOffset, type SequencerTypes } from '.';
import { AnimCore } from '../storage/AnimCore';

export default function meleePreset(
	seq: SequencerTypes,
	payload: Extract<AnimationPayload, { type: 'melee' }>,
	data: GameData,
) {
	const { sources, targets = [] } = data;

	payload = foundry.utils.mergeObject(
		{
			randomizeMirrorY: true,
			anchor: {
				x: 0.4,
				y: 0.5 * Sequencer.Helpers.random_float_between(0.8, 1.2),
			},
			scaleToObject: {
				value: 4,
			},
		},
		payload,
	);

	for (const source of sources) {
		for (const target of targets.concat(payload.targets ?? [])) {
			seq = graphicOptions(seq.effect(), payload, data)
				.file(AnimCore.parseFiles(payload.file))
				.attachTo(source, parseOffset(payload.attachTo ?? {}))
				.rotateTowards(target, parseOffset(payload.rotateTowards ?? {}));
		}
	}

	return seq;
}
