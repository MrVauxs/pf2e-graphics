<script lang='ts'>
	import type { ActorPF2e, TokenConfigPF2e } from 'foundry-pf2e';
	import type { EffectiveSize } from '../../extensions';
	import { untrack } from 'svelte';
	import { getDefaultSize, i18n } from '../../utils';

	const { document }: { document: TokenConfigPF2e } = $props();

	// Read once: the sheet's document doesn't swap out underneath this component.
	const actor = untrack(() => document.actor) as ActorPF2e | null;
	const existingFlag = actor?.getFlag('pf2e-graphics', 'effectiveSize') as EffectiveSize;
	const initialEnabled: boolean = existingFlag?.enabled ?? false;
	const initialSize: number = existingFlag?.size ?? getDefaultSize(actor?.size);

	const effectiveSize: EffectiveSize = $state({
		enabled: initialEnabled,
		size: initialSize,
	});

	$effect(() => {
		void effectiveSize.enabled;
		void effectiveSize.size;
		foundry.utils.debounce(
			() => actor?.setFlag('pf2e-graphics', 'effectiveSize', effectiveSize),
			1000,
		)();
	});
</script>

<div class='pf2e-g'>
	<div
		class='
			form-group effective-size
			bg-purple-400/25 rounded-xs
			-mx-1 px-1
		'
	>
		<input type='checkbox' bind:checked={effectiveSize.enabled} />
		<label for='effective-size'>
			{i18n('pf2e-graphics.tokenConfig.effectiveSize.name')}
			<i
				class='fa fa-info-circle pl-0.5'
				data-tooltip={i18n('pf2e-graphics.tokenConfig.effectiveSize.tooltip')}
			></i>
		</label>
		<div class="form-group {effectiveSize.enabled ? '' : 'disabled'}">
			<div class='form-fields'>
				<input
					disabled={!effectiveSize.enabled}
					type='range'
					name='effective-size'
					min='0.25'
					max='5.0'
					bind:value={effectiveSize.size}
					step='0.05'
				/>
				<span class='range-value'>{effectiveSize.size}</span>
			</div>
		</div>
	</div>
</div>
