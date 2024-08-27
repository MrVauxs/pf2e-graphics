<svelte:options accessors={true} />
<script lang='ts'>
	import { i18n } from 'src/utils';
	import { afterUpdate } from 'svelte';
	import { writable } from 'svelte/store';
	import JSONEditorApp from '../_components/JSONEditor/JSONEditor';
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core';

	export let elementRoot: HTMLElement | undefined;

	const history = window.pf2eGraphics.history;

	function clearHistory() {
		history.set([]);
	}

	let element: HTMLElement;
	const scrollToBottom = async (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	afterUpdate(() => {
		if ($history) scrollToBottom(element);
	});

	function openEditor(entry: object) {
		new JSONEditorApp({
			store: writable(entry),
			stasis: writable(true),
			permission: false,
		}).render(true, {
			focus: true,
		});
	}
</script>

<ApplicationShell bind:elementRoot>
	<main class='flex flex-col gap-1 grow overflow-y-scroll -mr-2' bind:this={element}>
		{#if $history.length}
			{#each $history as entry}
				<div
					class='
						flex p-1
						border border-solid border-gray-500 rounded-sm
						bg-gray-400/25
						hover:shadow-inner
						hover:bg-gray-500/25
					'
					role='button'
					tabindex='0'
					on:click={() => openEditor(entry)}
					on:keydown={() => openEditor(entry)}
					data-tooltip='pf2e-graphics.historyMenu.open'
				>
					<div>
						{entry.actor.name} - {entry.item?.name}
						({entry.animations.length > 1 || !entry.animations.length
							? i18n('pf2e-graphics.historyMenu.animations', { count: entry.animations.length })
							: i18n('pf2e-graphics.historyMenu.animation')})
					</div>
					<div class='ml-auto'>
						{window.foundry.utils.timeSince(new Date(entry.timestamp))}
					</div>
				</div>
			{/each}
		{:else}
			<i class='text-gray-500 opacity-50 text-center my-auto'>No animations.</i>
		{/if}
	</main>
	<footer class='grow-0 pt-2'>
		<button type='button' on:click={clearHistory}>
			<i class='fa fa-trash'></i>
			Clear
		</button>
	</footer>
</ApplicationShell>
