import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions';
import { ErrorMsg } from 'src/utils';
import { type Writable, get, writable } from 'svelte/store';
import BasicAppShell from './JSONEditor.svelte';

interface extra { store: Writable<object>; permission?: boolean; readOnly?: true; stasis?: Writable<boolean>; validate: boolean }
export default class JSONEditorApp extends SvelteApplication {
	constructor(_options: ConstructorApplicationOptions & extra) {
		// @ts-expect-error TJS-2-TS
		super(_options);

		// @ts-expect-error TJS-2-TS
		const readOnly = this.options.readOnly ?? !this.options.permission;
		this.options.title = readOnly ? 'pf2e-graphics.jsonEditorReadonly' : 'pf2e-graphics.jsonEditor';
	}

	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.jsonEditor',
			width: 400,
			height: 320,
			classes: ['pf2e-g'],
			resizable: true,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: function () {
					// @ts-expect-error TJS-2-TS
					const store = this.options.store;
					if (!store) throw new ErrorMsg('No Store Provided in ItemAnimationsApp!');
					// @ts-expect-error TJS-2-TS
					const readOnly = this.options.readOnly ?? !this.options.permission;
					// @ts-expect-error TJS-2-TS
					const validate = this.options.validate;
					// @ts-expect-error TJS-2-TS
					const stasis = this.options.stasis ?? writable(false);
					return {
						store,
						readOnly,
						stasis,
						validate,
					};
				} as () => { store: Writable<object>; readOnly: boolean; stasis: Writable<boolean> },
			},
		});
	}

	override _getHeaderButtons() {
		const buttons = super._getHeaderButtons();
		buttons.unshift({
			icon: 'fas fa-copy',
			class: '',
			label: `Copy`,
			onclick: async () => {
				try {
					// @ts-expect-error Types
					await navigator.clipboard.writeText(JSON.stringify(get(this.options.store), null, '\t'));
					ui.notifications.info(`Copied to clipboard!`);
				} catch (err) {
					ui.notifications.error(`Failed to copy, check console.`);
					console.error(err);
				}
			},
		});
		return buttons;
	}
}
