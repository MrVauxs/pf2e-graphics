import type { CombinedSvelteApplicationOptions } from 'src/extensions'
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application'
import { kofiButton } from 'src/utils'
import { writable } from 'svelte/store'
import BasicAppShell from './WorldAnimationsShell.svelte'

export default class WorldAnimationsApp extends SvelteApplication {
	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.modifyWorld', // Automatically localized from `lang/en.json`.
			classes: ['pf2e-g'],
			resizable: true,
			width: 600,
			height: 900,
			id: 'pf2e-graphics-world-settings',

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: {
					storeDocument: writable({ id: 'settings' }),
				},
			},
		})
	}

	override _getHeaderButtons() {
		const buttons = super._getHeaderButtons()
		kofiButton(buttons)
		return buttons
	}
}
