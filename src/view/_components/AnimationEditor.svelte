<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import derivedFlag from 'src/lib/docFlagDerived'
	import type { JSONData } from 'src/storage/AnimCore'
	import JSONEditorApp from './JSONEditor/JSONEditor'
	import SingleEditor from './SingleEditor.svelte'

	export let doc: TJSDocument<ActorPF2e | ItemPF2e | UserPF2e>
	export function createAnimation() {}

	const flag = derivedFlag(doc, 'pf2e-graphics', 'customAnimations', {} as JSONData, 1000)

	let search = ''

	function openJSON() {
		new JSONEditorApp({
			id: `pf2e-graphics-${$doc.id}`,
			store: flag,
			permission: $doc.canUserModify(game.user, 'update'),
		}).render(true)
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

	<button class='fa fa-brackets-curly size-8 ml-auto' on:click={() => openJSON()} />
</div>
<div>
	{#each Object.keys($flag).filter(k => k.includes(search)) as key}
		<SingleEditor bind:key bind:value={$flag[key]} />
	{/each}
</div>
