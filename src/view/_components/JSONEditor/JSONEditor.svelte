<svelte:options accessors={true} />

<script lang='ts'>
	import { JSONEditor, Mode } from 'svelte-jsoneditor';
	import type { Writable } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core';

	export let elementRoot: HTMLElement | undefined;
	export let store: Writable<object>;
	export let permission: boolean;
	export let stasis: Writable<boolean>;

	let content = {
		json: $store,
	} as { json: object; text: string };

	$: {
		let payload;

		if (content.json) {
			payload = (content.json);
		} else {
			try {
				const data = JSON.parse(content.text);
				payload = (data);
			} catch {}
		}

		if (payload) {
			const newKeys = Object.keys(payload);
			const oldKeys = Object.keys($store);

			oldKeys.filter(oldKey => !newKeys.includes(oldKey)).forEach((removedKey) => {
				payload[removedKey] = null;
			});

			store.set(payload);
		};
	}

	const mode = 'text' as Mode; // TS...

	onMount(() => {
		stasis.set(true);
	});

	onDestroy(() => {
		stasis.set(false);
	});
</script>

<ApplicationShell bind:elementRoot>
	<main class='h-full w-full overflow-clip'>
		<JSONEditor bind:content readOnly={!permission} {mode} mainMenuBar={permission} />
	</main>
</ApplicationShell>

<style style='postcss'>
	main {
		& button {
			width: unset;
			margin: unset;
			border-radius: unset;
			line-height: unset;
		}
	}

	:global(button.jse-last) {
		display: none !important;
	}

	:global(.jse-button.jse-group-button:not(.jse-last)) {
		border-right: 1px solid var(--jse-menu-color, var(--jse-text-color-inverse, #fff)) !important
	}
</style>
