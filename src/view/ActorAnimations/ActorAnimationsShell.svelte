<svelte:options accessors={true} />

<script lang='ts'>
	import type { Writable } from 'svelte/store'
	import { getContext } from 'svelte'
	import { devMessage, i18n } from 'src/utils'
	import AllAnimations from './submenus/all-animations.svelte'
	import TokenimageManager from './submenus/tokenimage-manager.svelte'
	import ActorAnimations from './submenus/actor-animations.svelte'
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core'
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document'

	export let elementRoot: HTMLElement | undefined
	export let actor: ActorPF2e | null = null
	if (!actor) {
		throw new Error('An actor is required to render the ItemAnimations application.')
	}

	const sessionStorage = getContext('#external').sessionStorage

	const doc = new TJSDocument(actor)
	devMessage(actor, doc)

	const tabs = ['all-animations', 'actor-animations', 'tokenimage-manager'] as const
	const activeTab: Writable<(typeof tabs)[number]> = sessionStorage.getStore(actor.id, tabs[0])
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden flex flex-col h-full'>
		<div class='flex-grow-0 flex-shrink pb-1'>
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<div class='flex gap-2 h-20'>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<img src={$doc.img} alt={$doc.name} class='h-full aspect-square hover:cursor-pointer' on:click={() => $doc.sheet.render(true)} />
				<div class='flex flex-col w-full'>
					<h1 class='w-full mt-1 font-serif font-bold text-4xl'>
						{$doc.name}
					</h1>
					<!-- Tabs -->
					<div class='flex align-baseline text-center py-1 border-y-foundry'>
						<div class='w-full flex align-baseline items-center justify-around cursor-pointer'>
							{#each tabs as tab}
								{@const active = tab === $activeTab}
								<button class="tab-button {active ? 'active-tab' : ''}" on:click={() => (activeTab.set(tab))}>
									{i18n(`actorAnimation.tabs.${tab}`)}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class='flex flex-row overflow-hidden flex-1 pb-2'>
			<div class='overflow-y-auto w-full'>
				{#if $activeTab === 'all-animations'}
					<AllAnimations {doc} />
				{/if}{#if $activeTab === 'actor-animations'}
					<ActorAnimations {doc} />
				{/if}{#if $activeTab === 'tokenimage-manager'}
					<TokenimageManager actor={doc} />
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
