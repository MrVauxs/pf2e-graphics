<svelte:options accessors={true} />

<script lang='ts'>
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core'
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document'

	export let elementRoot: HTMLElement | undefined
	export let item: ItemPF2e | null = null
	if (!item) {
		throw new Error('An item is required to render the ItemAnimations application.')
	}

	// import { getContext } from "svelte";
	// const application = getContext("#external").application;

	const doc = new TJSDocument(item)
	const rollOptions = $doc.getRollOptions('item')
	let animations = window.pf2eGraphics.AnimCore.getMatchingAnimationTrees(rollOptions)

	// *In Zenyatta VA* Experience Reactivity
	doc.subscribe(() => (animations = window.pf2eGraphics.AnimCore.getMatchingAnimationTrees(rollOptions)))
	if (import.meta.hot) {
		import.meta.hot.on(
			'updateAnims',
			() => (animations = window.pf2eGraphics.AnimCore.getMatchingAnimationTrees(rollOptions)),
		)
	}

	const tabs = ['Tab 1', 'Tab 2'] as const
	let activeTab: (typeof tabs)[number] = tabs[0]
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden'>
		<!-- Header -->
		<div class='flex gap-2'>
			<img src={$doc.img} alt={$doc.name} class='size-12 aspect-square' />
			<h1 class='w-full mt-1 font-serif font-bold text-4xl'>
				{$doc.name}
			</h1>
		</div>
		<!-- Tabs -->
		<div class='flex align-baseline text-center py-1 border-y-foundry'>
			<div class='w-1/4'>Summary</div>
			<div class='w-3/4 flex align-baseline items-center justify-around cursor-pointer'>
				{#each tabs as tab}
					{@const active = tab === activeTab}
					<button class="tab-button {active ? 'active-tab' : ''}" on:click={() => (activeTab = tab)}>
						{tab}
					</button>
				{/each}
			</div>
		</div>
		<div class='flex flex-row h-full overflow-hidden'>
			<!-- Summary -->
			<div class='w-1/4 border-r pt-2'>
				<div class='flex'>
					<label class='flex gap-2 mr-2 items-center whitespace-nowrap font-semibold' for='source-id'>
						<span>Item Slug</span>
					</label>
					<input
						class='w-full'
						id='source-id'
						disabled={true}
						value={$doc.slug}
						data-tooltip={$doc.slug}
					/>
				</div>
			</div>
			<!-- Contents -->
			<div class='w-3/4 p-1 overflow-y-scroll'>
				{#if Object.keys(animations).length === 0}
					<p>No animations found for this item.</p>
				{:else}
					<h2>
						Existing Animations <i
							class='fa-solid fa-info-circle ml-auto mr-2 cursor-help text-sm align-top'
							data-tooltip='These entries are compiled versions of imported animations from modules.<p/>The JSONs presented may differ from the original data of the module.'
							data-tooltip-direction='RIGHT'
						/>
					</h2>
					<div class='ml-4'>
						{#each Object.keys(animations) as animationKey}
							{#if animations[animationKey].length > 0}
								<h3>{animationKey}</h3>
								<div class='flex flex-col gap-1 ml-4'>
									{#each animations[animationKey] as animation}
										<input disabled={true} value={JSON.stringify(animation)} />
									{/each}
								</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</main>
</ApplicationShell>

<style lang='postcss'>
	.border-y-foundry {
		border-bottom: 1px solid var(--secondary-background);
		border-top: 1px solid var(--secondary-background);
	}
	.tab-button {
		all: unset;

		@apply w-full;

		&:hover {
			text-shadow: 0 0 10px var(--color-shadow-primary);
		}
	}

	.active-tab {
		text-shadow: 0 0 10px var(--color-shadow-primary);
		@apply underline font-bold;
	}
</style>
