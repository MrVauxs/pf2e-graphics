import type { AnimationObject } from 'src/storage/AnimCore';
import { ErrorMsg, log } from 'src/utils';
import { type GameData, genericEffectOptions, parseOffsets, type SequencerTypes } from '.';

export default function crosshair(seq: SequencerTypes, animation: AnimationObject, data: GameData) {
	const { sources, targets = [] } = data;

	seq
		.managedCrosshairs()
		.name('test');

	return seq;
}

interface ManagedCrosshairsSection {}

Hooks.once('sequencerReady', () => {
	class ManagedCrosshairs extends Sequencer.BaseSection<ManagedCrosshairsSection> {
		_name: string;

		constructor(inSequence: Sequence) {
			super(inSequence);
			this._name = '';
		}

		name(inName: string) {
			if (typeof inName !== 'string') throw this.sequence._customError(this, 'name', 'inName must be of type string');
			this._name = inName;
			return this;
		}

		async run() {
			await new Promise((resolve) => {
				setTimeout(resolve, 5000);
			});
		}
	}

	Sequencer.SectionManager.registerSection('pf2e-graphics', 'managedCrosshairs', ManagedCrosshairs);
});
