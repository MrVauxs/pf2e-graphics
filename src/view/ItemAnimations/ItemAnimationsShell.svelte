<svelte:options accessors={true} />

<script lang='ts'>
	import { i18n } from 'src/utils'
	import PresetAnimations from './tabs/preset-animations.svelte'
	import AnimationConfig from './tabs/animation-config.svelte'
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
	const getAnimations = () => window.pf2eGraphics.AnimCore.getMatchingAnimationTrees(rollOptions, item.actor, item)
	let animData = getAnimations()

	doc.subscribe(() => (animData = getAnimations()))
	if (import.meta.hot) {
		import.meta.hot.on(
			'updateAnims',
			() => (animData = getAnimations()),
		)
	}

	const tabs = ['preset-animations', 'custom-animations'] as const
	let activeTab: (typeof tabs)[number] = tabs[0]
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden flex flex-col h-full'>
		<!-- Header -->
		<div class='flex-grow-0 flex-shrink'>
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
							{i18n(`itemAnimation.tabs.${tab}`)}
						</button>
					{/each}
				</div>
			</div>
		</div>
		<!-- Content -->
		<div class='flex flex-row overflow-hidden pt-2 gap-1 flex-1'>
			<!-- Sidebar Summary -->
			<div class='w-1/4 flex flex-col'>
				<!-- Buttons and Text -->
				<div class='grid gap-y-1 grid-cols-4 [&>*]:m-0 [&>*]:leading-4 pr-1 flex-grow-0 flex-shrink'>
					<label class='self-center whitespace-nowrap font-semibold col-span-1' for='source-id'>
						<span>Slug</span>
					</label>
					<input
						class='col-span-3'
						id='source-id'
						disabled={true}
						value={$doc.slug}
						data-tooltip={$doc.slug}
					/>
					<label class='self-center whitespace-nowrap font-semibold col-span-1' for='actor'>
						<span>Actor</span>
					</label>
					<button
						disabled={!$doc.actor}
						class='col-span-3 {!$doc.actor ? 'disabled' : ''}'
						id='actor'
						data-tooltip='pf2e-graphics.itemAnimation.openSheet'
						on:click={() => {
							$doc.actor?.sheet.render(true)
						}}
					>
						{$doc.actor?.name || 'No Actor'}
					</button>
					<label class='self-center whitespace-nowrap font-semibold col-span-1' for='item'>
						<span>Item</span>
					</label>
					<button
						class='col-span-3'
						id='item'
						data-tooltip='pf2e-graphics.itemAnimation.openSheet'
						on:click={() => {
							$doc.sheet.render(true)
						}}
					>
						{$doc.name}
					</button>
				</div>
				<!-- Slugs -->
				<div class='flex-1 flex-col flex gap-0.5'>
					<label class='whitespace-nowrap font-semibold' for='roll-options'>
						<span>Options</span>
					</label>
					<textarea
						class='text-nowrap h-full w-full resize-none p-0.5 text-xs'
						id='roll-options'
						disabled={true}
						value={$doc.getRollOptions().join('\n')}
					/>
				</div>
			</div>
			<!-- Inner Content -->
			<div class='w-3/4 overflow-y-scroll'>
				{#if activeTab === 'preset-animations'}
					<PresetAnimations {animData} {item} />
				{:else if activeTab === 'custom-animations'}
					<AnimationConfig {doc} />
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
