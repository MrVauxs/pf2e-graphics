import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions';
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document';
import { ErrorMsg, kofiButton } from 'src/utils';
import BasicAppShell from './UserAnimationsShell.svelte';

interface UserAnimationsOptions {
	document: UserPF2e;
}

export default class UserAnimationsApp extends SvelteApplication {
	constructor(_options: ConstructorApplicationOptions & UserAnimationsOptions) {
		// @ts-expect-error TJS-2-TS
		super(_options);
	}

	static override get defaultOptions(): CombinedSvelteApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.modifyUser', // Automatically localized from `lang/en.json`.
			classes: ['pf2e-g'],
			resizable: true,
			width: 600,
			height: 900,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
				props: function () {
					// @ts-expect-error TJS-2-TS
					const doc = this.options.document;
					if (!doc) throw new ErrorMsg('No Document Provided in UserAnimationsApp!');
					return {
						storeDocument: new TJSDocument(doc),
						document: doc,
					};
				} as () => UserAnimationsOptions,
			},
		});
	}

	override _getHeaderButtons() {
		const buttons = super._getHeaderButtons();
		kofiButton(buttons);
		return buttons;
	}
}
