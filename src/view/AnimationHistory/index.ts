import AnimationHistoryApp from './AnimationHistoryApp';

Hooks.on('getSceneControlButtons', (controls: any[]) => {
	const history = {
		icon: 'fa fa-history',
		name: 'animationhistory',
		title: 'pf2e-graphics.history',
		button: true,
		onClick: () => AnimationHistoryApp.show(),
	};

	const bar = controls.find(c => c.name === 'token');
	bar.tools.push(history);
});
