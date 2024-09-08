import WorldAnimationsApp from './WorldAnimationsApp.ts';

export default class WorldAnimationsShim extends FormApplication {
	/**
	 * @inheritDoc
	 */
	constructor() {
		super();

		new WorldAnimationsApp().render(true, {
			focus: true,
		});
	}

	async _updateObject() {}
	override render() {
		this.close();
		return this;
	}
}

Hooks.once('ready', () => {
	game.settings.registerMenu('pf2e-graphics', 'worldAnimationsMenu', {
		name: 'pf2e-graphics.settings.worldMenu.name',
		hint: 'pf2e-graphics.settings.worldMenu.hint',
		label: 'pf2e-graphics.settings.worldMenu.label',
		icon: 'fas fa-globe',
		type: WorldAnimationsShim,
		restricted: false,
	});
});
