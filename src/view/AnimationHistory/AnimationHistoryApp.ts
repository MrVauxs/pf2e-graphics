import { SvelteApp } from '#runtime/svelte/application';
import { trlComponent } from 'src/shims/trlComponent';
import { kofiButton } from '../../utils';
import BasicAppShell from './AnimationHistoryShell.svelte';

export default class AnimationHistoryApp extends SvelteApp {
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
				class: trlComponent(BasicAppShell),
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
			return app instanceof this && app._state > foundry.appv1.api.Application.RENDER_STATES.CLOSED;
		});
	}

	static async show() {
		const existingApp = this.getActiveApp();
		if (existingApp) return existingApp.render(false, { focus: true });
		return new this().render(true, { focus: true });
	}
}
