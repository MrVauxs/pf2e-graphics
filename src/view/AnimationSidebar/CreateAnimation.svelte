<script lang='ts'>
	import type { AnimationSetDocument } from 'schema';
	import type { AnimationPresetType } from './sidebarFunctions';
	import { getContext, untrack } from 'svelte';
	import { ErrorMsg, i18n } from '../../utils';
	import { makeAnimation, openAnimation } from './sidebarFunctions';

	interface Props {
		mode: 'make' | 'copy';
		animation: AnimationSetDocument | undefined;
	}

	let { mode, animation }: Props = $props();

	const { application } = getContext('#external');

	// Seeds the editable field once; the dialog's props are fixed for its lifetime, and re-deriving
	// this would discard whatever the user has typed.
	let name = $state(untrack(() => `${animation?.name || ''}${mode === 'copy' ? ' (Copy)' : ''}`));
	let type = $state('ranged');
	let location: AnimationSetDocument['source'] = $state('user');

	let defaultName = $derived(i18n(
		'pf2e-graphics.sidebar.animationSets.create.animationSet.popup.fields.name.placeholder',
		{ type: i18n(`pf2e-graphics.presetTypes.${type}`) },
	));

	function make() {
		const newAnimation = makeAnimation(name || defaultName, type as AnimationPresetType, location);
		openAnimation(newAnimation);
		application.close();
	}

	function copy() {
		if (!animation) throw ErrorMsg.send('Attempted to copy no animation?'); // TODO: i18n

		const newAnimation = makeAnimation(
			name,
			type as AnimationPresetType,
			location,
			foundry.utils.deepClone(animation),
		);
		openAnimation(newAnimation);
		application.close();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
	class='space-y-1'
	onkeypress={(e) => {
		if (e.key === 'Enter') mode === 'copy' ? copy() : make();
	}}
>
	<label class='flex gap-2'>
		<span class='self-center basis-1/3'>
			{i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.popup.fields.name.title')}
		</span>
		<input
			bind:value={name}
			type='text'
			class='basis-2/3'
			placeholder={defaultName}
		/>
	</label>
	{#if mode === 'make'}
		<label class='flex gap-2'>
			<span class='self-center basis-1/3'>
				{i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.popup.fields.type.title')}
			</span>
			<select class='basis-2/3' bind:value={type}>
				<option value='custom'>{i18n('pf2e-graphics.presetTypes.custom')}</option>
				<option value='ranged'>{i18n('pf2e-graphics.presetTypes.ranged')}</option>
				<option value='melee'>{i18n('pf2e-graphics.presetTypes.melee')}</option>
				<option value='onToken'>{i18n('pf2e-graphics.presetTypes.onToken')}</option>
				<option value='template'>{i18n('pf2e-graphics.presetTypes.template')}</option>
			</select>
		</label>
	{/if}
	{#if game.user.isGM}
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
	<button onclick={() => (mode === 'copy' ? copy() : make())}>
		<i class='fas fa-check'></i>
		{i18n('pf2e-graphics.sidebar.animationSets.create.animationSet.popup.complete')}
	</button>
</footer>
