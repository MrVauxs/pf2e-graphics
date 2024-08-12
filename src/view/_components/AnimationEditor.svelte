<script lang='ts'>
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import { writable } from 'svelte/store'
	import { onDestroy } from 'svelte'
	import SubAnimationEditor from './SubAnimationEditor.svelte'
	import JSONEditorApp from './JSONEditor/JSONEditor'

	export let key: string
	export let editable: boolean = true
	export let value: Exclude<JSONData[string], string>
	export let deleteFn: false | ((key: string) => void) = false

	async function deleteSubAnimation(animation: Exclude<JSONData[string], string>[number]) {
		Dialog.confirm({
			content: `Are you sure you want to delete this animation?`,
			title: 'Confirm Deletion',
			yes: () => {
				value = value.filter(x => x !== animation)
			},
		})
	}

	async function deleteAnimation() {
		Dialog.confirm({
			content: `Are you sure you want to delete all animations under "${key}"?`,
			title: 'Confirm Deletion',
			yes: () => {
				if (deleteFn) {
					deleteFn(key)
				} else {
					// @ts-ignore Explicitly a deletion thing
					value = null
				}
			},
		})
	}

	const store = writable(value)
	store.subscribe((v) => { value = v })

	$: store.set(value)

	let app: null | JSONEditorApp = null
	async function exportWindow() {
		app = new JSONEditorApp(
			{ data: { store, key } },
		).render(true, {
			focus: true,
		})
	}

	onDestroy(() => {
		app?.close({ force: true })
	})
</script>

<div class='border border-solid bg-slate-300 bg-opacity-50 w-full rounded-sm p-2.5'>
	<label class='flex items-center gap-1'>
		<span>Primary Roll Option:</span>
		<input type='text' value={key} disabled class='w-min text-center' />

		<div class='ml-auto flex items-center'>
			{#if editable}
				<button
					on:click={() => {
						value = [...value, AnimCore.CONST.TEMPLATE_ANIMATION()]
					}}
					class='w-min text-nowrap items-center'
				>
					<i class='fa fa-plus' />
					New Child Animation
				</button>
			{/if}
			<button data-tooltip='pf2e-graphics.export' on:click={exportWindow} class='fa fa-brackets-curly size-8' />
			<button data-tooltip='Delete' on:click={deleteAnimation} class='fa fa-trash-can size-8' />
		</div>
	</label>

	{#if value.length}
		<hr />
		<div class='flex flex-col gap-1.5'>
			{#each value as animation}
				<SubAnimationEditor bind:animation {deleteSubAnimation} />
			{/each}
		</div>
	{/if}
</div>
