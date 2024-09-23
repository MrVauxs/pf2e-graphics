import type { AnimationObject } from 'src/storage/animCore';
import { log } from 'src/utils';
import { type GameData, genericEffectOptions, parseOffsets, type SequencerTypes } from '.';

export default function crosshair(seq: SequencerTypes, animation: AnimationObject, data: GameData) {
	const { sources, targets = [] } = data;

	return seq;
}

class ManagedCrosshairs extends Sequencer.BaseSection {
	_name: string;

	constructor(inSequence: Sequence) {
		super(inSequence);
		this._name = '';
	}

	name(inName: string) {
		if (typeof inName !== 'string') throw this.sequence._throwError(this, 'name', 'inName must be of type string');
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
