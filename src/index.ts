// Settings First
import { i18n } from './utils.ts';
import './app.postcss';
import './settings.ts';
import './view/index.ts';
import './storage/index.ts';
import './assets/index.ts';

Hooks.once('pf2e.systemReady', () => {
	import('./triggers/index.ts');
});

Hooks.once('ready', () => {
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
});
