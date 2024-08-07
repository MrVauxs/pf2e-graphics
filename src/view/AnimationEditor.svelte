<script lang='ts'>
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import SubAnimationEditor from './SubAnimationEditor.svelte'

	export let key: string
	export let value: Exclude<JSONData[string], string>

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
				// @ts-ignore Explicitly a deletion thing
				value = null
			},
		})
	}
</script>

<div class='border border-solid bg-slate-300 bg-opacity-50 w-full rounded-sm p-2.5'>
	<label class='flex items-center gap-1'>
		<span>Primary Roll Option:</span>
		<input type='text' value={key} disabled class='w-min text-center' />

		<div class='ml-auto flex items-center'>
			<button
				on:click={() => {
					value = [...value, AnimCore.CONST.TEMPLATE_ANIMATION()]
				}}
				class='w-min text-nowrap items-center'
			>
				<i class='fa fa-plus' />
				New Child Animation
			</button>
			<button on:click={deleteAnimation} class='fa fa-trash-can size-8' />
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
