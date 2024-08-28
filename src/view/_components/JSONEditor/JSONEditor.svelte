<svelte:options accessors={true} />

<script lang='ts'>
	import { JSONEditor, Mode, type ValidationError, ValidationSeverity } from 'svelte-jsoneditor';
	import type { Unsubscriber, Writable } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { fromZodIssue } from 'zod-validation-error';
	import { validateAnimationData } from 'src/storage/animationsSchema';
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core';

	export let elementRoot: HTMLElement | undefined;
	export let store: Writable<object>;
	export let readOnly: boolean;
	export let stasis: Writable<boolean>;

	let editor: JSONEditor;
	let unsubscribe: Unsubscriber;
	let content = {
		json: $store,
	} as { json: object; text: string };

	function updateUpstream() {
		let payload;

		if (content.json) {
			payload = content.json;
		} else {
			try {
				const data = JSON.parse(content.text);
				payload = data;
			} catch {}
		}

		if (payload) {
			const newKeys = Object.keys(payload);
			const oldKeys = Object.keys($store);

			oldKeys
				.filter(oldKey => !newKeys.includes(oldKey))
				.forEach((removedKey) => {
					payload[removedKey] = null;
				});

			store.set(payload);
		}
	}

	$: updateUpstream();

	const validator = (json: unknown): ValidationError[] => {
		const result = validateAnimationData(json);
		if (result.success) return [];
		return result.error.issues.map(issue => ({
			path: issue.path.map(piece => piece.toString()),
			message: fromZodIssue(issue, { prefix: null, includePath: false }).toString(),
			severity: ValidationSeverity.error,
		}));
	};

	const mode = 'text' as Mode; // TS...

	onMount(() => {
		stasis.set(true);

		if (readOnly) {
			unsubscribe = store.subscribe((v) => {
				editor.set({ json: v });
			});
		}
	});

	onDestroy(() => {
		updateUpstream();
		stasis.set(false);
		if (readOnly) unsubscribe();
	});
</script>

<ApplicationShell bind:elementRoot>
	<main class='h-full w-full overflow-clip relative grow'>
		<JSONEditor bind:content {readOnly} {mode} bind:this={editor} {validator} />
	</main>
	{#if !readOnly}
		<footer class='grow-0'>
			<button class='m-0' on:click={updateUpstream}>
				<i class='fa fa-save'></i> Save
			</button>
		</footer>
	{/if}
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
		border-right: 1px solid var(--jse-menu-color, var(--jse-text-color-inverse, #fff)) !important;
	}
</style>
