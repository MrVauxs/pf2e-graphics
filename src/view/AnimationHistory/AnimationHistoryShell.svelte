<svelte:options accessors={true} />
<script lang='ts'>
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import { afterUpdate } from 'svelte';
	import { writable } from 'svelte/store';
	import { i18n } from '../../utils';
	import JSONEditorApp from '../_components/JSONEditor/JSONEditor';

	export let elementRoot: HTMLElement;

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
			permission: false,
			validate: false,
		}).render(true, {
			focus: true,
		});
	}
</script>

<ApplicationShell bind:elementRoot>
	<main
		class='
			flex flex-col gap-1 grow
			overflow-y-scroll
			-mr-2
		'
		style:content-visibility='auto'
		bind:this={element}
	>
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
					<header class='text-nowrap truncate'>
						{entry.trigger} | {entry.actor.name} | {entry.item?.name ? entry.item?.name : '???'}
					</header>
					<div class='ml-auto text-nowrap'>
						<i
							data-tooltip={entry.animations.length > 1 || !entry.animations.length
								? i18n('pf2e-graphics.historyMenu.animations', { count: entry.animations.length })
								: i18n('pf2e-graphics.historyMenu.animation')}
							class='fa {entry.animations.length ? 'fa-check' : 'fa-xmark'}'></i>
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
