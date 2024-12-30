import type { ArrayAnimationSet } from 'src/extensions';
import { type SvelteApp, SvelteApplication } from '#runtime/svelte/application';
import { ErrorMsg, kofiButton } from '../../utils';
import BasicAppShell from './AnimationDocument.svelte';

export default class AnimationDocumentApp extends SvelteApplication<BasicAppOptions> {
	constructor(options?: Partial<BasicAppOptions>) {
		super(options);
		if (!options?.animation) throw ErrorMsg.send('pf2e-graphics.document.error.noData');

		this.options.id = `pf2e-graphics-document-k-${game.pf2e.system.sluggify(options.animation.key)}-i-${options.animation.id}`;
	}

	static override get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			id: 'pf2e-graphics-document',
			title: 'pf2e-graphics.document.title',
			classes: ['pf2e-g'],
			resizable: true,
			width: 800,
			height: 600,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
			},
		});
	}

	override _getHeaderButtons() {
		const buttons = super._getHeaderButtons();
		kofiButton(buttons);
		return buttons;
	}

	static getActiveApp() {
		return Object.values(ui.windows).find((app) => {
			return (
				app instanceof this && app._state > Application.RENDER_STATES.CLOSED
			);
		});
	}

	static async show() {
		const existingApp = this.getActiveApp();
		if (existingApp) return existingApp.render(false, { focus: true });
		return new this().render(true, { focus: true });
	}
}

// Define the additional types outside the class
export type BasicAppExternal = SvelteApp.Context.External<AnimationDocumentApp>;

/** Extended options that you can define. */
export interface BasicAppOptions extends SvelteApp.Options {
	/** An example of defining additional options */
	animation: ArrayAnimationSet[number];
}
