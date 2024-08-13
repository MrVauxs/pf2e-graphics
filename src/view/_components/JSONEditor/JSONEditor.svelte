<svelte:options accessors={true} />

<script lang='ts'>
	import type { JSONData } from 'src/storage/AnimCore'
	import type { Readable, Writable } from 'svelte/store'
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core'

	export let elementRoot: HTMLElement | undefined
	export let store: Writable<Exclude<JSONData[string], string>> | Readable<Exclude<JSONData[string], string>>
	export let key: string
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden flex flex-col h-full'>
		<textarea class='h-full resize-none' disabled>{JSON.stringify({ [key]: $store }, null, '  ')}</textarea>
	</main>
</ApplicationShell>
