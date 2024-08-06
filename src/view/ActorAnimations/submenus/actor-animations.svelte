<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import { writableDerived } from '@typhonjs-fvtt/runtime/svelte/store/writable-derived'
	import type { moduleFlags } from 'src/extensions'
	import { AnimCore } from 'src/storage/AnimCore'
	import { devMessage, log } from 'src/utils'
	import AnimationCreator from 'src/view/AnimationCreator.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let doc: TJSDocument<ActorPF2e>

	// TODO: Fix this
	const flag = writableDerived(
		doc,
		$doc => $doc.getFlag('pf2e-graphics', 'customAnimations'),
		(data, doc) => {
			const diff = foundry.utils.diffObject(doc.flags['pf2e-graphics'], data)

			function changeValue(obj: Record<string, any>) {
				if (typeof obj === 'object') {
					// iterating over the object using for..in
					for (const key in obj) {
						if (obj[key] === null) {
							obj[`-=${key}`] = null
							delete obj[key]
						} else if (typeof obj[key] === 'object') {
							changeValue(obj[key])
						}
					}
				}
				return obj
			}

			doc.setFlag('pf2e-graphics', 'customAnimations', changeValue(diff))
			return doc
		},
	) as Writable<moduleFlags>

	$flag ??= {}
	$flag.customAnimations ??= {}

	const sessionStorage = getContext('#external').sessionStorage
	const showNewAnimation = sessionStorage.getStore('showNewAnimation', false)
	let newKey = ''

	function createAnimation() {
		if (!$flag?.customAnimations) throw log('Something went wrong, check with Vauxs!')
		if (!newKey.length) throw ui.notifications.error('Primary roll option must not be empty!')
		$flag.customAnimations[newKey] = []
		$showNewAnimation = !$showNewAnimation
	}

	function deleteAnimation(key: string) {
		if (!$flag?.customAnimations) throw log('Something went wrong, check with Vauxs!')
		// @ts-ignore Explicitly a deletion thing
		$flag.customAnimations[key] = null
	}

	$: devMessage('Actor Animations Tab', $flag.customAnimations, $showNewAnimation)
</script>

<div class='p-2 pb-0 flex flex-col h-full items-center'>
	{#if $flag.customAnimations}
		<div class='flex flex-col w-full items-center gap-1.5'>
			{#each Object.keys($flag.customAnimations).filter(x => Boolean($flag.customAnimations?.[x])) as key}
				<AnimationCreator
					{key}
					allAnimations={$flag.customAnimations}
					deleteSelf={deleteAnimation}
				/>
			{/each}
		</div>
		<div class='w-1/2 m-1 text-center items-center flex flex-col gap-1'>
			{#if !$showNewAnimation}
				<button on:click={() => $showNewAnimation = !$showNewAnimation}>
					<i class='fas fa-plus' />
					Create New Animation
				</button>
			{:else}
				<span class='px-1'> Input the primary roll option. </span>
				<div class='flex w-full gap-1'>
					<input
						type='text'
						bind:value={newKey}
						placeholder={Sequencer.Helpers.random_array_element(AnimCore.getKeys())}
					/>
					<button
						data-tooltip='pf2e-graphics.cancel'
						class='fa fa-times w-min m-0'
						on:click={() => $showNewAnimation = !$showNewAnimation} />
				</div>
				<button
					class=''
					on:click={createAnimation}
				>
					<i class='fas fa-check' />
					Submit
				</button>
			{/if}
		</div>
	{/if}
</div>
