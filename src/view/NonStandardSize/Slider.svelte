<script lang="ts">
	export let document: TokenConfigPF2e<TokenDocumentPF2e>;

	let scale: number = document.actor?.getFlag('pf2e-graphics', 'nonStandard') ?? 1
	let enabled = !!document.actor?.getFlag('pf2e-graphics', 'nonStandard');

	$: {
		if (enabled) {
			document.actor?.setFlag('pf2e-graphics', 'nonStandard', scale)
		} else {
			document.actor?.unsetFlag('pf2e-graphics', 'nonStandard')
		}
	}
</script>

<div class="pf2e-g">
	<div class="
		form-group animation-scale
		bg-purple-400/25 rounded-sm
		-mx-1 px-1
	">
		<input type="checkbox" bind:checked={enabled} />
		<div class="form-group {enabled ? '' : 'disabled'}">
			<label for="animation-scale">
				Animation Scale
				<i class="fa fa-info-circle pl-0.5" data-tooltip="TODO: Explanation"></i>
			</label>
			<div class="form-fields">
				<input
					disabled={!enabled}
					type="range"
					name="animation-scale"
					min="0.2"
					max="3.0"
					bind:value={scale}
					step="0.05"
				>
				<span class="range-value">{scale}</span>
			</div>
		</div>
	</div>
</div>