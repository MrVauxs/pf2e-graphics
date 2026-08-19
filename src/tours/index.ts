import type { TourConfig } from '../extensions';
import { generateSeriousTourConfigs } from './seriousTourConfigs';
import { generateSillyTourConfigs } from './sillyTourConfigs';

export interface TourConfigOptions {
	canSeeAnimationHistory: boolean;
}

function getTourConfigOptions(): TourConfigOptions {
	return {
		canSeeAnimationHistory: game.settings.get('pf2e-graphics', 'history') as boolean,
	};
}

/**
 * Gets the user's progress for registered tours in a given namespace.
 * @argument asdf asdfasdf
 * @returns A `Record` mapping IDs to an integer representing the tour progress. The value itself is the index of the currently completed step, with `-1` indicating a tour that has never been started. A value equal to the number of steps in the tour indicates that the tour is complete.
 */
export function getTourProgress(namespace: string = 'pf2e-graphics'): { [ID: string]: number } {
	const tourProgress = game.settings.get('core', 'tourProgress') as {
		[Namespace: string]: { [ID: string]: number };
	};
	return tourProgress[namespace];
}

/**
 * Defines and registers the module's tours with Foundry.
 *
 * During registration, it checks whether the user has started the tour. If any tour is unstarted, a private chat message offering to start the tours is posted.
 */
export async function registerTours() {
	/**
	 * A Tour subclass that handles controlling the UI state of a loaded world. It can handle both `sidebarTab` and `layer` controls.
	 * Code adapted from FoundryVTT's core `CanvasTour` class definition.
	 */
	class GrandUnifiedTour extends SidebarTour {
		override get canStart() {
			return !!canvas.scene;
		}

		override async _preStep() {
			await super._preStep();
			if ('layer' in this.currentStep! && canvas.scene) {
				const layer = canvas[this.currentStep.layer as keyof typeof canvas] as foundry.canvas.layers.InteractionLayer;
				if (layer.active) {
					ui.controls.activate({ tool: this.currentStep.tool! });
				} else {
					layer.activate({ tool: this.currentStep.tool! });
				}
			}
		}
	}

	const tourProgress = getTourProgress();

	// Register tours
	function registerTours(tourConfigs: TourConfig[]): TourConfig[] {
		const unstartedTourConfigs = [];
		for (const tourConfig of tourConfigs) {
			game.tours.register(tourConfig.namespace, tourConfig.id, new GrandUnifiedTour(tourConfig));
			if (
				!tourConfig.id.startsWith('🤹')
				&& (tourProgress === undefined
					|| tourProgress[tourConfig.id] === undefined
					|| tourProgress[tourConfig.id] === -1)
			) {
				unstartedTourConfigs.push(tourConfig);
			}
		}
		return unstartedTourConfigs;
	}
	const unstartedSeriousTourConfigs = registerTours(generateSeriousTourConfigs(getTourConfigOptions()));
	const unstartedSillyTourConfigs = registerTours(generateSillyTourConfigs(getTourConfigOptions()));

	// Post ~~nagging~~ welcome message if client has unstarted PF2e Graphics tours
	if (unstartedSeriousTourConfigs.length) {
		const randomUnstartedSillyTourConfig = Sequencer.Helpers.random_array_element(
			unstartedSillyTourConfigs,
		) as TourConfig;
		ChatMessage.create({
			style: CONST.CHAT_MESSAGE_STYLES.OOC,
			speaker: {
				alias: 'PF2e Graphics',
			},
			flags: {
				'pf2e-graphics': {
					component: 'TourNag',
					unstartedTourConfigs: unstartedSeriousTourConfigs.concat(randomUnstartedSillyTourConfig ?? []),
				},
			},
			whisper: [game.userId],
		});
	}
}
