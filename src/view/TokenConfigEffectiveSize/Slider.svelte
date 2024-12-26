<script lang='ts'>
	import { i18n } from '../../utils';

	export let document: TokenConfigPF2e<TokenDocumentPF2e>;

	let scale: number = document.actor?.getFlag('pf2e-graphics', 'effectiveSize') ?? 1;
	let enabled = !!document.actor?.getFlag('pf2e-graphics', 'effectiveSize');

	$: {
		if (enabled) {
			document.actor?.setFlag('pf2e-graphics', 'effectiveSize', scale);
		} else if (document.actor?.getFlag('pf2e-graphics', 'effectiveSize')) {
			document.actor?.unsetFlag('pf2e-graphics', 'effectiveSize');
		}
	}
</script>

<div class='pf2e-g'>
	<div class='
		form-group effective-size
		bg-purple-400/25 rounded-sm
		-mx-1 px-1
	'>
		<input type='checkbox' bind:checked={enabled} />
		<label for='effective-size'>
			{i18n('pf2e-graphics.tokenConfig.effectiveSize.name')}
			<i class='fa fa-info-circle pl-0.5' data-tooltip={i18n('pf2e-graphics.tokenConfig.effectiveSize.tooltip')}></i>
		</label>
		<div class="form-group {enabled ? '' : 'disabled'}">
			<div class='form-fields'>
				<input
					disabled={!enabled}
					type='range'
					name='effective-size'
					min='0.25'
					max='5.0'
					bind:value={scale}
					step='0.05'
				/>
				<span class='range-value'>{scale}</span>
			</div>
		</div>
	</div>
</div>
