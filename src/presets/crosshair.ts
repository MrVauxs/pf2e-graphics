import type { AnimationObject } from 'src/storage/AnimCore';
import type { GameData, SequencerTypes } from '.';
import { devLog, ErrorMsg, getPlayerOwners, i18n } from 'src/utils';

export default async function crosshair(seq: SequencerTypes, animation: AnimationObject, data: GameData) {
	const { sources, user } = data;

	if (!animation.options?.name) {
		throw ErrorMsg.send('A crosshair preset was called but no names were provided for it!');
	}

	if (!sources[0].actor) {
		throw ErrorMsg.send('Could not find the tokens actor??');
	}

	animation.options = foundry.utils.mergeObject({
		location: {
			obj: sources[0],
		},
	}, animation.options);

	const users = user ? [game.users.get(user)!] : (getPlayerOwners(sources[0].actor as ActorPF2e));

	const position = new Promise((resolve) => {
		if (users.find(x => x.id === game.userId)) {
			ui.notifications.info(i18n('pick-a-location'));
			// @ts-expect-error TODO: Types for crosshairs when
			Sequencer.Crosshair.show(animation.options).then((template) => {
				window.pf2eGraphics.socket.executeForOthers('remoteLocation', animation.options!.name!, template.getOrientation());
				resolve(template);
			});
		} else {
			// Writable store that stores the location from above removeLocation socket
			const unsub = window.pf2eGraphics.locations.subscribe((array) => {
				const found = array.find(x => x.name === animation.options!.name);
				if (found) {
					resolve(found.location);
					window.pf2eGraphics.locations.update(array => array.filter(x => x.name !== found.name));
					unsub();
				}
			});

			// Timeout after 30 seconds.
			setTimeout(() => {
				unsub();
				// @ts-expect-error TODO: Sequencer types
				if (!seq.status) seq._abort();
			}, 30 * 1000);
		}
	});

	const resolvedLocation = await position;
	devLog('Retrieved Crosshair Location', animation.options!.name!, resolvedLocation);

	if (resolvedLocation) {
		seq.addNamedLocation(animation.options!.name!, resolvedLocation);
	} else {
		// @ts-expect-error TODO: Sequencer types
		seq._abort();
	};

	return seq;
}
