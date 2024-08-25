<script lang='ts'>
	import { i18n } from 'src/utils';

	const volume = window.pf2eGraphics.storeSettings.getStore('volume');

	if (!volume) throw new Error('There is no volume setting!?');
</script>

<div class='pf2e-g'>
	<li class='sound flexrow bg-purple-400/25 rounded-sm' data-tooltip='pf2e-graphics.animationsVolume-tooltip'>
		<h4 class=''>{i18n('animationsVolume')}</h4>
		<i class='volume-icon fas fa-volume-down'></i>
		<input
			bind:value={$volume}
			class='animations-volume-slider'
			name='animationsVolume'
			type='range' min='0' max='2' step='0.05'
			aria-label='Animations'
		/>
	</li>
</div>
