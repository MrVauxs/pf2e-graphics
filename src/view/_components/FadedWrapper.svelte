<script lang='ts'>
	import { backIn, backOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	export let classes = '';
	export let showButton = true;

	let hidden = true;
</script>

<div class='flex flex-col gap-2 p-1 border border-solid rounded-sm bg-slate-600/15 {classes}'>
	{#if $$slots.title}
		<div class='flex flex-row flex-nowrap gap-0.5 items-center'>
			<div class='grow'>
				<slot name='title'></slot>
			</div>
			{#if showButton}
				<button class='w-min' on:click={() => hidden = !hidden}>
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
				<slot></slot>
			</div>
		{/if}
	{:else}
		<slot></slot>
	{/if}
</div>
