import type { AnimationSetsObject } from './payload';
import type { TokenImagesObject } from './tokenImages';

/**
 * The complete, merged `animations/` data available to *PF2e Graphics*, as encoded in JSON. This includes both animation sets and token-image data.
 */
export type ModuleDataObject = AnimationSetsObject & TokenImagesObject;

// #region Relayed exports
export {
	type AnimationSet,
	animationSets,
	type AnimationSetsObject,
	animationSetsObject,
	type Payload,
} from './payload';
export { type PayloadType, payloadTypeList, payloadTypes } from './payloads';
export { type TokenImage, tokenImagesObject } from './tokenImages';
export { type Trigger, triggerList } from './triggers';
// #endregion
