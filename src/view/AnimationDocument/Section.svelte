<script lang='ts'>
	import type { AnimationSetContentsItem } from 'schema/payload';
	import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
	// Recursive self-reference; replaces Svelte 4's `<svelte:self>`.
	import Section from './Section.svelte';

	interface Props {
		selection: number | string;
		section: AnimationSetContentsItem;
		array: AnimationSetContentsItem[];
		globalIndex: string;
		localIndex: number;
		readonly: boolean;
		deleteFn: (location: string) => void;
	}

	let {
		selection = $bindable(),
		section = $bindable(),
		array = $bindable(),
		globalIndex,
		localIndex,
		readonly,
		deleteFn,
	}: Props = $props();

	function addContent() {
		if (!section.contents) section.contents = [];
		section.contents.push({});
		section = section;
	}

	function deleteSection(e: MouseEvent) {
		if (e.shiftKey) {
			deleteFn(globalIndex);
		} else {
			TJSDialog.confirm({
				modal: true,
				title: 'Confirm Deletion',
				content: 'Are you sure you want to delete this section?<p/><b>All data will be lost.</b>',
				onYes: () => { deleteFn(globalIndex); },
			});
		}
	}

	function move(fromIndex: number, toIndex: number) {
		const element = array[fromIndex];
		array.splice(fromIndex, 1);
		array.splice(toIndex, 0, element);
		array = array;
	}

	/**
	 * Wraps a handler so its event doesn't also reach the enclosing section (which would re-select it).
	 * Replaces Svelte 4's `on:click|stopPropagation` modifier, which Svelte 5 removed.
	 */
	function withoutBubbling<E extends Event>(fn: (event: E) => void) {
		return (event: E) => {
			event.stopPropagation();
			fn(event);
		};
	}
</script>

<section
	role='button'
	tabindex='-1'
	onkeypress={withoutBubbling(() => selection = globalIndex)}
	onclick={withoutBubbling(() => selection = globalIndex)}
	class:shadow-inner={selection === globalIndex}
	class='
		hover:bg-slate-600/15
		border-0 border-b border-solid [&_&]:border-l
		p-1 [&_&]:px-0 [&_&]:pl-1
		shadow-slate-600
	'>
	<div class='flex'>
		<span class='grow flex flex-col'>
			{#if section?.label}
				{section.label}
			{:else}
				Section {globalIndex}
			{/if}
			<span class='text-xs text-gray-500/75 capitalize'>Type: {section?.execute?.type ?? 'Empty'}</span>
		</span>
		{#if !readonly}
			<div class='flex flex-col'>
				<button onclick={withoutBubbling(addContent)} class='size-min text-xs mx-0.5 p-0 px-1'>
					<i class='fa fa-plus fa-fw m-0 p-0'></i>
				</button>
				<button onclick={withoutBubbling(deleteSection)} class='size-min text-xs mx-0.5 p-0 px-1'>
					<i class='fa fa-trash fa-fw m-0 p-0'></i>
				</button>
			</div>
			<div class='flex flex-col'>
				<button
					class:disabled={localIndex === 0}
					disabled={localIndex === 0}
					onclick={withoutBubbling(() => move(localIndex, localIndex - 1))}
					class='size-min text-xs mx-0.5 p-0 px-1'
				>
					<i class='fa fa-chevron-up fa-fw m-0 p-0'></i>
				</button>
				<button
					class:disabled={localIndex === array.length - 1}
					disabled={localIndex === array.length - 1}
					onclick={withoutBubbling(() => move(localIndex, localIndex + 1))}
					class='size-min text-xs mx-0.5 p-0 px-1'
				>
					<i class='fa fa-chevron-down fa-fw m-0 p-0'></i>
				</button>
			</div>
		{/if}
	</div>
	{#if section?.contents}
		<div class='pl-2'>
			{#each section.contents as content, nextIndex}
				<Section
					bind:selection={selection}
					bind:array={section.contents}
					section={content}
					globalIndex={`${globalIndex}.${nextIndex}`}
					localIndex={nextIndex}
					{deleteFn}
					{readonly}
				/>
			{/each}
		</div>
	{/if}
</section>
