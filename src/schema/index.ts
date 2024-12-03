import type { AnimationsData } from './animation';
import type { TokenImages } from './tokenImages';

export { animationsData } from './animation';
export { tokenImages } from './tokenImages';

/**
 * The complete, merged animations data available to PF2e Graphics.
 */
export type ModuleAnimationData = AnimationsData & TokenImages;
