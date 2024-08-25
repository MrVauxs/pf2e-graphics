<svelte:options accessors={true} />

<script lang='ts'>
	import { JSONEditor, Mode, type ValidationError, ValidationSeverity } from 'svelte-jsoneditor';
	import type { Writable } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { animationObject, rollOption, tokenImages } from 'src/storage/animationsSchema';
	import { type ZodIssue, fromZodIssue } from 'zod-validation-error';
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core';

	export let elementRoot: HTMLElement | undefined;
	export let store: Writable<object>;
	export let permission: boolean;
	export let stasis: Writable<boolean>;

	let content = {
		json: $store,
	} as { json: object; text: string };

	function updateUpstream() {
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

	$: updateUpstream();

	const formatValidationIssue = (issue: ZodIssue, initialPath: (string | number)[] = []): ValidationError => {
		const path = [...initialPath, ...issue.path] as string[]; // Can't be number[] since we're dealing with JSON, which only accepts string keys
		return {
			path,
			message: fromZodIssue(issue, { includePath: false, prefix: null }).toString(),
			severity: ValidationSeverity[ValidationSeverity.error],
		};
	};

	const validator = (json: unknown): ValidationError[] => {
		if (json === null) return [];
		if (typeof json !== 'object' || Array.isArray(json)) {
			return [
				{
					path: [''],
					message: 'JSON must represent an object.',
					severity: ValidationSeverity[ValidationSeverity.error],
				},
			];
		}
		const issues = [];
		for (const key in json) {
			if (key === '_tokenImages') {
				const result = tokenImages.safeParse(json);
				if (!result.success) {
					issues.push(...result.error.issues.map(issue => formatValidationIssue(issue)));
				}
			} else if (!rollOption.safeParse(key).success) {
				issues.push({
					path: [key],
					message: 'Must be a valid roll option.',
					severity: ValidationSeverity[ValidationSeverity.error],
				});
			} else {
				const value = (json as { [key: string]: unknown })[key];
				if (typeof value === 'string') {
					const result = rollOption.safeParse(value);
					if (!result.success) {
						issues.push(...result.error.issues.map(issue => formatValidationIssue(issue, [key])));
					}
				} else if (Array.isArray(value)) {
					for (let i = 0; i < value.length; i++) {
						const result = animationObject.safeParse(value[i]);
						if (!result.success) {
							issues.push(
								...result.error.issues.map(issue => formatValidationIssue(issue, [key, i])),
							);
						}
					}
				} else {
					issues.push({
						path: [key],
						message:
							'Animation data must be an array of objects, or a string referencing another roll option.',
						severity: ValidationSeverity[ValidationSeverity.error],
					});
				}
			}
		}
		return issues;
	};

	const mode = 'text' as Mode; // TS...

	onMount(() => {
		stasis.set(true);
	});

	onDestroy(() => {
		updateUpstream();
		stasis.set(false);
	});
</script>

<ApplicationShell bind:elementRoot>
	<main class='h-full w-full overflow-clip relative'>
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
