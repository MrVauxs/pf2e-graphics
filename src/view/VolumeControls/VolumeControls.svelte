<script lang='ts'>
	import type { MinimalWritable } from '@typhonjs-fvtt/runtime/svelte/store/util';
	import { ErrorMsg, i18n } from '../../utils';

	const volume = window.pf2eGraphics.storeSettings.getStore('volume') as MinimalWritable<number>;

	if (!volume) throw ErrorMsg.send('pf2e-graphics.sidebar.playlists.error.noVolume');

	let element: HTMLElement;
	let toggle = false;

	$: if (toggle) {
		game.tooltip.activate(element, {
			text: i18n('PLAYLIST.VOLUME.TOOLTIP', {
				volume: String(Math.round($volume * 100)),
			}),
		});
	}
</script>

<li
	class='flexrow bg-purple-400/25 rounded-sm'
	data-tooltip='pf2e-graphics.sidebar.playlists.volumeSlider.tooltip'
>
	<label for='animationsVolume' style:flex='1'>{i18n('pf2e-graphics.sidebar.playlists.volumeSlider.title')}</label>
	<i class='volume-icon fas fa-volume-down inert'></i>
	<input
		style:flex='2'
		bind:this={element}
		bind:value={$volume}
		on:mouseenter={() => (toggle = true)}
		on:mouseout={() => (toggle = false)}
		on:blur={() => (toggle = false)}
		class='globalAnimationsVolume'
		name='animationsVolume'
		type='range'
		min='0'
		max='2'
		step='0.05'
		aria-label='Animations'
	/>
</li>
