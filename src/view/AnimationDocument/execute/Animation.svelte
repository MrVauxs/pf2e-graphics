<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';

	export let data: AnimationSetItemPartial;
	export let readonly: boolean;
</script>
{#if !data.execute || data.execute?.type !== 'animation'}
	<p>This isn't the right component! Something went extremely wrong if you are seeing this!</p>
{:else}
	<div class='space-y-2'>
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				Text Text
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					disabled={readonly}
					type='text'
				/>
			</div>
		</label>
	</div>
{/if}
