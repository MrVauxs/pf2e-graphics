<script lang='ts'>
	import { TJSDialog } from '#runtime/svelte/application';
	import { AnimCore } from 'src/storage/AnimCore';
	import { deslugify, log } from 'src/utils';
	import { derived } from 'svelte/store';

	let search = '';

	type ArrayAnimationSet = { name: string; source: string; data: any }[];

	const preset = derived(
		AnimCore.animationsStore,
		$animations => Array.from($animations)
			.map(([key, data]) => ({ name: deslugify(key), source: 'preset', data })),
	);

	let list: ArrayAnimationSet = [];

	$: list = $preset
		.filter(item => item.name !== '_tokenImages')
		.filter(item =>	item.name.toLowerCase().includes(search.toLowerCase())
			|| (typeof item.data === 'string'
				? item.data.toLowerCase().includes(search.toLowerCase())
				: false))
		.sort((a, b) => a.name.localeCompare(b.name));

	function createAnimation() {
		const sidebarRect = document.querySelector('#create-animation')!.getBoundingClientRect();
		const dialog = new TJSDialog({
			title: 'Create Animation',
			content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
			buttons: {
				create: { onPress: () => dialog.close(), label: 'Create' },
				cancel: { onPress: () => dialog.close(), label: 'Cancel' },
			},
		}, {
			left: sidebarRect.x - 310,
			top: sidebarRect.y - 5,
			width: 300,
		}).render(true);
	}

	function openAnimation(data: any) {
		log('Open Animation', data);
	}
</script>

<header class='directory-header'>
	<div class='header-actions action-buttons flexrow pb-0.5'>
		<button on:click={createAnimation} id='create-animation'>
			<i class='fas fa-films'></i>
			Create Animation
		</button>
		<button id='create-folder'>
			<i class='fas fa-folder'></i>
			Create Folder
		</button>
	</div>
	<div class='header-search flexrow pl-1'>
		<i class='fas fa-search'></i>
		<input
			bind:value={search}
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
			'>
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
