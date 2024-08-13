<svelte:options accessors={true} />

<script lang='ts'>
	import { type Writable, readable } from 'svelte/store'
	import { getContext } from 'svelte'
	import { devMessage, i18n } from 'src/utils'
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import AnimationEditor from '../_components/AnimationEditor.svelte'
	import JSONEditorApp from '../_components/JSONEditor/JSONEditor'
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core'

	export let elementRoot: HTMLElement | undefined

	const sessionStorage = getContext('#external').sessionStorage
	const showNewAnimation = sessionStorage.getStore('showNewAnimation', false)
	let newKey = ''

	const doc = window.pf2eGraphics.storeSettings.getWritableStore('worldAnimations') as Writable<Record<string, Exclude<JSONData[string], string>>>

	// FIXME: I shouldn't have to do this but...
	doc.subscribe((upd) => {
		Object.entries(upd).forEach(([key, val]) => val ? null : delete upd[key])
		game.settings.set('pf2e-graphics', 'worldAnimations', upd)
	})

	const tabs = ['world-animations', 'preset-animations'] as const
	const activeTab: Writable<(typeof tabs)[number]> = sessionStorage.getStore('world', tabs[0])

	function createAnimation() {
		if (!newKey.length) throw ui.notifications.error('Primary roll option must not be empty!')
		$doc[newKey.trim()] = []
		$showNewAnimation = !$showNewAnimation
	}

	const animations = window.pf2eGraphics.AnimCore.getAnimations()

	$: devMessage(`World Animations (${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()})`, $doc, $showNewAnimation)
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden flex flex-col h-full'>
		<div class='flex-grow-0 flex-shrink'>
			<div class='flex gap-2 h-20'>
				<div class='flex flex-col w-full'>
					<h1 class='w-full my-1 font-serif font-bold text-4xl text-center border-0'>
						World Animations
					</h1>
					<!-- Tabs -->
					<div class='flex align-baseline text-center py-1 border-y-foundry'>
						<div class='w-full flex align-baseline items-center justify-around cursor-pointer'>
							{#each tabs as tab}
								{@const active = tab === $activeTab}
								<button class="tab-button {active ? 'active-tab' : ''}" on:click={() => (activeTab.set(tab))}>
									{i18n(`worldAnimation.tabs.${tab}`)}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class='flex flex-row overflow-hidden flex-1 pb-2'>
			<div class='overflow-y-auto w-full'>
				{#if $activeTab === 'world-animations'}
					<div class='p-2 pb-0 flex flex-col h-full items-center'>
						<div class='flex flex-col w-full items-center gap-1.5'>
							{#each Object.keys($doc) as key}
								<AnimationEditor
									bind:key
									bind:value={$doc[key]}
									deleteFn={(key) => {
										delete $doc[key]
										// eslint-disable-next-line no-self-assign
										$doc = $doc // Svelte Updates
									}} />
							{/each}
						</div>
						<div class='w-1/2 m-1 text-center items-center flex flex-col gap-1'>
							{#if !$showNewAnimation}
								<button on:click={() => ($showNewAnimation = !$showNewAnimation)}>
									<i class='fas fa-plus' />
									Create New Animation
								</button>
							{:else}
								<span class='px-1'> Input the primary roll option. </span>
								<div class='flex w-full gap-1'>
									<input
										type='text'
										bind:value={newKey}
										placeholder={window.Sequencer.Helpers.random_array_element(AnimCore.keys)}
									/>
									<button
										data-tooltip='pf2e-graphics.cancel'
										class='fa fa-times w-min m-0'
										on:click={() => ($showNewAnimation = !$showNewAnimation)}
									/>
								</div>
								<button class="" on:click={createAnimation}>
									<i class='fas fa-check' />
									Submit
								</button>
							{/if}
						</div>
					</div>
				{/if}
				{#if $activeTab === 'preset-animations'}
					<div class='p-2 pb-0 items-center overflow-x-hidden overflow-y-scroll grid grid-cols-3 gap-x-1'>
						{#each Object.keys(animations).sort() as key}
							<div
								class='w-full p-0.5 mb-1 flex border border-solid bg-gray-400 bg-opacity-50 rounded-sm'
								data-tooltip={key}
							>
								<span class='w-[90%] truncate text-nowrap'>{key}</span>
								<button
									class='fas fa-brackets-curly h-full w-min ml-auto'
									on:click={() => {
										new JSONEditorApp(
											{ data: { store: readable(animations[key]), key } },
										).render(true, {
											focus: true,
										})
									}} />
							</div>
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
