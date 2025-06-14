<script lang='ts'>
	import type { AnimationSetDocument } from 'schema';
	import type { Readable } from 'svelte/store';
	import { dev, i18n } from 'src/utils';
	import { onMount } from 'svelte';
	import { circInOut } from 'svelte/easing';
	import { derived, readable, writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { popupCreateAnimation } from './sidebarFunctions';
	import SidebarListElement from './SidebarListElement.svelte';
	import { initVariables } from './sidebarVars';

	const search = writable('');

	let list: Readable<AnimationSetDocument[]> = readable([]);
	const unhook = Hooks.on('pf2eGraphicsReady', () => assignDerivedToList());
	onMount(() => {
		if (window.pf2eGraphics?.AnimCore?.ready) assignDerivedToList();
		// Return on onMount = onDismount
		return () => Hooks.off('pf2eGraphicsReady', unhook);
	});

	let hiddenAnimations: {
		global: Readable<string[]>;
		user: Readable<Record<string, string[]>>;
	};
	function assignDerivedToList() {
		const variables = initVariables();
		hiddenAnimations = {
			user: variables.userDisabled,
			global: window.pf2eGraphics.storeSettings.getReadableStore('globalDisabledAnimations')!,
		};
		list = derived([variables.animations, search], ([vars, $search]) =>
			vars
				.filter(item => item.name !== '_tokenImages')
				.filter(
					item =>
						(typeof item.animationSets === 'string'
							? item.animationSets.toLowerCase().includes($search.toLowerCase())
							: false) || item.name.toLowerCase().includes($search.toLowerCase()),
				)
				.sort((a, b) => a.name.localeCompare(b.name))
				.sort((a, b) => (a.source === 'module' && b.source !== 'module' ? 1 : -1)));
	}

	let showModuleAnimations = dev;
</script>

<header class='directory-header'>
	<div class='header-actions action-buttons flexrow pb-0.5'>
		<button on:click={() => popupCreateAnimation('make')} id='create-animation'>
			<i class='fas fa-films'></i>
			{i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.button')}
		</button>
		<button id='create-folder' disabled>
			<i class='fas fa-folder'></i>
			{i18n('pf2e-graphics.sidebar.animationSets.create.folder.button')}
		</button>
	</div>
	<div class='header-search flexrow pl-1'>
		<i class='fas fa-search'></i>
		<input
			bind:value={$search}
			type='search'
			name='search'
			aria-label={i18n('pf2e-graphics.sidebar.animationSets.search.label')}
			placeholder={i18n('pf2e-graphics.sidebar.animationSets.search.placeholder')}
			autocomplete='off'
		/>
	</div>
</header>
<div class='inline-flex flex-col'>
	<ol
		id='pf2e-graphics-custom-sets'
		class:grow={!$search}
		class='m-0 p-0 list-none overflow-x-hidden overflow-y-auto'
	>
		{#each $list.filter(x => x.source !== 'module') as item}
			<SidebarListElement {item} hidden={hiddenAnimations} />
		{:else}
			<li class='p-8 text-center opacity-40 italic text-sm'>
				{i18n('pf2e-graphics.sidebar.animationSets.list.empty')}
			</li>
		{/each}
	</ol>
	<ol id='pf2e-graphics-bundled-sets' class='m-0 p-0 max-h-[50%] flex flex-col'>
		<header
			role='tree'
			tabindex='0'
			class='p-2 leading-6 bg-red-900 h-10 border-red-600/50 border-0 border-solid'
			class:border-b={showModuleAnimations}
			on:click={() => (showModuleAnimations = !showModuleAnimations)}
			on:keypress={() => (showModuleAnimations = !showModuleAnimations)}
		>
			<i class='fas fa-cubes pr-1'></i>
			{i18n('pf2e-graphics.sidebar.animationSets.moduleAnimationSets')}
		</header>
		{#if showModuleAnimations}
			<li
				transition:slide={{ duration: 600, axis: 'y', easing: circInOut }}
				style:scrollbar-gutter='stable'
				class='
					[&>li]:pl-2 [&>li]:border-l-4 [&>li]:border-solid [&>li]:border-l-red-900
					list-none overflow-x-hidden overflow-y-auto h-[calc(100%-2.5rem)]
				'
			>
				{#each $list.filter(x => x.source === 'module') as item}
					<SidebarListElement {item} hidden={hiddenAnimations} />
				{/each}
			</li>
		{/if}
	</ol>
</div>
