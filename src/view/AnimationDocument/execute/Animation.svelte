<script lang='ts'>
	import type { AnimationSetContentsItem } from 'schema/payload';

	interface Props {
		data: AnimationSetContentsItem<'animation'>;
		readonly: boolean;
	}

	let { data, readonly }: Props = $props();
</script>
{#if !data.execute}
	{#if !readonly}
		<p><em>Attempted to render a 'animation' execute section without an execute object present.</em></p>
	{/if}
{:else}
	<div class='space-y-2'>
		<label class='grid grid-cols-3 items-center'>
			<span class='flex items-center' data-tooltip='TODO: Explain'>
				Text Text
				<i class='fa fa-info-circle px-2 ml-auto'></i>
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
