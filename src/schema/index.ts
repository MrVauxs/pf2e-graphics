import type { AnimationSetData } from './payload';
import type { TokenImages } from './tokenImages';

export { animationsSet as animationsData } from './payload';
export { tokenImages } from './tokenImages';

/**
 * The complete, merged animations data available to PF2e Graphics.
 */
export type ModuleAnimationData = AnimationSetData & TokenImages;
