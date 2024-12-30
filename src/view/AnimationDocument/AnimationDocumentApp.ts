import type { AnimationSetDocument } from 'src/extensions';
import { type SvelteApp, SvelteApplication } from '#runtime/svelte/application';
import { ErrorMsg, i18n, kofiButton, log, warn } from '../../utils';
import BasicAppShell from './AnimationDocument.svelte';

export default class AnimationDocumentApp extends SvelteApplication<BasicAppOptions> {
	constructor(options?: Partial<BasicAppOptions>) {
		super(options);
		if (!options?.animation) throw ErrorMsg.send('pf2e-graphics.document.error.noData');

		this.options.title = i18n('pf2e-graphics.document.title', { name: options.animation.rollOption });

		this.options.id = `pf2e-graphics-document-${game.pf2e.system.sluggify(options.animation.rollOption)}`;

		if ('id' in options.animation) {
			this.options.id = `${this.options.id}-${options.animation.id}`;
		}

		if (this.options.animation.source === 'module') {
			this.options.readonly = true;
		}
	}

	static override get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			id: 'pf2e-graphics-document',
			title: 'pf2e-graphics.document.titleDefault',
			classes: ['pf2e-g'],
			resizable: true,
			width: 800,
			height: 600,
			readonly: false,

			svelte: {
				class: BasicAppShell,
				target: document.body,
				intro: true,
			},
		});
	}

	async save(_animation: AnimationSetDocument = this.options.animation) {
		switch (_animation.source) {
			case 'user': {
				break;
			}
			case 'world': {
				break;
			}
			default:
				log(`Edits have been ignored on read-only "${_animation.source}" type animation.`); // TODO: i18n
		}
	}

	override close(_options: { force?: boolean }): Promise<void> {
		super.close();
		const closing: Promise<void> = new Promise((resolve) => {
			try {
				resolve(this.save());
			} catch (err: any) {
				ErrorMsg.send(err); // TODO: i18n
			}
		});
		return closing;
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

	static async show(options: Partial<BasicAppOptions>) {
		const existingApp = this.getActiveApp();
		if (existingApp) return existingApp.render(false, { focus: true });
		return new this(options).render(true, { focus: true });
	}
}

// Define the additional types outside the class
export type BasicAppExternal = SvelteApp.Context.External<AnimationDocumentApp>;

/** Extended options that you can define. */
export interface BasicAppOptions extends SvelteApp.Options {
	/** An example of defining additional options */
	animation: AnimationSetDocument;
	readonly: boolean;
}
