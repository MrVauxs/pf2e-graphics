<script lang='ts'>
	import type { ArrayAnimationSet } from 'src/extensions';
	import { TJSDialog } from '#runtime/svelte/application';
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
	import { AnimCore } from 'src/storage/AnimCore';
	import { deslugify, i18n, log } from 'src/utils';
	import { derived, type Readable } from 'svelte/store';
	import CreateAnimation from './CreateAnimation.svelte';

	let search = '';

	// TODO: TJS I pray to you make this mess gone by letting me update to Svelte 5

	const userDocs = game.users.map(x => new TJSDocument(x));
	const usersFlags = derived(userDocs, ($userDocs) => {
		return $userDocs.flatMap(
			user =>
				(user.getFlag<ArrayAnimationSet>('pf2e-graphics', 'animations') || []).map(anim => ({
					...anim,
					source: 'user',
					user: user.id,
				})) as ArrayAnimationSet,
		);
	});

	const core = derived(
		AnimCore.animationsStore,
		$animations =>
			Array.from($animations).map(([key, data]) => ({
				name: deslugify(key),
				source: 'core',
				data,
			})) as ArrayAnimationSet,
	);

	// TODO: other modules can add data to PF2e Graphics' core
	// const modules = derived(
	// 	game.modules
	// 		.filter(module => module.flags['pf2e-graphics'])
	// 		.flatMap((module) => {
	// 		// idk something goes here
	// 		}),
	// 	$animations => Array.from($animations)
	// 		.map((data: any) => ({ key: '', source: 'module', ...data })) as ArrayAnimationSet,
	// );

	const world = derived(
		window.pf2eGraphics.storeSettings.getReadableStore('globalAnimations') as Readable<ArrayAnimationSet>,
		$animations =>
			Array.from($animations).map((data: any) => ({
				key: '',
				source: 'world',
				...data,
			})) as ArrayAnimationSet,
	);

	let list: ArrayAnimationSet = [];

	$: list = $core
		// .concat($modules)
		.concat($world)
		.concat($usersFlags)
		.filter(item => item.name !== '_tokenImages')
		.filter(
			item =>
				item.name.toLowerCase().includes(search.toLowerCase()) || (typeof item.data === 'string' ? item.data.toLowerCase().includes(search.toLowerCase()) : false),
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	function createAnimation() {
		const sidebarRect = document.querySelector('#create-animation')!.getBoundingClientRect();
		new TJSDialog(
			{
				title: i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.popup.title'),
				content: {
					// @ts-expect-error TJS-2-TS Fix in the next update maybe?
					class: CreateAnimation,
				},
				focusFirst: true,
			},
			{
				headerIcon: 'modules/pf2e-graphics/assets/module/Vauxs_by_Bishop.png',
				classes: ['pf2e-g'],
				left: sidebarRect.x - 310,
				top: sidebarRect.y - 5,
				width: 300,
			},
		).render(true, { focus: true });
	}

	function openAnimation(data: any) {
		log('Open Animation', data);
	}
</script>

<header class='directory-header'>
	<div class='header-actions action-buttons flexrow pb-0.5'>
		<button on:click={createAnimation} id='create-animation'>
			<i class='fas fa-films'></i>
			{i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.button')}
		</button>
		<button id='create-folder'>
			<i class='fas fa-folder'></i>
			{i18n('pf2e-graphics.sidebar.animationSets.create.folder.button')}
		</button>
	</div>
	<div class='header-search flexrow pl-1'>
		<i class='fas fa-search'></i>
		<input
			bind:value={search}
			type='search'
			name='search'
			aria-label={i18n('pf2e-graphics.sidebar.animationSets.search.label')}
			placeholder={i18n('pf2e-graphics.sidebar.animationSets.search.placeholder')}
			autocomplete='off'
		/>
	</div>
</header>
<ol class='directory-list'>
	{#each list as item}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<li
			tabindex='-1'
			on:click={() => openAnimation(item)}
			on:keydown={e => e.key === 'Enter' && openAnimation(item)}
			class='
				relative px-2
				hover:bg-slate-400/10
				active:bg-slate-400/20
				border-0 first:border-t border-b
				border-black border-solid
				text-left w-full
			'
		>
			<aside
				class='
					absolute right-0 top-0 m-1
				'
			>
				{#if item.source === 'core'}
					<i data-tooltip={i18n('pf2e-graphics.scopes.full.core')} class='fas fa-gear'></i>
				{:else if item.source === 'user'}
					<span
						class='
							px-0.5 bg-black/40 rounded-sm border-solid border border-black/100
						'
					>
						{window.game.users.get(item.user || '')?.name}
					</span>
					<i data-tooltip={i18n('pf2e-graphics.scopes.full.user')} class='fas fa-user pl-0.5'></i>
				{:else if item.source === 'world'}
					<i data-tooltip={i18n('pf2e-graphics.scopes.full.world')} class='fas fa-globe'></i>
				{/if}
			</aside>

			<header class='leading-[3rem]'>
				{item.name}
				<span class='text-xs align-sub'>
					{#if !item.data || !item.data.length}
						<i>{i18n('pf2e-graphics.sidebar.animationSets.list.empty')}</i>
					{/if}
				</span>
			</header>

			{#if typeof item.data === 'string'}
				<footer
					class='
						absolute right-0 bottom-0
						text-xs
						bg-black/40 rounded-sm border-solid border border-black/100
						px-1 m-0.5
					'
				>
					{@html i18n('pf2e-graphics.sidebar.animationSets.list.alias', { rollOption: item.data })}
				</footer>
			{/if}
		</li>
	{/each}
</ol>
<footer class='directory-footer'></footer>
