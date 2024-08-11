import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions'
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application'
import { kofiButton } from 'src/utils'
import BasicAppShell from './ItemAnimationsShell.svelte'

interface ItemAnimationsOptions {
	data: {
		item: ItemPF2e | null
	}
}

export default class ItemAnimationsApp extends SvelteApplication {
	constructor(options: ConstructorApplicationOptions & ItemAnimationsOptions) {
		super()

		if (options.data) {
			foundry.utils.mergeObject(this.options, { svelte: { props: options.data } })
		}
	}

	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.modifyItem', // Automatically localized from `lang/en.json`.
			width: 300,
			classes: ['pf2e-g'],
			resizable: true,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: {
					item: null,
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
