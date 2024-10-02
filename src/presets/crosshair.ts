import type { AnimationPayload } from 'src/schema/animation';
import type { GameData, SequencerTypes } from '.';
import { devLog, ErrorMsg, getPlayerOwners, i18n } from 'src/utils';

export default async function crosshair(
	seq: SequencerTypes,
	execute: Extract<AnimationPayload, { type: 'crosshair' }>,
	data: GameData,
) {
	const { sources, user } = data;

	if (!execute.name) throw ErrorMsg.send('A crosshair preset was called but no names were provided for it!');
	if (!sources[0].actor) throw ErrorMsg.send('Could not find the token\'s actor?!');

	// Transform `execute` into Sequencer's `CrosshairData`
	const crosshair = new Sequence().crosshair().name(execute.name);
	if (execute.label) crosshair.label(execute.label.text, execute.label);
	if (execute.icon) crosshair.icon(execute.icon.texture, execute.icon);
	if (execute.template) {
		crosshair.type(CONST.MEASURED_TEMPLATE_TYPES[execute.template.type]);
		crosshair.distance(execute.template.size.default, execute.template.size);
		crosshair.angle(execute.template.angle ?? 90); // Does nothing if `type !== 'CONE'`
		if (execute.template.direction) crosshair.direction(execute.template.direction);
		if (execute.template.persist) crosshair.persist(true);
	}
	if (execute.snap) {
		if (execute.snap.position)
			crosshair.snapPosition(execute.snap.position.reduce((s, v) => s | CONST.GRID_SNAPPING_MODES[v], 0));
		if (execute.snap.direction) crosshair.snapDirection(execute.snap.direction);
	}
	if (execute.lockDrag) crosshair.lockDrag(true);
	if (execute.lockManualRotation) crosshair.lockManualRotation(true);
	if (execute.gridHighlight) crosshair.gridHighlight(true);
	if (execute.location) {
		crosshair.location(sources[0], {
			limitMinRange: execute.location.limitMinRange,
			limitMaxRange: execute.location.limitMaxRange,
			showRange: execute.location.showRange,
			lockToEdge: execute.location.lockToEdge,
			lockToEdgeDirection: execute.location.lockToEdgeDirection,
			offset: execute.location.offset,
			// TODO: import CONSTANTS from Sequencer
			// wallBehavior: CONSTANTS.PLACEMENT_RESTRICTIONS[execute.location.wallBehavior ?? 'ANYWHERE'],
		});
	}
	if (execute.borderColor) crosshair.borderColor(execute.borderColor as `#${string}`); // Guaranteed by Zod schema
	if (execute.fillColor) crosshair.fillColor(execute.fillColor as `#${string}`); // Guaranteed by Zod schema
	// end

	const users = user ? [game.users.get(user)!] : getPlayerOwners(sources[0].actor as ActorPF2e);

	const position = new Promise((resolve) => {
		if (users.find(x => x.id === game.userId)) {
			ui.notifications.info(i18n('pick-a-location'));
			// @ts-expect-error TODO: Expose `CrosshairSection._config`
			Sequencer.Crosshair.show(crosshair._config).then((template) => {
				window.pf2eGraphics.socket.executeForOthers(
					'remoteLocation',
					execute.name,
					// @ts-expect-error TODO: Sequencer Types (add Document class...)
					template.getOrientation(),
				);
				resolve(template);
			});
		} else {
			// Writable store that stores the location from above removeLocation socket
			const unsub = window.pf2eGraphics.locations.subscribe((array) => {
				const found = array.find(x => x.name === execute.name);
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
	devLog('Retrieved Crosshair Location', execute.name, resolvedLocation);

	if (resolvedLocation) {
		seq.addNamedLocation(execute.name, resolvedLocation);
	} else {
		// @ts-expect-error TODO: Sequencer types
		seq._abort();
	}

	return seq;
}
