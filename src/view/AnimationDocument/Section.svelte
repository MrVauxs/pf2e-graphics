<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';

	export let selection: number | string;
	export let section: AnimationSetItemPartial;
	export let index: number;
</script>

<section
	role='button'
	tabindex='-1'
	on:keypress|stopPropagation={() => selection = index}
	on:click|stopPropagation={() => selection = index}
	class:shadow-inner={selection === index}
	class='
		hover:bg-slate-600/20
		border-0 border-b border-solid
		p-1
		shadow-slate-600
	'>
	<span>
		{#if section.name}
			{section.name}
		{:else}
			Section {index}
		{/if}
	</span>
	{#if section.contents}
		<div class='px-2'>
			{#each section.contents as content, nextIndex}
				<svelte:self
					bind:selection={selection}
					section={content}
					index={`${index}.${nextIndex}`}
				/>
			{/each}
		</div>
	{/if}
</section>
