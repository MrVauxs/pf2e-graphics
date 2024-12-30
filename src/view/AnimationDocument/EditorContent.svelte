<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';
	import type { AnimationSetDocument } from 'src/extensions';
	import { log } from 'src/utils';
	import { getContext } from 'svelte';

	export let data: AnimationSetItemPartial;
	export let animation: AnimationSetDocument;

	log(animation);
	$: log(data);

	const { readonly } = getContext<{ readonly: boolean }>('graphics');

	let selection: keyof AnimationSetItemPartial = 'name';

	function addSection() {
		data.name = 'text';
	}
</script>

<div class='flex flex-col gap-2 h-full py-1'>
	{#if !readonly}
		<header class='flex items-center grow-0'>
			<button
				class='w-min text-nowrap h-8'
				on:click={addSection}
			>
				<i class='fa fa-plus pr-1'></i>Add
			</button>
			<select
				class='grow h-8'
				bind:value={selection}
			>
				<option value='name'>Name</option>
				<option value='triggers'>Triggers</option>
			</select>
		</header>
	{/if}
	<main class='p-1 grow space-y-1'>
		{#if 'name' in data}
			<label class='grid grid-cols-2 items-center'>
				<span>
					Name
					<i class='fa fa-info-circle pl-px align-middle' data-tooltip='TODO: Explain'></i>
				</span>
				<input type='text' bind:value={data.name} {readonly} disabled={readonly} />
			</label>
		{/if}
	</main>
</div>
