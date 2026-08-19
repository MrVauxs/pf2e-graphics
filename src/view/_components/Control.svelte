<script lang='ts'>
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		explain?: string;
		/** Replaces the default two-column container that wraps {@link children}. */
		inputDiv?: Snippet;
		children?: Snippet;
	}

	// The pre-Svelte-5 version of this component also exposed a `title` slot, but nothing ever
	// overrode it, and as a snippet prop it would collide with the `title` string prop above.
	let { title = 'Control Title', explain = 'Explainer', inputDiv, children }: Props = $props();
</script>

<label class='grid grid-cols-3 items-center'>
	<span class='flex items-center' data-tooltip={explain}>
		{title}
		<i class='fa fa-info-circle px-2 ml-auto'></i>
	</span>
	{#if inputDiv}
		{@render inputDiv()}
	{:else}
		<div class='flex align-middle items-center col-span-2'>
			{@render children?.()}
		</div>
	{/if}
</label>
