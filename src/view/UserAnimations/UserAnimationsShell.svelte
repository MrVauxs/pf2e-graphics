<svelte:options accessors={true} />
<script lang='ts'>
	import { i18n } from 'src/utils';
	// import PresetAnimations from './tabs/preset-animations.svelte'
	import { getContext } from 'svelte';
	import AnimationEditor from '../_components/AnimationEditor.svelte';
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core';
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document';

	export let storeDocument: TJSDocument<UserPF2e>;
	export let document: UserPF2e;
	export let elementRoot: HTMLElement | undefined;

	const doc = storeDocument;

	const tabs = ['user-animations'] as const;
	const activeTab = getContext('#external').sessionStorage.getStore(document.id, tabs[0] as typeof tabs[number]);
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden flex flex-col h-full'>
		<div class='flex-grow-0 flex-shrink pb-1'>
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<div class='flex gap-2 h-20'>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<img
					src={$doc.avatar}
					alt={$doc.name}
					class='h-full hover:cursor-pointer'
					on:click={() => $doc.sheet.render(true)}
				/>
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
									{i18n(`userAnimation.tabs.${tab}`)}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class='flex flex-row overflow-hidden flex-1 pb-2'>
			{#if $activeTab === 'user-animations'}
				<div class='w-full overflow-y-scroll p-1'>
					<AnimationEditor {doc} />
				</div>
			{/if}
		</div>
	</main>
</ApplicationShell>
