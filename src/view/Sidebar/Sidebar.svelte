<script>
	const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>

<div class='pf2e-g directory'>
	<header class='directory-header'>
		<div class='header-actions action-buttons flexrow'>
			<button>Test</button>
			<button>Test</button>
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
	<main>
		<ol class='directory-list'>
			{#each list as item}
				<li class='directory-item flexrow px-2 hover:bg-slate-400/10'>
					Item {item}
				</li>
			{/each}
		</ol>
	</main>
</div>
