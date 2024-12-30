<svelte:options accessors={true} />

<script lang='ts'>
	import type { BasicAppExternal } from './AnimationDocumentApp';
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import { getContext } from 'svelte';
	import { writable } from 'svelte/store';
	import JSONEditorApp from '../_components/JSONEditor/JSONEditor';

	export let elementRoot: HTMLElement;
	const { application } = getContext<BasicAppExternal>('#external');
	const { animation, readonly } = application.options;
</script>

<ApplicationShell bind:elementRoot>
	<div class='flex flex-col'>
		<main class='grow space-y-2'>
			<label>
				Name
				<input type='text' bind:value={animation.name} {readonly} disabled={readonly} />
			</label>
			<label>
				Roll Option
				<input type='text' bind:value={animation.rollOption} {readonly} disabled={readonly} />
			</label>
			<button on:click={() => new JSONEditorApp({ store: writable(animation) }).render(true)}>
				raw data
			</button>
		</main>
		<footer class='flex gap-1'>
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
