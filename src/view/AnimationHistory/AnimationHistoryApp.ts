import { SvelteApplication } from '#runtime/svelte/application';
import { kofiButton } from '../../utils';
import BasicAppShell from './AnimationHistoryShell.svelte';

export default class AnimationHistoryApp extends SvelteApplication {
	static override get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			title: 'pf2e-graphics.history.window.title',
			classes: ['pf2e-g'],
			resizable: true,
			width: 800,
			height: 400,
			left: 110,
			top: 70,
			id: 'pf2e-graphics-animationhistory',

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
