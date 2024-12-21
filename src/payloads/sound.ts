import type { Payload } from '../schema/payload';
import type { ArrayElement } from '../utils';
import { addCustomExecutionContext, type ExecutionContext } from '.';
import { AnimCore } from '../storage/AnimCore';

export function executeSound(
	payload: Extract<Payload, { type: 'sound' }>,
	data: ExecutionContext,
): Sequence {
	const seq = new Sequence();

	data = addCustomExecutionContext(payload.sources, payload.targets, data);

	for (const position of payload.position) {
		seq.addSequence(processSound(payload, data, position));
	}

	return seq;
}

function processSound(
	payload: Parameters<typeof executeSound>[0],
	_data: ExecutionContext,
	_position: ArrayElement<Parameters<typeof executeSound>[0]['position']>,
): SoundSection {
	const seq = new Sequence().sound().file(AnimCore.parseFiles(payload.sound));

	// TODO

	return seq;
}
