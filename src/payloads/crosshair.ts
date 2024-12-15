import type { AnimationPayload } from '../schema/payload';
import { type ExecutionContext, offsetToVector2 } from '.';
import { devLog, ErrorMsg, getPlayerOwners, i18n } from '../utils';

export async function executeCrosshair(
	payload: Extract<AnimationPayload, { type: 'crosshair' }>,
	data: ExecutionContext,
): Promise<{ name: string; position: Vector2 }> {
	if (!payload.name) throw ErrorMsg.send('Failed to execute a `crosshair` payload (no `name` was provided).');
	if (!data.sources[0].actor)
		throw ErrorMsg.send('Failed to execute a `crosshair` payload (could not find source token\'s actor?!).');

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
		if ('angle' in payload.template) crosshair.angle = payload.template.angle ?? 90; // Sequencer default doesn't align with PF2e
		if (payload.template.type === 'RAY' && crosshair.width) crosshair.width = payload.template.width;
		if ('direction' in payload.template) crosshair.direction = payload.template.direction;
		// TODO: is there a way to cause persistence with `Sequencer.Crosshair.show()`?
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
			obj: data.sources[0],
			limitMinRange: payload.location.limitRange?.min ?? null,
			limitMaxRange: payload.location.limitRange?.max ?? null,
			showRange: payload.location.lockToEdge ? false : !payload.location.hideRangeTooltip,
			lockToEdge: payload.location.lockToEdge ?? false,
			lockToEdgeDirection: payload.location.lockToEdgeDirection ?? false,
			offset: offsetToVector2(payload.location.offset),
			wallBehavior: Sequencer.Crosshair.PLACEMENT_RESTRICTIONS[payload.location.wallBehavior ?? 'ANYWHERE'],
			displayRangePoly: !!payload.location.limitRange?.invisible,
			rangePolyFillColor: Number(
				`0x${(payload.location.limitRange?.fill?.color ?? '#66AA66').substring(1)}`,
			),
			rangePolyFillAlpha: payload.location.limitRange?.fill?.alpha ?? 0.25,
			rangePolyLineColor: Number(
				`0x${(payload.location.limitRange?.line?.color ?? '#228822').substring(1)}`,
			),
			rangePolyLineAlpha: payload.location.limitRange?.line?.alpha ?? 0.5,
		};
	}
	// #endregion

	const users = data.user ? [game.users.get(data.user)!] : getPlayerOwners(data.sources[0].actor as ActorPF2e);

	const seq = new Sequence();

	const position = await new Promise((resolve) => {
		if (users.find(user => user.id === game.userId)) {
			ui.notifications.info(i18n('pick-a-location'));
			Sequencer.Crosshair.show(crosshair).then((template) => {
				if (!template) {
					throw new ErrorMsg(
						'Payload interrupted due to cancelled crosshair. Use the Effect Manager to remove any remaining graphics/sounds.',
					);
				}
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

			// Timeout after 60 seconds.
			setTimeout(() => {
				unsub();
				// @ts-expect-error TODO: Sequencer types
				if (!seq.status) seq._abort();
			}, 60_000);
		}
	});

	if (!position) throw new ErrorMsg('Payload failed (could not resolve crosshair position).');
	devLog('Crosshair position', payload.name, position);

	return {
		name: payload.name,
		position: position as Vector2,
	};
}
