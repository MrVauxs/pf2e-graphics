<svelte:options accessors={true} />

<script lang="ts">
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

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
			<div class="flex items-center -my-1.5">
				<label class="flex gap-2 mr-4 items-center whitespace-nowrap leading-6 min-w-16" for="source-id">
					<span>Source ID</span>
					<i class="fa-solid fa-info-circle ml-auto mr-2" data-tooltip="PF2E.Item.Rules.Hint.SourceId"
					></i>
				</label>
				<input class="w-full h-min" id="source-id" disabled={true} value={item.flags.core?.sourceId} />
			</div>
			<hr />
		{/if}
	</main>
</ApplicationShell>
