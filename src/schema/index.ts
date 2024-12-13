import type { AnimationsData } from './payload';
import type { TokenImages } from './tokenImages';

export { animationsData } from './payload';
export { tokenImages } from './tokenImages';

/**
 * The complete, merged animations data available to PF2e Graphics.
 */
export type ModuleAnimationData = AnimationsData & TokenImages;
