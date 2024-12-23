<script lang='ts'>
	import type { ArrayAnimationSet } from 'src/extensions';
	import { getContext } from 'svelte';

	const { application } = getContext('#external');

	let name = '';
	let type = 'ranged';
	let location = 'user';

	function makeAnimation() {
		if (location === 'world') {
			window.pf2eGraphics.liveSettings.globalAnimations = [
				...window.pf2eGraphics.liveSettings.globalAnimations,
				{
					name,
					data: [],
					key: '',
					source: 'world',
				},
			];
		} else if (location === 'user') {
			game.user.setFlag('pf2e-graphics', 'animations', [
				...(game.user.getFlag<ArrayAnimationSet[]>('pf2e-graphics', 'animations') || []),
				{
					name,
					user: game.userId,
					data: [],
					key: '',
					source: 'user',
				},
			]);
		}

		application.close();
	}
</script>

<main class='space-y-1'>
	<label class='flex gap-2'>
		<span class='self-center basis-1/3'> Name </span>
		<input
			bind:value={name} type='text'
			class='basis-2/3 capitalize'
			placeholder='{type} Animation'
		/>
	</label>
	<label class='flex gap-2'>
		<span class='self-center basis-1/3'> Type </span>
		<select class='basis-2/3' bind:value={type}>
			<option value='ranged'>Ranged</option>
			<option value='melee'>Melee</option>
			<option value='token'>On Token</option>
			<option value='template'>Template</option>
			<option value='custom'>Custom</option>
		</select>
	</label>
	{#if window.game.user.isGM}
		<label class='flex gap-2'>
			<span class='self-center basis-1/3'> Location </span>
			<select class='basis-2/3' bind:value={location}>
				<option value='user'>User</option>
				<option value='world'>World</option>
			</select>
		</label>
	{/if}
</main>

<footer class='mt-2'>
	<button on:click={makeAnimation}>
		<i class='fas fa-check'></i>
		Create New Animation
	</button>
</footer>
