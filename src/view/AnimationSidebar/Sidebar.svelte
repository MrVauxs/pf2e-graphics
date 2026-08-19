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

	let list: Readable<AnimationSetDocument[]> = $state(readable([]));
	const unhook = Hooks.on('pf2eGraphicsReady', () => assignDerivedToList());
	onMount(() => {
		if (window.pf2eGraphics?.AnimCore?.ready) assignDerivedToList();
		// Return on onMount = onDismount
		return () => Hooks.off('pf2eGraphicsReady', unhook);
	});

	// Assigned alongside `list` in `assignDerivedToList()`, so it is always populated by the time any
	// `SidebarListElement` renders — but that invariant isn't visible to the type checker.
	let hiddenAnimations: {
		global: Readable<string[]>;
		user: Readable<Record<string, string[]>>;
	} | undefined = $state();
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

	let showModuleAnimations = $state(dev);
</script>

<header class='directory-header'>
	<div class='header-actions action-buttons flexrow pb-0.5'>
		<button onclick={() => popupCreateAnimation('make')} id='create-animation'>
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
<!--
	`h-1` is load bearing: a specified height caps this flex item's automatic minimum size, so the
	children's percentage heights (`max-h-[50%]` below, `h-[calc(100%-2.5rem)]` further down) resolve
	against a definite box rather than their content.

	`flex-1` used to come for free from Foundry's `.flexcol > *`. v14 narrowed that to
	`body.game .app .flexcol > *` and left a bare `.flexcol > * { flex: 0 0 auto }` behind; the sidebar
	is an `<aside>`, not an `.app`, so the wrapper stopped stretching and the whole list rendered 4px
	tall. Set it explicitly instead of depending on Foundry's rule.
-->
<div class='inline-flex flex-col flex-1 h-1'>
	<ol
		id='pf2e-graphics-custom-sets'
		class:grow={!$search}
		class='m-0 p-0 list-none overflow-x-hidden overflow-y-auto'
	>
		{#each $list.filter(x => x.source !== 'module') as item}
			{#if hiddenAnimations}
				<SidebarListElement {item} hidden={hiddenAnimations} />
			{/if}
		{:else}
			<li class='p-8 text-center opacity-40 italic text-sm'>
				{i18n('pf2e-graphics.sidebar.animationSets.list.empty')}
			</li>
		{/each}
	</ol>
	<ol id='pf2e-graphics-bundled-sets' class='m-0 p-0 max-h-[50%]'>
		<header
			role='tree'
			tabindex='0'
			class='p-2 leading-6 bg-red-900 h-10'
			onclick={() => (showModuleAnimations = !showModuleAnimations)}
			onkeypress={() => (showModuleAnimations = !showModuleAnimations)}
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
					{#if hiddenAnimations}
						<SidebarListElement {item} hidden={hiddenAnimations} />
					{/if}
				{/each}
			</li>
		{/if}
	</ol>
</div>
