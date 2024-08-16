<svelte:options accessors={true} />
<script lang='ts'>
	import { i18n } from 'src/utils'
	// import PresetAnimations from './tabs/preset-animations.svelte'
	import { getContext } from 'svelte'
	import AnimationEditor from '../_components/AnimationEditor.svelte'
	import UserAnimationsApp from '../UserAnimations/UserAnimationsApp'
	import PresetAnimations from './tabs/preset-animations.svelte'
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core'
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document'

	export let storeDocument: TJSDocument<ItemPF2e>
	export let document: ItemPF2e
	export let elementRoot: HTMLElement | undefined

	const doc = storeDocument

	const tabs = ['preset-animations', 'custom-animations'] as const
	const activeTab = getContext('#external').sessionStorage.getStore(document.id, tabs[0] as typeof tabs[number])
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
				<div class='w-1/4'>
					{#if $activeTab !== 'custom-animations'}
						Summary
					{/if}
				</div>
				<div class='w-3/4 flex align-baseline items-center justify-around cursor-pointer'>
					{#each tabs as tab}
						{@const active = tab === $activeTab}
						<button
							class="tab-button {active ? 'active-tab' : ''}"
							on:click={() => ($activeTab = tab)}
						>
							{i18n(`itemAnimation.tabs.${tab}`)}
						</button>
					{/each}
				</div>
			</div>
		</div>
		<!-- Content -->
		<div class='flex flex-row overflow-hidden pt-2 gap-1 flex-1'>
			{#if $activeTab === 'custom-animations'}
				<div class='w-full overflow-y-scroll p-1'>
					<AnimationEditor {doc} />
				</div>
			{:else} <!-- Sidebar Summary -->
				<div class='w-1/4 flex flex-col overflow-y-scroll'>
					<!-- Buttons and Text -->
					<div class='grid gap-y-1 grid-cols-4
						pr-1 flex-grow-0 flex-shrink
						leading-[var(--form-field-height)]
						[&>*]:m-0'
					>
						<label
							class='self-center whitespace-nowrap font-semibold col-span-1'
							for='source-id'
						>
							<span>Slug</span>
						</label>
						<input
							class='col-span-3'
							id='source-id'
							disabled={true}
							value={$doc.slug}
							data-tooltip={$doc.slug}
						/>
						<label
							class='self-center whitespace-nowrap font-semibold col-span-1'
							for='actor'
						>
							<span>Actor</span>
						</label>
						<button
							disabled={!$doc.actor}
							class='col-span-3 {!$doc.actor ? 'disabled' : ''} p-0 leading-4'
							id='actor'
							data-tooltip='pf2e-graphics.itemAnimation.openSheet'
							on:click={() => {
								$doc.actor?.sheet.render(true)
							}}
						>
							{$doc.actor?.name || 'No Actor'}
						</button>
						<label
							class='self-center whitespace-nowrap font-semibold col-span-1'
							for='item'
						>
							<span>Item</span>
						</label>
						<button
							class='col-span-3 p-0 leading-4'
							id='item'
							data-tooltip='pf2e-graphics.itemAnimation.openSheet'
							on:click={() => {
								$doc.sheet.render(true)
							}}
						>
							{$doc.name}
						</button>

						<label
							class='self-center whitespace-nowrap font-semibold col-span-1'
							for='item'
						>
							<span>User</span>
						</label>
						<button
							class='col-span-3 p-0 leading-4'
							id='item'
							data-tooltip='pf2e-graphics.itemAnimation.openSheet'
							on:click={() => {
								new UserAnimationsApp({ document: window.game.user }).render(true)
							}}
						>
							{window.game.user.name}
						</button>
					</div>
				</div>
				<!-- Inner Content -->
				<div class='w-3/4 overflow-y-scroll'>
					{#if $activeTab === 'preset-animations'}
						<PresetAnimations {doc} />
					{/if}
				</div>
			{/if}
		</div>
	</main>
</ApplicationShell>
