import UserAnimationsApp from './UserAnimationsApp';

export default class UserAnimationsShim extends FormApplication {
	/**
	 * @inheritDoc
	 */
	constructor(options: { user?: UserPF2e } = { user: game.user }) {
		super();

		new UserAnimationsApp({
			document: options.user ?? game.user,
		}).render(true, {
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
	game.settings.registerMenu('pf2e-graphics', 'userAnimations', {
		name: 'pf2e-graphics.settings.userMenu.name',
		hint: 'pf2e-graphics.settings.userMenu.hint',
		label: 'pf2e-graphics.settings.userMenu.label',
		icon: 'fas fa-user',
		type: UserAnimationsShim,
		restricted: false,
	});
});
