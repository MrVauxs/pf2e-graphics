/**
 * Defines and registers the module's tours with Foundry.
 *
 * During registration, it checks whether the user has started the tour. If any tour is unstarted, a private chat message offering to start the tours is posted.
 */
export async function registerTours() {
	/**
	 * An array of `TourConfig`s that define the tours that *PF2e Graphics* adds.
	 */
	const newTourConfigs: TourConfig[] = [
		{
			namespace: 'pf2e-graphics',
			id: 'sidebar',
			title: 'pf2e-graphics.tours.sidebar.title',
			description: 'pf2e-graphics.tours.sidebar.description',
			display: true,
			canBeResumed: true,
			steps: [
				{
					id: '1:intro',
					title: 'pf2e-graphics.tours.sidebar.steps.1:intro.title',
					content: 'pf2e-graphics.tours.sidebar.steps.1:intro.content',
				},
				{
					id: '2:animationSetsTabButton',
					title: 'pf2e-graphics.tours.sidebar.steps.2:animationSetsTabButton.title',
					content: 'pf2e-graphics.tours.sidebar.steps.2:animationSetsTabButton.content',
					selector: 'a[data-tab="graphics"]',
				},
				{
					id: '3:animationSetsTab',
					title: 'pf2e-graphics.tours.sidebar.steps.3:animationSetsTab.title',
					content: 'pf2e-graphics.tours.sidebar.steps.3:animationSetsTab.content',
					selector: '#graphics',
					sidebarTab: 'graphics',
					tooltipDirection: 'LEFT',
				},
				{
					id: '4:bundledAnimationSets',
					title: 'pf2e-graphics.tours.sidebar.steps.4:bundledAnimationSets.title',
					content: 'pf2e-graphics.tours.sidebar.steps.4:bundledAnimationSets.content',
					selector: '#pf2e-graphics-bundled-sets',
					sidebarTab: 'graphics',
					tooltipDirection: 'LEFT',
				},
				{
					id: '5:customAnimationSets',
					title: 'pf2e-graphics.tours.sidebar.steps.5:customAnimationSets.title',
					content: 'pf2e-graphics.tours.sidebar.steps.5:customAnimationSets.content',
					selector: '#pf2e-graphics-custom-sets',
					sidebarTab: 'graphics',
					tooltipDirection: 'LEFT',
				},
				{
					id: '6:animationHistory',
					title: 'pf2e-graphics.tours.sidebar.steps.6:animationHistory.title',
					content: 'pf2e-graphics.tours.sidebar.steps.6:animationHistory.content',
					selector: 'li[data-tool="animationhistory"]',
					layer: 'tokens',
					tooltipDirection: 'RIGHT',
					restricted: !(game.settings.get('pf2e-graphics', 'history') as boolean),
				},
				{
					id: '7:animationSetsVolumeSlider',
					title: 'pf2e-graphics.tours.sidebar.steps.7:animationSetsVolumeSlider.title',
					content: 'pf2e-graphics.tours.sidebar.steps.7:animationSetsVolumeSlider.content',
					selector: '.playlist-sounds #pf2e-graphics-volume-slider',
					sidebarTab: 'playlists',
					tooltipDirection: 'LEFT',
				},
				{
					id: '8:thanks',
					title: 'pf2e-graphics.tours.sidebar.steps.8:thanks.title',
					content: 'pf2e-graphics.tours.sidebar.steps.8:thanks.content',
				},
			],
		},
	] as const;

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
				const layer = canvas[this.currentStep.layer as keyof typeof canvas] as InteractionLayer;
				if (layer.active) {
					ui.controls.initialize({ tool: this.currentStep.tool });
				} else {
					layer.activate({ tool: this.currentStep.tool });
				}
			}
		}
	}

	// Get the secret tour progress-tracker for the client
	const tourProgress = game.settings.get('core', 'tourProgress') as {
		[Namespace: string]: {
			[ID: string]: number;
			//                    -1 :: not started
			//              0..(N-1) :: completed Nth step
			// N = Tour.steps.length :: all complete
		};
	};

	const unstartedTourConfigs: TourConfig[] = [];

	// Register tours
	for (const newTourConfig of newTourConfigs) {
		game.tours.register(newTourConfig.namespace, newTourConfig.id, new GrandUnifiedTour(newTourConfig));
		if (
			tourProgress[newTourConfig.namespace] === undefined
			|| tourProgress[newTourConfig.namespace][newTourConfig.id] === undefined
			|| tourProgress[newTourConfig.namespace][newTourConfig.id] === -1
		) {
			unstartedTourConfigs.push(newTourConfig);
		}
	}

	// Post ~~nagging~~ welcome message if client has unstarted PF2e Graphics tours
	if (unstartedTourConfigs.length) {
		ChatMessage.create({
			style: CONST.CHAT_MESSAGE_STYLES.OOC,
			speaker: {
				alias: 'PF2e Graphics',
			},
			flags: {
				'pf2e-graphics': {
					component: 'TourNag',
					unstartedTourConfigs,
				},
			},
			whisper: [game.userId],
		});
	}
}
