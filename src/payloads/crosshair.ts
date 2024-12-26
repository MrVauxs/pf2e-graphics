import type { Payload } from '../../schema';
import { type ExecutionContext, offsetToVector2, positionToArgument } from '.';
import { devLog, ErrorMsg, getPlayerOwners, i18n } from '../utils';

export async function executeCrosshair(
	payload: Extract<Payload, { type: 'crosshair' }>,
	data: ExecutionContext,
): Promise<{ name: string; position: Vector2 }> {
	if (!payload.name) throw ErrorMsg.send('pf2e-graphics.execute.crosshair.error.noName');
	for (const token of data.sources) {
		if (!token.actor) {
			throw ErrorMsg.send('pf2e-graphics.execute.crosshair.error.noActor', {
				token: token.name,
			});
		}
	}

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
	if (payload.snap) {
		const snappingCode = getGridSnappingCode(payload.snap.position);
		crosshair.snap = {
			position: snappingCode,
			size: snappingCode,
			direction: payload.snap.direction ?? 0,
		};
	}
	if (payload.template) {
		if (payload.template.type === 'token') {
			crosshair.t = CONST.MEASURED_TEMPLATE_TYPES.CIRCLE;

			// Assume square token because *why* would you do that in Pf2e 😡
			const tokenGridSpaces
				= (positionToArgument(payload.template.relativeTo, data) as Token).getSize().height
				/ canvas.grid.size;

			crosshair.distance = ((tokenGridSpaces + (payload.template.padding ?? 0)) * canvas.grid.distance) / 2;

			const snappingCode
				= tokenGridSpaces % 2
					? getGridSnappingCode(['CENTER']) // Small, Medium, and Huge (plus larger odd-sized tokens)
					: getGridSnappingCode(['CORNER']); // Tiny, Large, and Gargantuan (plus larger even-sized tokens)
			crosshair.snap = {
				position: snappingCode,
				size: snappingCode,
				// @ts-expect-error pending https://github.com/fantasycalendar/FoundryVTT-Sequencer/pull/379
				resolution: tokenGridSpaces === 0.5 ? 2 : 1, // Tiny snaps within each square
				direction: 0,
			};
		} else {
			crosshair.t = CONST.MEASURED_TEMPLATE_TYPES[payload.template.type];
			crosshair.distance = payload.template.size.default;
			crosshair.distanceMin = payload.template.size.min; // Can be nullish
			crosshair.distanceMax = payload.template.size.max; // Can be nullish
			if ('angle' in payload.template) crosshair.angle = payload.template.angle ?? 90; // Sequencer default doesn't align with PF2e
			if (payload.template.type === 'RAY' && crosshair.width) crosshair.width = payload.template.width;
			if ('direction' in payload.template) crosshair.direction = payload.template.direction;
		}
		// TODO: is there a way to cause persistence with `Sequencer.Crosshair.show()`?
		// if (payload.template.persist) crosshair.persist = true;
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
			ui.notifications.info(i18n('pf2e-graphics.execute.crosshair.notifications.pickALocation'));
			Sequencer.Crosshair.show(crosshair).then((template) => {
				if (!template) throw ErrorMsg.send('pf2e-graphics.execute.crosshair.notifications.interrupted');
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

	if (!position) throw ErrorMsg.send('pf2e-graphics.execute.crosshair.error.unresolvedPosition');
	devLog('Crosshair position', payload.name, position);

	return {
		name: payload.name,
		position: position as Vector2,
	};
}

/**
 * @param positions An array of positions on a grid-space that can be snapped.
 * @returns A number Foundry turns into magic snapping stuff.
 */
function getGridSnappingCode(
	positions: (
		| 'BOTTOM_LEFT_CORNER'
		| 'BOTTOM_LEFT_VERTEX'
		| 'BOTTOM_RIGHT_CORNER'
		| 'BOTTOM_RIGHT_VERTEX'
		| 'BOTTOM_SIDE_MIDPOINT'
		| 'CENTER'
		| 'CORNER'
		| 'EDGE_MIDPOINT'
		| 'LEFT_SIDE_MIDPOINT'
		| 'RIGHT_SIDE_MIDPOINT'
		| 'SIDE_MIDPOINT'
		| 'TOP_LEFT_CORNER'
		| 'TOP_LEFT_VERTEX'
		| 'TOP_RIGHT_CORNER'
		| 'TOP_RIGHT_VERTEX'
		| 'TOP_SIDE_MIDPOINT'
		| 'VERTEX'
	)[] = ['CENTER'],
): number {
	return positions.reduce((s, v) => s | CONST.GRID_SNAPPING_MODES[v], 0);
}
