<svelte:options accessors={true} />

<script lang='ts'>
	import type { BasicAppExternal } from './AnimationDocumentApp';
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import { getContext } from 'svelte';

	export let elementRoot: HTMLElement;
	const { application: { options, save } } = getContext<BasicAppExternal>('#external');
	const { animation, readonly } = options;

</script>

<ApplicationShell bind:elementRoot>
	<div class='flex flex-col'>
		<main class='grow'>
			<label>
				Name
				<input type='text' bind:value={animation.name} />
			</label>
			<label>
				Roll Option
				<input type='text' bind:value={animation.rollOption} />
			</label>
		</main>
		<footer>
			{#if !readonly}
				<button on:click={() => save(animation)}>Save</button>
			{/if}
		</footer>
	</div>
</ApplicationShell>
