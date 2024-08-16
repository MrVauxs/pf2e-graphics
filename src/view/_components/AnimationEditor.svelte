<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import derivedFlag from 'src/lib/docFlagDerived'
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import { type Writable, writable } from 'svelte/store'
	import { ErrorMsg } from 'src/utils'
	import JSONEditorApp from './JSONEditor/JSONEditor'
	import SingleEditor from './SingleEditor.svelte'

	export let doc: TJSDocument<ActorPF2e | ItemPF2e | UserPF2e> | Writable<{ id: 'settings' }>
	export function createAnimation() {}

	const flag = $doc.id === 'settings'
		? window.pf2eGraphics.storeSettings.getWritableStore('worldAnimations') as Writable<JSONData>
		// @ts-ignore Above is a type guard
		: derivedFlag(doc, 'pf2e-graphics', 'customAnimations', {} as JSONData, 1000)

	if (!flag) throw new ErrorMsg('No document was provided to AnimationEditor?!')

	let search = ''
	let newAnimeKey = ''
	const inStasis = writable(false)

	function openJSON() {
		new JSONEditorApp({
			id: `pf2e-graphics-${$doc.id}`,
			store: flag,
			stasis: inStasis,
			permission: 'canUserModify' in $doc ? $doc.canUserModify(game.user, 'update') : true,
		}).render(true)
	}

	function addNew() {
		if (newAnimeKey.trim().length) {
			$flag[newAnimeKey.trim()] ??= [AnimCore.CONST.TEMPLATE_ANIMATION()]
			newAnimeKey = ''
		} else if ('getRollOptions' in $doc) {
			const prefix = $doc.isOfType('weapon') ? 'item' : undefined
			newAnimeKey = (($doc as ItemPF2e).getRollOptions(prefix))[2]
		} else {
			newAnimeKey = ' '
		}
	}
</script>

<div class='
	flex
	border border-solid rounded-sm
	mb-1 p-1
'>
	<div class='[&>*:not(:first-child)]:mx-1 my-auto'>
		<span><i class='fa fa-search' /> Search</span><input bind:value={search} />
	</div>

	<button
		class='fa fa-brackets-curly size-8 ml-auto'
		data-tooltip='pf2e-graphics.jsonEditor'
		on:click={openJSON}
	/>
	{#if newAnimeKey.length}
		<input bind:value={newAnimeKey} />
	{/if}
	<button
		class='fa fa-add size-8 text-lg leading-4'
		data-tooltip='pf2e-graphics.addAnim'
		on:click={addNew}
		disabled={$inStasis}
	/>
</div>
<div class='flex flex-col gap-1'>
	{#each Object.keys($flag).filter(k => k.includes(search)) as key}
		<SingleEditor
			bind:key
			bind:value={$flag[key]}
			bind:disabled={$inStasis}
			flag={flag}
		/>
	{/each}
</div>
