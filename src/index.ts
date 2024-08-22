import './settings.ts';
import './app.postcss';
import './view';
import './storage';
import { database } from './assets/soundDb';
import { i18n } from './utils.ts';

Hooks.once('pf2e.systemReady', () => {
	import('./triggers');
});

Hooks.once('sequencerReady', () => {
	Sequencer.Database.registerEntries('pf2e-graphics', database);
});

Hooks.once('ready', () => {
	const premium =	game.modules.get('jb2a_patreon');
	const fremium =	game.modules.get('JB2A_D&D5e');

	if (premium?.active || fremium?.active || window.pf2eGraphics.liveSettings.suppressWarnings) return;

	if (premium) {
		ui.notifications.warn(i18n('settings.suppressWarnings.warnPremium'));
	} else if (fremium) {
		ui.notifications.warn(i18n('settings.suppressWarnings.warnFremium'));
	} else {
		ui.notifications.error(i18n('settings.suppressWarnings.warnNone'));
	}
});
