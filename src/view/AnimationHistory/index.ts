import AnimationHistoryApp from './AnimationHistoryApp';

Hooks.on('getSceneControlButtons', (controls: any[]) => {
	if (!window.pf2eGraphics.liveSettings.history && !game.user.isGM) return;
	const history = {
		icon: 'fa fa-history',
		name: 'animationhistory',
		title: 'pf2e-graphics.history.controlsButton.tooltip',
		button: true,
		onClick: () => AnimationHistoryApp.show(),
	};

	const bar = controls.find(c => c.name === 'token');
	bar.tools.push(history);
});
