import AnimationHistoryApp from './AnimationHistoryApp';

Hooks.on('getSceneControlButtons', (controls: any) => {
	if (
		!window.pf2eGraphics.liveSettings.history
		&& !game.user.isGM
		&& game.user.name !== 'Vauxs' // Teehee
	) {
		return;
	}
	const history = {
		icon: 'fa fa-history',
		name: 'animationhistory',
		title: 'pf2e-graphics.history.controlsButton.tooltip',
		button: true,
		onClick: () => AnimationHistoryApp.show(),
	};

	controls.tokens.tools.animationhistory = history;
});
