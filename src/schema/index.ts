import type { Animation } from './animation';
import type { TokenImages } from './tokenImages';

export { animations } from './animation';
export { tokenImages } from './tokenImages';

/**
 * The complete, merged animations data available to PF2e Graphics.
 */
export type ModuleAnimationData = TokenImages & { [rollOption: string]: string | Animation[] };
