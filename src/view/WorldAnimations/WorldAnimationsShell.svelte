<svelte:options accessors={true} />
<script lang='ts'>
	// @ts-ignore - TJS-2-TS
	import { ApplicationShell } from '#runtime/svelte/component/core';
	import { AnimCore } from 'src/storage/animCore';
	import { i18n, log } from 'src/utils';
	// import PresetAnimations from './tabs/preset-animations.svelte'
	import { getContext } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import AnimationEditor from '../_components/AnimationEditor.svelte';
	import JSONEditorApp from '../_components/JSONEditor/JSONEditor';

	export let storeDocument: Writable<{ id: 'settings' }>;
	export let elementRoot: HTMLElement | undefined;

	const tabs = ['world-animations', 'preset-animations'] as const;
	const activeTab = getContext('#external').sessionStorage.getStore('settings', tabs[0] as typeof tabs[number]);

	let search = '';
	let columns = 4;

	function validateSound(sound: string): true | string {
		// TODO: Inaccurate
		const entry = window.Sequencer.Database.getEntry(AnimCore.parseFiles(sound)[0], { softFail: true });
		return !!entry;
	}

	let parsedAnimations = window.pf2eGraphics.AnimCore.retrieve().animations;

	import.meta.hot?.on('updateAnims', () => {
		parsedAnimations = window.pf2eGraphics.AnimCore.retrieve().animations;
	});
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
				<div class='text-nowrap flex justify-stretch mx-auto'>
					<div>
						<i class='fa fa-grid'></i> Columns
						<input
							step='1'
							min='1'
							class='w-1/2 mx-1'
							bind:value={columns}
							type='number'
						/>
					</div>
					<div>
						<i class='fa fa-search'></i> Search
						<input
							class='w-1/2 mx-1'
							bind:value={search}
							type='text'
						/>
					</div>
					<div>
						<i class='fa fa-tally'></i> Total
						<input
							disabled
							class='w-1/2 mx-1'
							value={Object.keys(parsedAnimations).length}
							type='number'
						/>
					</div>
				</div>
				<div
					class='p-1 pb-0 items-center overflow-x-hidden overflow-y-scroll grid gap-x-1'
					style:grid-template-columns='repeat({columns}, minmax(0, 1fr))'
				>
					{#each Object.keys(parsedAnimations).filter(k => k.includes(search)).sort() as key}
						{@const animation = parsedAnimations[key]}
						<div
							class='w-full p-0.5 mb-1 flex border border-solid bg-gray-400 bg-opacity-50 rounded-sm'
							data-tooltip={key}
						>
							<span class='w-[90%] truncate text-nowrap'>
								{key}
								{#if typeof animation !== 'string' && animation.some(ani => ani.options?.sound)}
									{@const check = animation
										.filter(x => x.options?.sound)
										.filter(x => Array.isArray(x.options.sound)
											// @ts-ignore I can't add types in Svelte markup
											? x.options.sound.some(x => !validateSound(x.file))
											: !validateSound(x.options?.sound.file),
										)
									}
									{(() => {
										if (check.length) log('The following sounds do not exist!', check.flatMap(x => x.options.sound));
										return '';
									})()}
									(<i class='
										fa {!check.length ? 'fa-volume' : 'fa-volume-xmark text-red-500'}
										align-middle leading-4
									'
										data-tooltip={!check.length ? 'pf2e-graphics.hasSound' : 'pf2e-graphics.hasSoundWrong'}>
									</i>)
								{/if}
							</span>
							<button
								data-tooltip='pf2e-graphics.worldAnimation.shiftJSON'
								class='fas fa-brackets-curly h-full w-min ml-auto'
								on:click={(ev) => {
									let obj;
									if (ev.shiftKey) {
										obj = { [key]: parsedAnimations[key] };
									} else {
										obj = { [key]: window.pf2eGraphics.AnimCore.animations[key] };
									}
									new JSONEditorApp({
										store: writable(obj),
										permission: false,
										validate: true,
									}).render(true, {
										focus: true,
									});
								}}
							></button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</main>
</ApplicationShell>
