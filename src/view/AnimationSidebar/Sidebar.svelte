<script lang='ts'>
	import type { ArrayAnimationSet } from 'src/extensions';
	import { TJSDialog } from '#runtime/svelte/application';
	import { TJSContextMenu } from '#standard/application/menu';
	import { i18n, log } from 'src/utils';
	import { onMount } from 'svelte';
	import { readable, type Readable } from 'svelte/store';
	import CreateAnimation from './CreateAnimation.svelte';
	import { copyAnimation, removeAnimation } from './sidebarFunctions';

	let search = '';

	let animationsList: Readable<ArrayAnimationSet> = readable([]);
	onMount(() => {
		// Delaying the importing because game.users is not available at the time.
		// TODO: This can definitely be done better.
		import('./sidebarVars').then((module) => {
			animationsList = module.animationsList;
		});
	});

	// TODO: TJS I pray to you make this mess gone by letting me update to Svelte 5
	let list: ArrayAnimationSet = [];
	$: list = $animationsList
		.filter(item => item.name !== '_tokenImages')
		.filter(
			item =>
				item.name.toLowerCase().includes(search.toLowerCase()) || (typeof item.data === 'string' ? item.data.toLowerCase().includes(search.toLowerCase()) : false),
		)
		.sort((a, b) => a.name.localeCompare(b.name))
		.sort((a, b) => a.source === 'module' && b.source !== 'module' ? 1 : -1);

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

	function contextMenu(event: MouseEvent, animation: ArrayAnimationSet[number]) {
		const bounds = (event.currentTarget as HTMLElement)?.getBoundingClientRect();
		const coordinates = {
			y: Math.ceil(bounds.bottom + 1 || 0),
			x: Math.ceil(bounds.left + 1 || 0),
		};

		const items = [
			{
				icon: 'fa fa-file-export',
				label: 'Export',
			},
			{
				icon: 'fa fa-file-import',
				label: 'Import',
			},
			{
				icon: 'fa fa-copy',
				label: 'Duplicate',
				onPress: () => { copyAnimation(animation); },
			},
		];

		if (animation.source !== 'module') {
			items.push({
				icon: 'fa fa-trash',
				label: 'Delete',
				onPress: () => { removeAnimation(animation); },
			});
		}

		TJSContextMenu.create({
			id: 'pf2e-g pf2e-graphics-context',
			event,
			...coordinates,
			styles: {
				width: `${Math.ceil(bounds.width + 1)}px`,
			},
			items,
		});
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
			id='pf2e-g-{item.source}-{item.key}'
			tabindex='-1'
			on:click={() => openAnimation(item)}
			on:contextmenu={event => contextMenu(event, item)}
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
				{#if item.source === 'module'}
					<i data-tooltip={i18n('pf2e-graphics.scopes.full.module')} class='fas fa-cubes'></i>
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
						text-[0.6rem]
						bg-black/40 rounded-sm border-solid border border-black/100
						px-1 m-0.5
					'
				>
					{@html i18n(
						'pf2e-graphics.sidebar.animationSets.list.alias',
						{ rollOption: item.data },
					)}
				</footer>
			{/if}
		</li>
	{/each}
</ol>
<footer class='directory-footer'></footer>
