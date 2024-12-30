<svelte:options accessors={true} />

<script lang='ts'>
	import type { BasicAppExternal } from './AnimationDocumentApp';
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import { getContext } from 'svelte';
	import { JSONEditor } from 'svelte-jsoneditor';

	export let elementRoot: HTMLElement;
	const { application } = getContext<BasicAppExternal>('#external');
	const { animation, readonly } = application.options;
</script>

<ApplicationShell bind:elementRoot>
	<div class='flex flex-col overflow-hidden p-3'>
		<header class='grow-0'>
			<nav class='flex'>
				<button
					on:click={() => application.options.tab = 'main'}
					class:underline={application.options.tab === 'main'}
					class='
						p-2 -my-2 leading-4
						bg-transparent border-0
						underline-offset-2 decoration-red-700
						hover:shadow-none
						hover:underline hover:decoration-red-800 hover:decoration-dashed
					'>
					Main
				</button>
				<button
					on:click={() => application.options.tab = 'json'}
					class:underline={application.options.tab === 'json'}
					class='
						p-2 -my-2 leading-4
						bg-transparent border-0
						underline-offset-2 decoration-red-700
						hover:shadow-none
						hover:underline hover:decoration-red-800 hover:decoration-dashed
					'>
					Raw Data
				</button>
			</nav>
			<hr />
		</header>
		<main class='grow overflow-y-auto min-h-0'>
			{#if application.options.tab === 'main'}
				<div class='flex flex-col space-y-2'>
					<label>
						<span>Name</span>
						<input type='text' bind:value={animation.name} {readonly} disabled={readonly} />
					</label>
					<label>
						<span>Roll Option</span>
						<input type='text' bind:value={animation.rollOption} {readonly} disabled={readonly} />
					</label>
				</div>
			{:else if application.options.tab === 'json'}
				<div class='h-full'>
					<JSONEditor
						content={{ json: animation }}
						readOnly={true}
						mode={application.options.jsonMode}
						navigationBar={false}
						statusBar={false}
						indentation='	'
						tabSize={2}
					/>
				</div>
			{/if}
		</main>
		<footer class='flex gap-1 grow-0 pt-2'>
			{#if !readonly}
				<button on:click={() => application.save(animation)}>
					Save
				</button>
				<button on:click={() => {
					application.save(animation);
					application.close();
				}}>
					Save and Close
				</button>
			{/if}
		</footer>
	</div>
</ApplicationShell>

<style>
	:global(button.jse-last) {
		display: none !important;
	}

	:global(.jse-button.jse-group-button:not(.jse-last)) {
		border-right: 1px solid var(--jse-menu-color, var(--jse-text-color-inverse, #fff)) !important;
	}
</style>
