<script lang='ts'>
	import { AnimCore } from 'src/storage/AnimCore';
	import { deslugify } from 'src/utils';
	import { derived } from 'svelte/store';

	type ArrayAnimationSet = { name: string; source: string; data: any }[];

	const preset = derived(
		AnimCore.animationsStore,
		$animations => Array.from($animations)
			.map(([key, data]) => ({ name: deslugify(key), source: 'preset', data })),
	);

	const list: ArrayAnimationSet = $preset.filter(item => item.name !== '_tokenImages');
</script>

<header class='directory-header'>
	<div class='header-actions action-buttons flexrow pb-0.5'>
		<button>
			<i class='fas fa-films'></i>
			Create Animation
		</button>
		<button>
			<i class='fas fa-folder'></i>
			Create Folder
		</button>
	</div>
	<div class='header-search flexrow pl-1'>
		<i class='fas fa-search'></i>
		<input
			type='search'
			name='search'
			aria-label='Search Animations'
			placeholder='Search Animations'
			autocomplete='off'
		/>
	</div>
</header>
<ol class='directory-list'>
	{#each list as item}
		<li class='relative px-2 hover:bg-slate-400/10 border-0 first:border-t border-b border-black border-solid'>
			<aside class='absolute right-0 top-0 m-1'>
				{#if item.source === 'preset'}
					<i data-tooltip='Preset Animation' class='fas fa-gear'></i>
				{:else if item.source === 'user'}
					<i data-tooltip='User Animation' class='fas fa-user'></i>
				{:else if item.source === 'world'}
					<i data-tooltip='World Animation' class='fas fa-globe'></i>
				{/if}
			</aside>
			<header class='leading-[3rem]'>{item.name}</header>
			{#if typeof item.data === 'string'}
				<footer class='
					absolute right-0 bottom-0
					italic text-xs
					bg-black/40 rounded-sm border-solid border border-black/100
					px-1 m-0.5
				'>
					Alias of {item.data}
				</footer>
			{/if}
		</li>
	{/each}

</ol>
<footer class='directory-footer'></footer>
