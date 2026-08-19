<script lang='ts'>
	import type { MinimalWritable } from '@typhonjs-fvtt/runtime/svelte/store/util';
	import { ErrorMsg, i18n } from '../../utils';

	const volume = window.pf2eGraphics.storeSettings.getStore('volume') as MinimalWritable<number>;

	if (!volume) throw ErrorMsg.send('pf2e-graphics.sidebar.playlists.error.noVolume');

	let element: HTMLElement | undefined = $state();
	let toggle = $state(false);

	$effect(() => {
		if (!toggle || !element) return;
		game.tooltip.activate(element, {
			text: i18n('PLAYLIST.VOLUME.TOOLTIP', {
				volume: String(Math.round($volume * 100)),
			}),
		});
	});
</script>

<div class='pf2e-g'>
	<li
		id='pf2e-graphics-volume-slider'
		class='sound flexrow bg-purple-400/25 rounded-xs'
		data-tooltip='pf2e-graphics.sidebar.playlists.volumeSlider.tooltip'
	>
		<h4>{i18n('pf2e-graphics.sidebar.playlists.volumeSlider.title')}</h4>
		<i class='volume-icon fas fa-volume-down'></i>
		<input
			bind:this={element}
			bind:value={$volume}
			onmouseenter={() => (toggle = true)}
			onmouseout={() => (toggle = false)}
			onblur={() => (toggle = false)}
			class='animations-volume-slider'
			name='animationsVolume'
			type='range'
			min='0'
			max='2'
			step='0.05'
			aria-label='Animations'
		/>
	</li>
</div>
