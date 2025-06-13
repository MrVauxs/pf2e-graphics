import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import { TJSPosition } from '@typhonjs-fvtt/runtime/svelte/store/position';
import { writable } from 'svelte/store';
import { initSettings } from './settings.ts';
import { loadAnimations } from './storage/index.ts';
import { registerTours } from './tours';

import { i18n } from './utils.ts';
import { initSidebar } from './view/AnimationSidebar/index.ts';
import './app.postcss';
import './assets/index.ts';
import './view/index.ts';

// V13 TJS SHIM
Object.defineProperty(SvelteApplication, 'defaultOptions', {
	get: () => {
		return foundry.utils.mergeObject(Application.defaultOptions, {
			// Copied directly from TRL except for minWidth and minHeight
			defaultCloseAnimation: true,
			draggable: true,
			focusAuto: true,
			focusKeep: false,
			focusSource: void 0,
			focusTrap: true,
			headerButtonNoClose: false,
			headerButtonNoLabel: false,
			headerIcon: void 0,
			headerNoTitleMinimized: false,
			minHeight: 50, // MIN_WINDOW_HEIGHT
			minWidth: 200, // MIN_WINDOW_WIDTH
			positionable: true,
			positionInitial: TJSPosition.Initial.browserCentered,
			positionOrtho: true,
			positionValidator: TJSPosition.Validators.transformWindow,
			sessionStorage: void 0,
			svelte: void 0,
			transformOrigin: 'top left',
		}, { inplace: false });
	},
});

Object.assign(window, {
	pf2eGraphics: {
		modules: writable(new Map()),
		history: writable([]),
		locations: writable([]),
	},
});

Hooks.once('setup', () => {
	initSettings();
	initSidebar();
});

Hooks.once('pf2e.systemReady', () => {
	import('./triggers/index.ts');
});

Hooks.once('ready', () => {
	warnJB2A();
	initSockets();
	loadAnimations();
	registerTours();
});

function warnJB2A() {
	const premium = game.modules.get('jb2a_patreon');
	const freemium = game.modules.get('JB2A_DnD5e');

	if (premium?.active || freemium?.active || window.pf2eGraphics.liveSettings.suppressWarnings) return;

	if (premium) {
		ui.notifications.warn(i18n('pf2e-graphics.settings.suppressWarnings.warnPremium'));
	} else if (freemium) {
		ui.notifications.warn(i18n('pf2e-graphics.settings.suppressWarnings.warnFremium'));
	} else {
		ui.notifications.error(i18n('pf2e-graphics.settings.suppressWarnings.warnNone'));
	}
}

function initSockets() {
	// Register the crosshair.ts sockets.
	window.pf2eGraphics.socket = socketlib.registerModule('pf2e-graphics')!;
	window.pf2eGraphics.socket.register('remoteLocation', (name: string, location: object) =>
		window.pf2eGraphics.locations.update((items) => {
			items.push({ name, location });
			return items;
		}));
}
