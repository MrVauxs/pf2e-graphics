<script lang='ts'>
	import type { AnimationSetDocument } from 'src/extensions';
	import { TJSContextMenu } from '@typhonjs-fvtt/standard/application/menu';
	import { i18n } from 'src/utils';
	import { slide } from 'svelte/transition';
	import { copyAnimation, openAnimation, removeAnimation } from './sidebarFunctions';

	export let item: AnimationSetDocument;
	export let index: number;

	function moduleIDToName(id: string): string {
		const module = game.modules.get(id)!;
		return module.title ?? module.id;
	}

	function contextMenu(event: MouseEvent, animation: AnimationSetDocument) {
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
				onPress: () => copyAnimation(animation),
			},
		];

		if (animation.source !== 'module') {
			items.push({
				icon: 'fa fa-trash',
				label: 'Delete',
				onPress: () => removeAnimation(animation),
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

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
	transition:slide|global={{ duration: 500, delay: Math.max(0, 250 * index - 50 * index) }}
	id='pf2e-g-{item.source}-{item.rollOption}'
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
			{#if item.module === 'pf2e-graphics'}
				<i data-tooltip={i18n('pf2e-graphics.scopes.full.core')} class='fas fa-cube'></i>
			{:else}
				<span
					class='
						px-0.5 bg-black/40 rounded-sm border-solid border border-black
					'
				>
					{moduleIDToName(item.module)}
				</span>
				<i
					data-tooltip={i18n('pf2e-graphics.scopes.full.module')}
					class='fas fa-cubes'
				></i>
			{/if}
		{:else if item.source === 'user'}
			<span
				class='
					px-0.5 bg-black/40 rounded-sm border-solid border border-black
				'
			>
				{window.game.users.get(item.user)?.name ?? `<i>${i18n('pf2e-graphics.sidebar.animationSets.list.unknownUser')}</i>`}
			</span>
			<i data-tooltip={i18n('pf2e-graphics.scopes.full.user')} class='fas fa-user pl-0.5'></i>
		{:else if item.source === 'world'}
			<i data-tooltip={i18n('pf2e-graphics.scopes.full.world')} class='fas fa-globe'></i>
		{/if}
	</aside>

	<header class='leading-[3rem]'>
		{item.name}
		<span class='text-xs align-sub'>
			{#if !item.animationSets || !item.animationSets.length}
				<i>{i18n('pf2e-graphics.sidebar.animationSets.list.empty')}</i>
			{/if}
		</span>
	</header>

	{#if typeof item.animationSets === 'string'}
		<footer
			class='
				absolute right-0 bottom-0
				text-[0.6rem]
				bg-black/40 rounded-sm border-solid border border-black
				px-1 m-0.5
			'
		>
			{@html i18n('pf2e-graphics.sidebar.animationSets.list.alias', {
				rollOption: item.animationSets,
			})}
		</footer>
	{/if}
</li>
