<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import { writableDerived } from '@typhonjs-fvtt/runtime/svelte/store/writable-derived'
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import { devMessage } from 'src/utils'
	import AnimationEditor from 'src/view/_components/AnimationEditor.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let doc: TJSDocument<ActorPF2e>

	const flag = writableDerived(
		doc,
		$doc => $doc.getFlag('pf2e-graphics', 'customAnimations') || {},
		(data, doc) => {
			function changeValue(obj: Record<string, any>) {
				if (typeof obj === 'object') {
					// iterating over the object using for..in
					for (const key in obj) {
						if (obj[key] === null) {
							if (key.startsWith('-=')) {
								delete obj[key]
								continue
							}
							obj[`-=${key}`] = null
							delete obj[key]
						} else if (typeof obj[key] === 'object') {
							changeValue(obj[key])
						}
					}
				}
				return obj
			}

			doc.setFlag('pf2e-graphics', 'customAnimations', changeValue(data))
			return doc
		},
	) as Writable<Record<string, Exclude<JSONData[string], string>>>

	const sessionStorage = getContext('#external').sessionStorage
	const showNewAnimation = sessionStorage.getStore('showNewAnimation', false)
	let newKey = ''

	function createAnimation() {
		if (!newKey.length) throw ui.notifications.error('Primary roll option must not be empty!')
		$flag[newKey.trim()] = []
		$showNewAnimation = !$showNewAnimation
	}

	$: devMessage(`Actor Animations Tab State (${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()})`, $flag, $showNewAnimation)

	const editable = $doc.canUserModify(game.user, 'update')
</script>

<div class='p-2 pb-0 flex flex-col h-full items-center'>
	<div class='flex flex-col w-full items-center gap-1.5'>
		{#each Object.keys($flag).filter(k => Boolean($flag[k])) as key}
			<AnimationEditor bind:key bind:value={$flag[key]} {editable} />
		{/each}
	</div>
	<div class='w-1/2 m-1 text-center items-center flex flex-col gap-1'>
		{#if editable}
			{#if !$showNewAnimation}
				<button on:click={() => ($showNewAnimation = !$showNewAnimation)}>
					<i class='fas fa-plus' />
					Create New Animation
				</button>
			{:else}
				<span class='px-1'> Input the primary roll option. </span>
				<div class='flex w-full gap-1'>
					<input
						type='text'
						bind:value={newKey}
						placeholder={window.Sequencer.Helpers.random_array_element(AnimCore.getKeys())}
					/>
					<button
						data-tooltip='pf2e-graphics.cancel'
						class='fa fa-times w-min m-0'
						on:click={() => ($showNewAnimation = !$showNewAnimation)}
					/>
				</div>
				<button class="" on:click={createAnimation}>
					<i class='fas fa-check' />
					Submit
				</button>
			{/if}
		{:else}
			<i class='opacity-50'>No permissions to edit.</i>
		{/if}
	</div>
</div>
