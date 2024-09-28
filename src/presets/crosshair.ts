import type { AnimationObject } from 'src/storage/AnimCore';
import type { GameData, SequencerTypes } from '.';
import { devLog, ErrorMsg, getPlayerOwners, i18n, log } from 'src/utils';

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

	const location = new Promise((resolve) => {
		if (users.find(x => x.id === game.userId)) {
			ui.notifications.info(i18n('pick-a-location'));
			// @ts-expect-error Types for crosshairs when
			Sequencer.Crosshair.show(animation.options).then((template) => {
				window.pf2eGraphics.socket.executeForOthers('remoteLocation', animation.options!.name!, template);
				resolve(template);
			});
		} else {
			const id = Hooks.on('awaitedTeleportLocation', (name, location) => {
				if (name === animation.options!.name) {
					resolve(location);
					Hooks.off('awaitedTeleportLocation', id);
				} else {
					log(`Got a crosshair location for the wrong name! Got ${name}, waiting for ${animation.options!.name}`);
				};
			});
		}
	});

	const resolvedLocation = await location;
	devLog('Retrieved Crosshair Location', animation.options!.name!, resolvedLocation);

	if (resolvedLocation) {
		seq.addNamedLocation(animation.options!.name!, resolvedLocation);
	} else {
		// @ts-expect-error TODO: Sequencer types
		seq._abort();
	};

	return seq;
}
