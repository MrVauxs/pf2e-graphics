import type { AnimationSetDocument, UserAnimationSetDocument, WorldAnimationSetDocument } from 'schema';
import type { Mode } from 'svelte-jsoneditor';
import type { Writable } from 'svelte/store';
import { SvelteApp } from '#runtime/svelte/application';
import { trlComponent } from 'src/shims/trlComponent';
import { clearEmpties, ErrorMsg, i18n, kofiButton, log } from '../../utils';
import BasicAppShell from './AnimationDocument.svelte';

export default class AnimationDocumentApp extends SvelteApp<BasicAppOptions> {
	constructor(options?: Partial<BasicAppOptions>) {
		super(options);
		if (!options?.animation) throw ErrorMsg.send('pf2e-graphics.document.error.noData');

		this.options.id = `pf2e-graphics-document-${game.pf2e.system.sluggify(options.animation.rollOption)}`;
		if ('id' in options.animation) {
			this.options.id = `${this.options.id}-${options.animation.id}`;
		}

		if (
			this.options.animation.source === 'module'
			|| (this.options.animation.source === 'user' && this.options.animation.user !== game.userId)
		) {
			this.options.readonly = true;
			this.options.title = `${i18n('pf2e-graphics.document.title')} (Read-only)`;
		}

		if (this.options.readonly) {
			this.options.animation = foundry.utils.deepClone(this.options.animation);
		}

		log('AnimationDocumentApp', this);
	}

	static override get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			id: 'pf2e-graphics-document',
			title: 'pf2e-graphics.document.title',
			classes: ['pf2e-g', 'no-window-padding'],
			resizable: true,
			width: 800,
			height: 600,

			readonly: false,
			tab: 'main',
			jsonMode: 'text',

			svelte: {
				class: trlComponent(BasicAppShell),
				target: document.body,
				intro: true,
			},
		});
	}

	/**
	 * Validates the data and returns the object if it is valid with success: true.
	 * Otherwise, we get success: false with an error getter.
	 */
	static async validate(_animation: AnimationSetDocument) {
		const { animationSets } = await import('schema/index');
		return animationSets.safeParse(_animation.animationSets);
	}

	async validate(_animation: AnimationSetDocument = this.options.animation) {
		return AnimationDocumentApp.validate(_animation);
	}

	async save(document: AnimationSetDocument = this.options.animation) {
		document = clearEmpties(document);
		log('Saving document.', document);
		if (document.source === 'user') {
			const user = game.users.get(document.user);
			if (!user) throw ErrorMsg.send('Can\'t find the assigned animations user?!'); // TODO: i18n

			const userAnimations = user.getFlag('pf2e-graphics', 'animations') as UserAnimationSetDocument[];
			userAnimations.findSplice(el => el.id === document.id, document);
			await user.setFlag('pf2e-graphics', 'animations', userAnimations);
		} else if (document.source === 'world') {
			const store = window.pf2eGraphics.storeSettings.getWritableStore('globalAnimations') as Writable<
				WorldAnimationSetDocument[]
			>;
			store.update((val) => {
				val.findSplice(x => x.id === document.id);
				val.push(document);
				return val;
			});
		} else {
			log(`Edits have been ignored on read-only "${document.source}" type animation.`); // TODO: i18n
		}
	}

	override close(_options?: { force?: boolean; dontSave: true }): Promise<void> {
		super.close(_options);
		const closing: Promise<void> = new Promise((resolve) => {
			try {
				resolve(_options?.dontSave ? void 0 : this.save());
			} catch {}
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
			return app instanceof this && app.id === '' && app._state > foundry.appv1.api.Application.RENDER_STATES.CLOSED;
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
	tab?: 'main' | 'json';
	jsonMode?: Mode;
}
