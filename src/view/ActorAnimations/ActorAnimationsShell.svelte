<svelte:options accessors={true} />

<script lang='ts'>
	// import { i18n } from "src/utils";
	import { devMessage } from 'src/utils'
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core'
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document'

	export let elementRoot: HTMLElement | undefined
	export let actor: ActorPF2e | null = null
	if (!actor) {
		throw new Error('An actor is required to render the ItemAnimations application.')
	}

	// import { getContext } from "svelte";
	// const application = getContext("#external").application;

	const doc = new TJSDocument(actor)
	devMessage(actor, doc)
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden flex flex-col h-full'>test</main>
</ApplicationShell>
