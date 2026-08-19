<script lang='ts'>
	import type { AnimationSetContentsItem } from 'schema/payload';
	import { safeJSONParse } from '../../../utils';

	interface Props {
		data: AnimationSetContentsItem<'macro'>;
		readonly: boolean;
	}

	let { data = $bindable(), readonly }: Props = $props();

	let optionsInput: string = $state(data?.execute?.options ? JSON.stringify(data?.execute?.options, null, '\t') : '');

	function tryAssignOptions(optionsInput: string) {
		if (!optionsInput) {
			delete data.execute!.options;
		} else {
			const json = safeJSONParse(optionsInput);
			if (json.success && json.data && typeof json.data === 'object') data.execute!.options = json.data;
		}
	}

	$effect(() => {
		tryAssignOptions(optionsInput);
	});

	function getExpectedRowCount(): number {
		if (data.execute?.options) return Object.keys(data.execute.options).length + 2;
		return 3;
	}
</script>

{#if !data.execute}
	{#if !readonly}
		<p><em>Attempted to render a 'macro' execute section without an execute object present.</em></p>
	{/if}
{:else}
	<div class='space-y-2'>
		<label class='grid grid-cols-3 items-center'>
			<span class='flex items-center' data-tooltip='TODO: Explain'>
				UUID
				<i class='fa fa-info-circle px-2 ml-auto'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					type='text'
					placeholder='Drag a macro or type in the UUID...'
					bind:value={data.execute.document}
					disabled={readonly}
					{readonly}
				/>
			</div>
		</label>
		<label class='grid grid-cols-3 items-center'>
			<span class='flex items-center' data-tooltip='TODO: Explain'>
				Execute for Everyone
				<i class='fa fa-info-circle px-2 ml-auto'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input type='checkbox' bind:value={data.execute.everyoneExecutes} disabled={readonly} {readonly} />
			</div>
		</label>
		<label class='grid grid-cols-3 items-center'>
			<span class='flex items-center' data-tooltip='TODO: Explain'>
				Options
				<i class='fa fa-info-circle px-2 ml-auto'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<textarea
					rows={getExpectedRowCount()}
					placeholder='(Advanced) Enter JSON'
					bind:value={optionsInput}
					disabled={readonly}
					{readonly}
				></textarea>
			</div>
		</label>
	</div>
{/if}
