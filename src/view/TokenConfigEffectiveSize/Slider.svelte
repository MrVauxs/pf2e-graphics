<script lang='ts'>
	import type { TokenConfigPF2e, TokenDocumentPF2e } from 'foundry-pf2e';
	import type { EffectiveSize } from '../../extensions';
	import { getDefaultSize, i18n } from '../../utils';

	export let document: TokenConfigPF2e<TokenDocumentPF2e>;

	const effectiveSize: EffectiveSize = {
		enabled: (document.actor?.getFlag('pf2e-graphics', 'effectiveSize') as EffectiveSize)?.enabled ?? false,
		size:
			(document.actor?.getFlag('pf2e-graphics', 'effectiveSize') as EffectiveSize)?.size ?? getDefaultSize(document.actor?.size),
	};

	$: {
		foundry.utils.debounce(
			() => document.actor?.setFlag('pf2e-graphics', 'effectiveSize', effectiveSize),
			1000,
		)();
	}
</script>

<div class='pf2e-g'>
	<div
		class='
			form-group effective-size
			bg-purple-400/25 rounded-sm
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
