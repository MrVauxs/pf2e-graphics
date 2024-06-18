<svelte:options accessors={true} />

<script lang="ts">
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	import { AnimationsStorage } from "src/storage/storage";

	export let item: ItemPF2e | null = null;
	export let elementRoot: HTMLElement | undefined = undefined;

	// import { getContext } from "svelte";
	// const application = getContext("#external").application;
</script>

<ApplicationShell bind:elementRoot>
	<main>
		{#if item}
			<div class="flex gap-2">
				<img src={item.img} alt={item.name} class="w-12 h-12 aspect-square" />
				<h1 class="w-full mt-1">{item.name}</h1>
			</div>
			<hr />
			{item.flags.core?.sourceId}
			<br />
			{JSON.stringify(AnimationsStorage.get(item.flags.core?.sourceId))}
		{/if}
	</main>
</ApplicationShell>
