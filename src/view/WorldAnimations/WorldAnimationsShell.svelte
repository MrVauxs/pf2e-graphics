<svelte:options accessors={true} />
<script lang='ts'>
	import { i18n } from 'src/utils'
	// import PresetAnimations from './tabs/preset-animations.svelte'
	import { getContext } from 'svelte'
	import { type Writable, writable } from 'svelte/store'
	import AnimationEditor from '../_components/AnimationEditor.svelte'
	import JSONEditorApp from '../_components/JSONEditor/JSONEditor'
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core'

	export let storeDocument: Writable<{ id: 'settings' }>
	export let elementRoot: HTMLElement | undefined

	const tabs = ['world-animations', 'preset-animations'] as const
	const activeTab = getContext('#external').sessionStorage.getStore('settings', tabs[0] as typeof tabs[number])

	let search = ''
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden flex flex-col h-full'>
		<div class='flex-grow-0 flex-shrink pb-1'>
			<div class='flex gap-2 h-20'>
				<div class='flex flex-col w-full'>
					<h1 class='w-full mt-1 font-serif font-bold text-4xl text-center'>
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
		<div class='overflow-hidden flex-1 pb-2 w-full flex flex-col'>
			{#if $activeTab === 'world-animations'}
				<div class='w-full overflow-y-scroll p-1'>
					<AnimationEditor doc={storeDocument} />
				</div>
			{/if}
			{#if $activeTab === 'preset-animations'}
				<div class='text-nowrap mx-auto'>
					<span class=''><i class='fa fa-search' /> Search</span><input bind:value={search} class='mx-1' />
				</div>
				<div class='p-1 pb-0 items-center overflow-x-hidden overflow-y-scroll grid grid-cols-3 gap-x-1'>
					{#each Object.keys(window.pf2eGraphics.AnimCore.animations).filter(k => k.includes(search)).sort() as key}
						{@const animation = window.pf2eGraphics.AnimCore.animations[key]}
						<div
							class='w-full p-0.5 mb-1 flex border border-solid bg-gray-400 bg-opacity-50 rounded-sm'
							data-tooltip={key}
						>
							<span class='w-[90%] truncate text-nowrap'>
								{key}
								{#if typeof animation !== 'string' && animation.some(ani => ani.options?.sound)}
									(<i class='fa fa-volume align-middle leading-4' data-tooltip='pf2e-graphics.hasSound' />)
								{/if}
							</span>
							<button
								class='fas fa-brackets-curly h-full w-min ml-auto'
								on:click={() => {
									new JSONEditorApp({
										store: writable({ [key]: animation }),
										stasis: writable(true),
										permission: false,
									}).render(true, {
										focus: true,
									})
								}} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</main>
</ApplicationShell>
