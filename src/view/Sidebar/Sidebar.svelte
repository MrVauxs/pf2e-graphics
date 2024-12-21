<script>
	import { deslugify } from 'src/utils';

	const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
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
		<li class='directory-item flexrow px-2 hover:bg-slate-400/10'>
			{deslugify(item)}
		</li>
	{/each}

</ol>
<footer class='directory-footer'></footer>
