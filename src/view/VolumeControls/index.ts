import { mount, unmount } from 'svelte';
import VolumeControls from './VolumeControls.svelte';

// `PlaylistDirectory` is an ApplicationV2 as of Foundry v13, so this hook receives a bare
// `HTMLElement` rather than the jQuery object it used to pass.
const renderPlaylistDirectory = Hooks.on('renderPlaylistDirectory', (document: any, html: HTMLElement) => {
	const playlistSounds = html.getElementsByClassName('playlist-sounds')?.[0];

	if (playlistSounds) document.pf2eGraphics = mount(VolumeControls, { target: playlistSounds });
});

const closePlaylistDirectory = Hooks.on('closePlaylistDirectory', (document: any) => {
	if (document.pf2eGraphics) unmount(document.pf2eGraphics);
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
