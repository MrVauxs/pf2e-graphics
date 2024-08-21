<svelte:options accessors={true} />

<script lang='ts'>
	import { JSONEditor, Mode, type ValidationError, ValidationSeverity } from 'svelte-jsoneditor';
	import type { Writable } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { animations, tokenImages } from 'src/storage/animationsSchema';
	import { fromZodIssue } from 'zod-validation-error';
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
		if (content.json) {
			store.set(content.json);
		} else {
			try {
				const data = JSON.parse(content.text);
				store.set(data);
			} catch {}
		}
	}

	const validator = (json: unknown): ValidationError[] => {
		const schema = (json as any)._tokenImages ? tokenImages : animations;
		const result = schema.safeParse(json);
		if (result.success) return [];
		return result.error.issues.map(issue => ({
			path: issue.path as string[], // Can't be number[] since we're dealing with JSON, which only accepts string keys
			message: fromZodIssue(issue, {
				includePath: false,
				prefix: null,
			}).toString(),
			severity: ValidationSeverity[ValidationSeverity.error],
		}));
	};

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
		<JSONEditor bind:content readOnly={!permission} {mode} mainMenuBar={permission} {validator} />
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
		border-right: 1px solid var(--jse-menu-color, var(--jse-text-color-inverse, #fff)) !important;
	}
</style>
