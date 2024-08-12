import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application'

import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions'
import { type Writable, get } from 'svelte/store'
import type { Readable } from 'svelte/motion'
import BasicAppShell from './JSONEditor.svelte'

export default class JSONEditorApp extends SvelteApplication {
	[x: string]: any
	constructor(options: ConstructorApplicationOptions & { data: { store: Writable<any> | Readable<any>, key: string } }) {
		super()

		if (options.data) {
			foundry.utils.mergeObject(this.options, { svelte: { props: options.data } })
		}
	}

	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.jsonEditor', // Automatically localized from `lang/en.json`.
			width: 500,
			height: 600,
			classes: ['pf2e-g'],
			resizable: true,
			id: `pf2e-graphics-json-editor`,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: {
					store: null,
					key: '',
				},
			},
		})
	}

	override _getHeaderButtons() {
		const buttons = super._getHeaderButtons()
		buttons.unshift({
			icon: 'fas fa-copy',
			class: '',
			label: `Copy`,
			onclick: async () => {
				const { store, key } = this.svelte.data(0).config.props
				const json = get(store)

				try {
					await navigator.clipboard.writeText(JSON.stringify({ [key]: json }, null, '\t'))
					ui.notifications.info(`Copied data for ${key}!`)
				} catch (err) {
					ui.notifications.error(`Failed to copy, check console.`)
					console.error(err)
				}
			},
		})
		return buttons
	}
}
