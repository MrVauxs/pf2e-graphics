import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application'
import BasicAppShell from './test.svelte'

export default class testApp extends SvelteApplication {
	constructor(options) {
		super()

		if (options.data) {
			foundry.utils.mergeObject(this.options, { svelte: { props: options.data } })
		}
	}

	static override get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.test', // Automatically localized from `lang/en.json`.
			width: 300,
			classes: ['pf2e-g'],
			resizable: true,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: {
					document: null,
				},
			},
		})
	}
}

window.testApp = testApp
