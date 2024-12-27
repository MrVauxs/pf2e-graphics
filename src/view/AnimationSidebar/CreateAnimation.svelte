<script lang='ts'>
	import { getContext } from 'svelte';
	import { i18n } from '../../utils';
	import { makeAnimation } from './sidebarFunctions';

	const { application } = getContext('#external');

	let name = '';
	let type = 'ranged';
	let location = 'user';

	function make() {
		makeAnimation(name, type, location);
		application.close();
	}
</script>

<main class='space-y-1'>
	<label class='flex gap-2'>
		<span class='self-center basis-1/3'>
			{i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.popup.fields.name.title')}
		</span>
		<input
			bind:value={name}
			type='text'
			class='basis-2/3 capitalize'
			placeholder={i18n(
				'pf2e-graphics.sidebar.animationSets.create.animationSet.popup.fields.name.placeholder',
				{ type: i18n(`pf2e-graphics.presetTypes.${type}`) },
			)}
		/>
	</label>
	<label class='flex gap-2'>
		<span class='self-center basis-1/3'>
			{i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.popup.fields.type.title')}
		</span>
		<select class='basis-2/3' bind:value={type}>
			<option value='ranged'>{i18n('pf2e-graphics.presetTypes.ranged')}</option>
			<option value='melee'>{i18n('pf2e-graphics.presetTypes.melee')}</option>
			<option value='onToken'>{i18n('pf2e-graphics.presetTypes.onToken')}</option>
			<option value='template'>{i18n('pf2e-graphics.presetTypes.template')}</option>
			<option value='custom'>{i18n('pf2e-graphics.presetTypes.custom')}</option>
		</select>
	</label>
	{#if window.game.user.isGM}
		<label class='flex gap-2'>
			<span class='self-center basis-1/3'> {i18n('pf2e-graphics.scopes.scope')} </span>
			<select class='basis-2/3' bind:value={location}>
				<option value='user'>{i18n('pf2e-graphics.scopes.short.user')}</option>
				<option value='world'>{i18n('pf2e-graphics.scopes.short.world')}</option>
			</select>
		</label>
	{/if}
</main>

<footer class='mt-2'>
	<button on:click={make}>
		<i class='fas fa-check'></i>
		{i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.popup.complete')}
	</button>
</footer>
