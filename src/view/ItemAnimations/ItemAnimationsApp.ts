import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from '../../extensions';
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document';
import { ErrorMsg, kofiButton } from '../../utils';
import BasicAppShell from './ItemAnimationsShell.svelte';

interface ItemAnimationsOptions {
	document: ItemPF2e;
}

export default class ItemAnimationsApp extends SvelteApplication {
	constructor(_options: ConstructorApplicationOptions & ItemAnimationsOptions) {
		// @ts-expect-error TJS-2-TS
		super(_options);
	}

	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.modifyItem', // Automatically localized from `lang/en.json`.
			classes: ['pf2e-g'],
			resizable: true,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: function () {
					// @ts-expect-error TJS-2-TS
					const doc = this.options.document;
					if (!doc) throw new ErrorMsg('No Document Provided in ItemAnimationsApp!');
					return {
						storeDocument: new TJSDocument(doc),
						document: doc,
					};
				} as () => ItemAnimationsOptions,
			},
		});
	}

	override _getHeaderButtons() {
		const buttons = super._getHeaderButtons();
		kofiButton(buttons);
		return buttons;
	}
}
