import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions'
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application'
import { kofiButton } from 'src/utils'
import BasicAppShell from './WorldAnimationsShell.svelte'

export default class WorldAnimationsApp extends SvelteApplication {
	constructor(_options: ConstructorApplicationOptions) {
		super()
	}

	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.modifyWorld', // Automatically localized from `lang/en.json`.
			width: 800,
			height: 600,
			classes: ['pf2e-g'],
			id: 'pf2e-graphics-modify-world',
			resizable: true,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
			},
		})
	}

	override _getHeaderButtons() {
		const buttons = super._getHeaderButtons()
		kofiButton(buttons)
		return buttons
	}
}
