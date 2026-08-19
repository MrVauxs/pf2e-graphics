<script lang='ts'>
	import { backIn, backOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	interface Props {
		classes?: string;
		showButton?: boolean;
		title?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let {
		classes = '',
		showButton = true,
		title,
		children,
	}: Props = $props();

	let hidden = $state(true);
</script>

<div class='flex flex-col gap-2 p-1 border border-solid rounded-xs bg-slate-600/15 {classes}'>
	{#if title}
		<div class='flex flex-row flex-nowrap gap-0.5 items-center'>
			<div class='grow'>
				{@render title?.()}
			</div>
			{#if showButton}
				<button class='w-min' onclick={() => hidden = !hidden}>
					{#if hidden}
						<i in:slide={{ duration: 300, easing: backOut }} class='fa fa-chevron-down fa-fw mx-auto'></i>
					{:else}
						<i in:slide={{ duration: 300, easing: backOut }} class='fa fa-chevron-up fa-fw mx-auto'></i>
					{/if}
				</button>
			{/if}
		</div>

		{#if !hidden}
			<div
				class='flex flex-col gap-2'
				in:slide={{ duration: 300, easing: backOut }}
				out:slide={{ duration: 300, easing: backIn }}
			>
				{@render children?.()}
			</div>
		{/if}
	{:else}
		{@render children?.()}
	{/if}
</div>
