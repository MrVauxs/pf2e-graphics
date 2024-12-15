<script lang='ts'>
	import { i18n } from '../../utils';

	const volume = window.pf2eGraphics.storeSettings.getStore('volume');

	if (!volume) throw new Error('There is no volume setting!?');

	let element: HTMLElement;
	let toggle = false;

	$: if (toggle) game.tooltip.activate(element, { text: i18n('PLAYLIST.VOLUME.TOOLTIP', { volume: Math.round($volume * 100) }) });
</script>

<div class='pf2e-g'>
	<li class='sound flexrow bg-purple-400/25 rounded-sm' data-tooltip='pf2e-graphics.animationsVolume-tooltip'>
		<h4>{i18n('animations')}</h4>
		<i class='volume-icon fas fa-volume-down'></i>
		<input
			bind:this={element}
			bind:value={$volume}
			on:mouseenter={() => toggle = true}
			on:mouseout={() => toggle = false}
			on:blur={() => toggle = false}
			class='animations-volume-slider'
			name='animationsVolume'
			type='range' min='0' max='2' step='0.05'
			aria-label='Animations'
		/>
	</li>
</div>
