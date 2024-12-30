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
	{animation.rollOption}
	{#if !readonly}
		<button on:click={() => save}>Save</button>
	{/if}
</ApplicationShell>
