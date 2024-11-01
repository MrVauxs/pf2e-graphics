/* eslint-disable no-console */
if (import.meta.hot) {
	const updateMacro = Hooks.on('updateMacro', (macro: Macro) => {
		if (macro.compendium?.metadata.packageName !== 'pf2e-graphics') return;

		const json = macro.toJSON();
		// @ts-expect-error Adding a new property, is all.
		json._key = `!${macro.compendium?.metadata.name}!${json._id}`;

		import.meta.hot?.send(
			'foundryvtt-compendium-sync:update',
			{ json, path: macro.compendium.metadata.path },
		);
	});

	import.meta.hot.on(
		'foundryvtt-compendium-sync:update:response',
		({ data: { json } }) => {
			console.log(`Received and saved ${json.name} (${json._id})`);
		},
	);

	import.meta.hot.on(
		'foundryvtt-compendium-sync:update:error',
		(msg) => {
			console.error(msg.data.err);
		},
	);

	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('updateMacro', updateMacro);
	});
}
