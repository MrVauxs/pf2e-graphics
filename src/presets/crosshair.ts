import type { AnimationObject } from 'src/storage/animCore';
import { ErrorMsg, log } from 'src/utils';
import { type GameData, genericEffectOptions, parseOffsets, type SequencerTypes } from '.';

export default function crosshair(seq: SequencerTypes, animation: AnimationObject, data: GameData) {
	const { sources, targets = [] } = data;

	return seq;
}

interface ManagedCrosshairsSection {}

class ManagedCrosshairs extends Sequencer.BaseSection<ManagedCrosshairsSection> {
	_name: string;

	constructor(inSequence: Sequence) {
		super(inSequence);
		this._name = '';
	}

	name(inName: string) {
		if (typeof inName !== 'string') throw new ErrorMsg('.name() - inName must be of type string');
		this._name = inName;
		return this;
	}

	async run() {
		log(this._name);
	}
}

Hooks.once('sequencerReady', () => {
	Sequencer.SectionManager.registerSection('pf2e-graphics', 'managedCrosshairs', ManagedCrosshairs);
});
