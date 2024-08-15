import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application'

import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions'
import { kofiButton } from 'src/utils'
import BasicAppShell from './UserAnimationsShell.svelte'

interface UserAnimationsOptions {
	data: {
		user: UserPF2e | null
	}
}

export default class UserAnimationsApp extends SvelteApplication {
	constructor(options: ConstructorApplicationOptions & UserAnimationsOptions) {
		super()

		if (options.data) {
			foundry.utils.mergeObject(this.options, { svelte: { props: options.data } })
		}
	}

	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.modifyUser', // Automatically localized from `lang/en.json`.
			width: 800,
			height: 600,
			classes: ['pf2e-g'],
			id: 'pf2e-graphics-modify-user',
			resizable: true,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: {
					user: game.user,
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
