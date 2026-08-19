<script lang='ts'>
	import type { ActorPF2e, EnrichmentOptionsPF2e } from 'foundry-pf2e';
	import type { Payload } from 'schema';
	import type { ExecutionContext } from 'src/payloads';
	import { onMount, untrack } from 'svelte';
	import { tweened } from 'svelte/motion';

	interface Props {
		payload: Extract<Payload, { type: 'crosshair' }>;
		context: ExecutionContext;
		close: () => void;
	}

	let { payload, context, close }: Props = $props();

	const seconds = 60_000; // 1 minute

	const tween = tweened(seconds, { duration: seconds });

	onMount(() => tween.set(0));

	$effect(() => {
		if ($tween > 0) return;
		const timeout = setTimeout(() => close(), 750);
		return () => clearTimeout(timeout);
	});

	// Read once: the execution context is fixed for the lifetime of a single crosshair prompt.
	const rollData: EnrichmentOptionsPF2e['rollData'] = untrack(() => ({
		actor: context.sources[0].actor as ActorPF2e,
		item: context.item,
	}));
</script>

<div class='pf2e-g' style:position='relative'>
	<main class='text-center p-1'>
		{#if payload.prompt?.text}
			{#await game.pf2e.TextEditor.enrichHTML(payload.prompt.text, { rollData }) then text}
				{@html text}
			{:catch error}
				{error}
			{/await}
		{:else}
			Pick a location for the <code>{payload.name}</code> animation!
		{/if}
		<p class='text-xs'>The selection times out after {seconds / 1000} seconds.</p>
	</main>
	<div class='w-full bg-gray-200 rounded-full dark:bg-gray-700'>
		<div
			class='
				{$tween > 0 ? 'bg-blue-800' : ''} rounded-full
					text-[0.6rem] font-medium text-blue-100 text-center leading-none
					p-0.5
				{$tween > 0 ? '' : 'transition-all duration-500'}
			'
			style:width={`${$tween > 0 ? ($tween / seconds * 100) : 100}%`}
		>
			{($tween / 1000).toFixed(1)}s
		</div>
	</div>
</div>
