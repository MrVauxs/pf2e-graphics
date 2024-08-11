import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application'

import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions'
import { kofiButton } from 'src/utils'
import BasicAppShell from './ActorAnimationsShell.svelte'

interface actorAnimationsOptions {
	data: {
		actor: ActorPF2e | null
	}
}

export default class actorAnimationsApp extends SvelteApplication {
	constructor(options: ConstructorApplicationOptions & actorAnimationsOptions) {
		super()

		if (options.data) {
			foundry.utils.mergeObject(this.options, { svelte: { props: options.data } })
		}
	}

	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.modifyActor', // Automatically localized from `lang/en.json`.
			width: 300,
			classes: ['pf2e-g'],
			resizable: true,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: {
					actor: null,
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
