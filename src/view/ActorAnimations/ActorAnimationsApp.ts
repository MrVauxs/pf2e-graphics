import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application'

import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions'
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
			id: 'pf2e-graphics-modify-actor',
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
		buttons.unshift({
			icon: 'fas fa-mug-hot ko-fi',
			class: '',
			label: 'pf2e-graphics.support',
			onclick: () => {
				window.open('https://ko-fi.com/mrvauxs', '_blank')
			},
		})
		return buttons
	}
}
