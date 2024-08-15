import UserAnimationsApp from './UserAnimationsApp'

export default class UserAnimationsShim extends FormApplication {
	/**
	 * @inheritDoc
	 */
	constructor(options = { user: undefined }) {
		super()

		new UserAnimationsApp({
			data: { user: options.user ?? game.user },
		}).render(true, {
			focus: true,
		})
	}

	async _updateObject() {}
	override render() {
		this.close()
		return this
	}
}
