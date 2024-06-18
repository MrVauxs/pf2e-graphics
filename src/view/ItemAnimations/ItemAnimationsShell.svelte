<svelte:options accessors={true} />

<script lang="ts">
	// @ts-ignore - TJS2TS
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	import { getContext } from "svelte";

	export let item: ItemPF2e | null = null;
	export let elementRoot: HTMLElement | undefined = undefined;

	const application = getContext("#external").application;
</script>

<ApplicationShell bind:elementRoot>
	<main>
		{#if item}
			<img src={item.img} alt={item.name} />
			<h1>{item.name}</h1>
		{/if}
	</main>
</ApplicationShell>

<style lang="scss">
	main {
		text-align: center;
		display: flex;
		flex-direction: column;
	}
</style>
