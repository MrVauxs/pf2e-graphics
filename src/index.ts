import { writable } from 'svelte/store';
import { initSettings } from './settings.ts';
import { loadAnimations } from './storage/index.ts';
import { i18n } from './utils.ts';
import { initSidebar } from './view/AnimationSidebar/index.ts';

import './app.postcss';
import './assets/index.ts';
import './view/index.ts';

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
});

function warnJB2A() {
	const premium =	game.modules.get('jb2a_patreon');
	const fremium =	game.modules.get('JB2A_DnD5e');

	if (premium?.active || fremium?.active || window.pf2eGraphics.liveSettings.suppressWarnings) return;

	if (premium) {
		ui.notifications.warn(i18n('pf2e-graphics.settings.suppressWarnings.warnPremium'));
	} else if (fremium) {
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
