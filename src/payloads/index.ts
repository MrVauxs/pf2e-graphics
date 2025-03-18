import type { DegreeOfSuccessString, ItemPF2e, MeasuredTemplateDocumentPF2e, TokenPF2e } from 'foundry-pf2e';
import type { Payload, Trigger } from '../../schema';
import type { TokenOrDoc } from '../extensions';
import { ErrorMsg, warn } from '../utils.ts';
import { executeAnimation } from './animation.ts';
import { executeCrosshair } from './crosshair.ts';
import { executeGraphic } from './graphic.ts';
import { executeSound } from './sound.ts';

/**
 * Describes the context for animation-triggers, particularly those which might affect execution.
 */
export interface TriggerContext {
	outcome?: DegreeOfSuccessString;
}

/**
 * An interface that describes the context in which an animation is being triggered.
 * - `sources`: the source tokens
 * - `targets`: the target tokens
 * - `templates`: any attached templates
 * - `user`: the triggering user
 * - `currentIndex`: in a set of multiple payloads, this is the currently decoding index (starting from zero)
 * - `item`: the item containing the roll option (if any)
 * - `trigger`: the type of trigger itself
 * - `triggerContext`: some information about the triggering event
 */
export interface ExecutionContext {
	label?: string;
	sources: TokenOrDoc[];
	targets: TokenOrDoc[];
	templates: MeasuredTemplateDocument[];
	user?: string;
	item?: ItemPF2e<any>;
	currentIndex: number;
	trigger: Trigger;
	triggerContext: TriggerContext;
}

/**
 * A safe wrapper around a decoded payload, so that other code knows how to handle the returned sequence or supporting Sequencer data.
 *
 * The following `type`s are possible:
 * - `'sequence'`: a sequence (`new Sequence()`) that can be `.play()`ed or merged with `.addSequence()`
 * - `'namedLocation'`: a named location returned by a crosshair (since named locations can't be merged with `.addSequence()`)
 * - `'null'`: a blank return that indicates no action should be taken (occurs when animations are played by other users)
 */
type DecodedPayload =
	| { type: 'sequence'; data: Sequence }
	| { type: 'namedLocation'; data: { name: string; position: Vector2 } }
	| { type: 'null' };

/**
 * The top-level payload-decoding function. A payload goes in with the current game data (i.e. execution context), and an appropriate comes out.
 *
 * This should probably either be `.play()`ed immediately or merged with another sequence using `.addSequence()`. Named locations must be directly registered with `.addNamedLocation()`, since you cannot `.addSequence()` a named location.
 */
export async function decodePayload(payload: Payload, context: ExecutionContext, ignoreLackOfPayload?: boolean): Promise<DecodedPayload> {
	if (!payload || !payload.type) {
		if (ignoreLackOfPayload) {
			return { type: 'null' };
		} else {
			throw ErrorMsg.send('pf2e-graphics.execute.common.error.missingPayload');
		}
	}

	if (payload.type === 'graphic') return { type: 'sequence', data: executeGraphic(payload, context) };
	if (payload.type === 'sound') return { type: 'sequence', data: executeSound(payload, context) };
	if (payload.type === 'crosshair')
		return { type: 'namedLocation', data: await executeCrosshair(payload, context) };
	if (payload.type === 'animation') {
		if (game.userId === context.user)
			return { type: 'sequence', data: await executeAnimation(payload, context) };
		return { type: 'null' };
	}
	if (payload.type === 'macro') {
		if (payload.everyoneExecutes || game.userId === context.user) {
			return {
				type: 'sequence',
				data: new Sequence().macro(payload.document, { ...context, ...payload.options }),
			};
		}
		return { type: 'null' };
	}

	throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
		payloadType: (payload as any).type.toString(),
		property: 'type',
	});
}

export function addCustomExecutionContext(
	sources: string[] = [],
	targets: string[] = [],
	data: ExecutionContext,
): ExecutionContext {
	sources.forEach(async (uuid) => {
		const doc = await fromUuid(uuid);
		if (doc instanceof TokenDocument || doc instanceof Token) {
			data.sources.push(doc);
		} else {
			warn(`Could not find custom source token \`${uuid}\`.`);
		}
	});
	targets.forEach(async (uuid) => {
		const doc = await fromUuid(uuid);
		if (doc instanceof TokenDocument || doc instanceof Token) {
			data.targets.push(doc);
		} else {
			warn(`Could not find custom target token \`${uuid}\`.`);
		}
	});
	return data;
}

/**
 * Converts a schema-compliant position to something Sequencer can actually handle. Notably, this means:
 * - Converting implicit (0-default) X-Y coordinates to an explicit coordinate-object;
 * - Correctly identifying the appropriate token for `SOURCES`, `TARGETS`, and `TEMPLATES` (depending on `context`);
 * - Leaving named locations (e.g. from crosshairs) untouched.
 * @param position The target position.
 * @param context The execution context.
 * @returns Something that can go into Sequencer's positional methods, such as effects' `.atLocation()` and animations' `teleportTo()`.
// TODO: be smart enough to select a particular element in the `data.<...>` array (e.g. for ranged bounce)
 */
export function positionToArgument(
	position: string | Partial<Vector2>,
	context: Pick<ExecutionContext, 'sources' | 'targets' | 'templates'>,
): string | Vector2 | TokenPF2e | MeasuredTemplateDocumentPF2e {
	if (typeof position === 'object') return offsetToVector2(position);

	if (position === 'SOURCES') return context.sources[0];
	if (position === 'TARGETS') return context.targets[0];
	if (position === 'TEMPLATES') return context.templates[0];

	if (typeof position === 'string') return position;

	throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownPosition', {
		position: (position as any).toString(),
	});
}

// TODO: convert this to a prompt for the GM to accept when permissions fail
export async function verifyPermissions(actor: Actor): Promise<boolean> {
	return actor.permission === 3;
}

/**
 * Converts the ubiquitous `offset` schema (`{x?: number, y?: number}` with default values of 0) into the Sequencer-desired full form, where both properties are necessarily defined.
 * @param offset The object as permitted by the schema
 * @param [assumed] The default value of each coordinate.
 * @returns A `Vector2` object satisfying `{x: number, y: number}`.
 */
export function offsetToVector2(offset: Partial<Vector2> | undefined, assumed: number = 0): Vector2 {
	return {
		x: offset?.x ?? assumed,
		y: offset?.y ?? assumed,
	};
}

/**
 * Converts schema values that can be either a single number or a range of numbers into something Sequencer can read (with a spread operator). For instance, Sequencer's `.delay()` effect method takes either a single number or two arguments (the former being the minimum and the latter the maximum).
 */
export function parseMinMaxObject(value: number | { min: number; max: number }): [number, number?] {
	if (typeof value === 'number') return [value];
	return [value.min, value.max];
}
