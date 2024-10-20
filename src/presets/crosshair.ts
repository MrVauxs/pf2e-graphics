import type { GameData, SequencerTypes } from '.';
import type { AnimationPayload } from '../schema/animation';
import { devLog, ErrorMsg, getPlayerOwners, i18n } from '../utils';

export default async function crosshair(
	seq: SequencerTypes,
	payload: Extract<AnimationPayload, { type: 'crosshair' }>,
	data: GameData,
) {
	const { sources, user } = data;

	if (!payload.name) throw ErrorMsg.send('A crosshair preset was called but no names were provided for it!');
	if (!sources[0].actor) throw ErrorMsg.send('Could not find the token\'s actor?!');

	// #region Transform `payload` into Sequencer's `CrosshairData`
	const crosshair: NonNullable<Parameters<typeof Sequencer.Crosshair.show>[0]> = {
		gridHighlight: !payload.noGridHighlight,
		lockDrag: payload.lockDrag,
		lockManualRotation: payload.lockManualRotation,
		borderColor: payload.borderColor,
		fillColor: payload.fillColor,
	};
	if (payload.label) {
		crosshair.label = {
			text: payload.label.text,
			dx: payload.label.dx ?? 0,
			dy: payload.label.dy ?? 0,
		};
	}
	if (payload.icon) {
		crosshair.icon = {
			texture: payload.icon.texture,
			borderVisible: payload.icon.borderVisible ?? false,
		};
	}
	if (payload.template) {
		crosshair.t = CONST.MEASURED_TEMPLATE_TYPES[payload.template.type];
		crosshair.distance = payload.template.size.default;
		crosshair.distanceMin = payload.template.size.min; // Can be nullish
		crosshair.distanceMax = payload.template.size.max; // Can be nullish
		if ('angle' in payload.template) crosshair.angle = payload.template.angle ?? 90;
		if (payload.template.type === 'RAY') crosshair.width = payload.template.width ?? 90; // Sequencer default doesn't align with PF2e
		if ('direction' in payload.template) crosshair.direction = payload.template.direction;
		// TODO: is there a way to cause persistance with `Sequencer.Crosshair.show()`?
		// if (payload.template.persist) crosshair.persist = true;
	}
	if (payload.snap) {
		const gridSnappingMode = (payload.snap.position ?? ['CENTER']).reduce(
			(s, v) => s | CONST.GRID_SNAPPING_MODES[v],
			0,
		);
		crosshair.snap = {
			position: gridSnappingMode,
			size: gridSnappingMode,
			direction: payload.snap.direction ?? 0,
		};
	}
	if (payload.location) {
		crosshair.location = {
			obj: sources[0],
			limitMinRange: payload.location.limitMinRange ?? 0,
			limitMaxRange: payload.location.limitMaxRange ?? Infinity,
			showRange: payload.location.showRange ?? false,
			lockToEdge: payload.location.lockToEdge ?? false,
			lockToEdgeDirection: payload.location.lockToEdgeDirection ?? false,
			offset: { x: payload.location.offset?.x ?? 0, y: payload.location.offset?.y ?? 0 },
			wallBehavior: Sequencer.Crosshair.PLACEMENT_RESTRICTIONS[payload.location.wallBehavior ?? 'ANYWHERE'],
		};
	}
	// #endregion

	const users = user ? [game.users.get(user)!] : getPlayerOwners(sources[0].actor as ActorPF2e);

	const position = new Promise((resolve) => {
		if (users.find(x => x.id === game.userId)) {
			ui.notifications.info(i18n('pick-a-location'));
			Sequencer.Crosshair.show(crosshair).then((template) => {
				window.pf2eGraphics.socket.executeForOthers(
					'remoteLocation',
					payload.name,
					// @ts-expect-error TODO: Sequencer Types (add Document class...)
					template.getOrientation(),
				);
				resolve(template);
			});
		} else {
			// Writable store that stores the location from above removeLocation socket
			const unsub = window.pf2eGraphics.locations.subscribe((array) => {
				const found = array.find(x => x.name === payload.name);
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
	devLog('Retrieved Crosshair Location', payload.name, resolvedLocation);

	if (resolvedLocation) {
		seq.addNamedLocation(payload.name, resolvedLocation);
	} else {
		// @ts-expect-error TODO: Sequencer types
		seq._abort();
	}

	return seq;
}
