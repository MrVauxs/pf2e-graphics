import WorldAnimationsApp from './WorldAnimationsApp.ts'

let app: null | WorldAnimationsApp = null
export default class WorldAnimationsShim extends FormApplication {
	/**
	 * @inheritDoc
	 */
	constructor(options = {}) {
		super({}, options)

		if (app) {
			app.render(true, { focus: true })
		} else {
			app = new WorldAnimationsApp({}).render(true, { focus: true })
		}
	}

	async _updateObject() {}
	override render() {
		this.close()
		return this
	}
}
