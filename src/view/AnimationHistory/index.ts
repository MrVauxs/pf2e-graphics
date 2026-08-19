import AnimationHistoryApp from './AnimationHistoryApp';

// As of Foundry v13 this hook receives a record of scene controls keyed by name (not an array), each
// with a `tools` record rather than an array. The token control is also keyed `tokens`, not `token`,
// and per-tool handlers are `onChange` rather than `onClick`.
Hooks.on('getSceneControlButtons', (controls: Record<string, any>) => {
	if (
		!window.pf2eGraphics.liveSettings.history
		&& !game.user.isGM
		&& game.user.name !== 'Vauxs' // Teehee
	) {
		return;
	}

	const bar = controls.tokens;
	if (!bar?.tools) return;

	bar.tools.animationhistory = {
		icon: 'fa fa-history',
		name: 'animationhistory',
		title: 'pf2e-graphics.history.controlsButton.tooltip',
		button: true,
		visible: true,
		order: Object.keys(bar.tools).length,
		onChange: () => AnimationHistoryApp.show(),
	};
});
