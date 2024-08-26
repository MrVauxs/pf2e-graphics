<svelte:options accessors={true} />
<script lang='ts'>
	import { i18n } from 'src/utils';
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core';

	export let elementRoot: HTMLElement | undefined;

	const history = window.pf2eGraphics.history;

	function clearHistory() {
		history.set([]);
	}
</script>

<ApplicationShell bind:elementRoot>
	<main class='flex flex-col gap-1 grow'>
		{#if $history.length}
			{#each $history as entry}
				<div class='
					flex p-1
					border border-solid border-gray-500 rounded-sm
					bg-gray-400/25
				'>
					<div>
						{entry.actor.name} - {entry.item?.name}
						({entry.animations.length > 1
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
	<footer class='grow-0'>
		<button type='button' on:click={clearHistory}>
			<i class='fa fa-trash'></i>
			Clear
		</button>
	</footer>
</ApplicationShell>
