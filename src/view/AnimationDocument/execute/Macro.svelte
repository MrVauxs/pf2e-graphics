<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';

	export let data: AnimationSetItemPartial;
	export let readonly: boolean;
</script>
{#if !data.execute || data.execute?.type !== 'macro'}
	<p>This isn't the right component! Something went extremely wrong if you are seeing this!</p>
{:else}
	<div class='space-y-2'>
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				UUID
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					placeholder='Drag a macro or type in the UUID...'
					type='text'
					bind:value={data.execute.document}
					disabled={readonly}
					{readonly}
				/>
			</div>
		</label>
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				Execute for Everyone
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					type='checkbox'
					bind:value={data.execute.everyoneExecutes}
					disabled={readonly}
					{readonly}
				/>
			</div>
		</label>
	</div>
{/if}
