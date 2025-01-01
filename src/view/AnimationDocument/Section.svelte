<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';

	export let selection: number | string;
	export let section: AnimationSetItemPartial;
	export let index: string;
	export let deleteFn: (location: string) => void;

	function addContent() {
		if (!section.contents) section.contents = [];
		section.contents.push({});
		section = section;
	}
</script>

<section
	role='button'
	tabindex='-1'
	on:keypress|stopPropagation={() => selection = index}
	on:click|stopPropagation={() => selection = index}
	class:shadow-inner={selection === index}
	class='
		hover:bg-slate-600/20
		border-0 border-b border-solid [&_&]:border-l
		p-1 [&_&]:px-0 [&_&]:pl-1
		shadow-slate-600
	'>
	<div class='flex'>
		<span class='grow'>
			{#if section?.name}
				{section.name}
			{:else}
				Section {index}
			{/if}
		</span>
		<button on:click={addContent} class='size-min text-xs'>
			<i class='fa fa-plus m-0 p-0'></i>
		</button>
		<button on:click={() => deleteFn(index)} class='size-min text-xs'>
			<i class='fa fa-trash m-0 p-0'></i>
		</button>
	</div>
	{#if section?.contents}
		<div class='pl-2'>
			{#each section.contents as content, nextIndex}
				<svelte:self
					bind:selection={selection}
					section={content}
					index={`${index}.${nextIndex}`}
					{deleteFn}
				/>
			{/each}
		</div>
	{/if}
</section>
