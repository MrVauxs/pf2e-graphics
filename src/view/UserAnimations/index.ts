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
