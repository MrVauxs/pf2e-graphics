import { error, i18n, info } from '../utils.ts';
import { AnimCore } from './AnimCore.ts';

export async function loadAnimations() {
	for (const mod of game.modules) {
		if (!mod.active) continue;

		const moduleFlags = mod.flags['pf2e-graphics'];

		if (!moduleFlags) continue;
		if (typeof moduleFlags !== 'object' || !('path' in moduleFlags) || typeof moduleFlags.path !== 'string') {
			error(
				'pf2e-graphics.load.error.badModuleFlags',
				{ title: mod.title, id: mod.id },
				{ permanent: true },
			);
			continue;
		}

		const path = moduleFlags.path.startsWith('modules/')
			? moduleFlags.path
			: `modules/${mod.id}/${moduleFlags.path.replace(/^\.?[/\\]?/, '')}`;

		try {
			const resp = await fetch(path);
			// HTML status code 200–299 = "OK :)"
			if (String(resp.status)[0] !== '2')
				throw new Error(i18n('pf2e-graphics.load.error.cantAccessFile', { path }));
			const json = await resp.json();
			window.pf2eGraphics.modules.update(map => map.set(mod.id, json));
		} catch (err) {
			error(
				'pf2e-graphics.load.error.badModuleAnimations',
				{ title: mod.title, id: mod.id },
				{ permanent: true, cause: err },
			);
		}
	}

	window.pf2eGraphics.AnimCore = new AnimCore();
};

if (import.meta.hot) {
	import.meta.hot.on('updateAnims', (data) => {
		info('pf2e-graphics.load.notify.animationSetsUpdated');
		window.pf2eGraphics.modules.update(map => map.set('pf2e-graphics', JSON.parse(data)));
	});
	import.meta.hot.on('updateValidationError', (data) => {
		const array = JSON.parse(data);
		error(
			'pf2e-graphics.load.error.schemaValidationFailed',
			{ number: array.length },
			{ data: array },
		);
	});
}
