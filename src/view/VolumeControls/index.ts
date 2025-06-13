import VolumeControls from './VolumeControls.svelte';

const renderPlaylistDirectory = Hooks.on('renderPlaylistDirectory', (document: any, html: HTMLElement) => {
	const playlistSounds = html.getElementsByClassName('plain')?.[0];

	if (playlistSounds) document.pf2eGraphics = new VolumeControls({ target: playlistSounds });
});

const closePlaylistDirectory = Hooks.on('closePlaylistDirectory', (document: any) => {
	if (document.pf2eGraphics) document.pf2eGraphics.$destroy();
});

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('renderPlaylistDirectory', renderPlaylistDirectory);
		Hooks.off('closePlaylistDirectory', closePlaylistDirectory);
	});
}
