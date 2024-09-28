import { ErrorMsg } from 'src/utils.ts';
import { writable } from 'svelte/store';
import { AnimCore } from './AnimCore.ts';
import './presets.ts';

Object.assign(window, {
	pf2eGraphics: { modules: {}, AnimCore, history: writable([]), locations: writable([]) },
	AnimCore,
});

Hooks.once('ready', async () => {
	for (const mod of game.modules) {
		if (!mod.active) continue;
		const animations: string | undefined = mod.flags?.['pf2e-graphics'] as unknown as string;
		if (!animations) continue;
		const path = animations.startsWith('modules/') ? animations : `modules/${mod.id}/${animations}`;

		try {
			const resp = await fetch(path);
			const json = await resp.json();
			window.pf2eGraphics.modules[mod.id] = json;
		} catch {
			// eslint-disable-next-line no-new
			new ErrorMsg(`Failed to load ${mod.id} animations! Does the file exist?`);
		}
	}

	// Register the crosshair.ts sockets.
	window.pf2eGraphics.socket = socketlib.registerModule('pf2e-graphics');
	window.pf2eGraphics.socket.register('remoteLocation', (name: string, location: object) => window.pf2eGraphics.locations.update((items) => { items.push({ name, location }); return items; }));
});

if (import.meta.hot) {
	import.meta.hot.on('updateAnims', (data) => {
		window.pf2eGraphics.modules['pf2e-graphics'] = JSON.parse(data);
		ui.notifications.info('Animations updated!');
	});
	import.meta.hot.on('updateValidationError', (data) => {
		const array = JSON.parse(data);
		ui.notifications.error(`${array.length} animation files failed validation! Check the console (F12) for details.`);
		console.error('Validation errors: ', array);
	});
	import.meta.hot.accept('./AnimationStorage.ts', (newModule) => {
		if (newModule) {
			window.pf2eGraphics.AnimCore = newModule?.AnimCore;
			ui.notifications.info('AnimCore updated!');
		}
	});
}
