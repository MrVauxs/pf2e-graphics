import UserAnimationsApp from './UserAnimationsApp'

let app: null | UserAnimationsApp = null

export default class UserAnimationsShim extends FormApplication {
	/**
	 * @inheritDoc
	 */
	constructor(options = {}) {
		super({}, options)

		if (app) {
			app.render(true, { focus: true })
		} else {
			app = new UserAnimationsApp({
				data: { user: game.user },
				id: `pf2e-graphics-modify-item-${game.user.id}`,
			}).render(true, {
				focus: true,
			})
		}
	}

	async _updateObject() {}
	override render() {
		this.close()
		return this
	}
}
