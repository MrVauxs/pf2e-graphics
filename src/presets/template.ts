import type { AnimationPayload } from '../schema/animation';
import { type GameData, graphicOptions, parseOffset, type SequencerTypes } from '.';
import { AnimCore } from '../storage/AnimCore';

export default function template(
	seq: SequencerTypes,
	payload: Extract<AnimationPayload, { type: 'template' }>,
	data: GameData,
) {
	const { targets = [] } = data;

	for (const template of targets.concat(payload.targets ?? [])) {
		seq = graphicOptions(seq.effect(), payload, data)
			.file(AnimCore.parseFiles(payload.file))
			.attachTo(template, parseOffset(payload.attachTo ?? {}));

		if (
			payload.stretchTo
			|| (typeof template === 'object'
				&& 't' in template
				&& (template.t === CONST.MEASURED_TEMPLATE_TYPES.RAY
					|| template.t === CONST.MEASURED_TEMPLATE_TYPES.CONE))
		) {
			seq.stretchTo(template, parseOffset({ ...payload.stretchTo, attachTo: true }));
		}
	}

	return seq;
}
