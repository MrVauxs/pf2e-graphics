import WorldAnimationsApp from './WorldAnimationsApp.ts'

export default class WorldAnimationsShim extends FormApplication {
	/**
	 * @inheritDoc
	 */
	constructor(options = {}) {
		super({}, options)

		new WorldAnimationsApp({
			id: `pf2e-graphics-modify-item-world`,
		}).render(true, {
			focus: true,
		})
	}

	async _updateObject() {}
	override render() { this.close(); return this }
}
