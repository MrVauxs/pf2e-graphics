<script lang='ts'>
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import { ErrorMsg, i18n } from 'src/utils'

	export let key: string
	export let value: JSONData[string]

	let isReference = typeof value === 'string'
	$: isReference = typeof value === 'string'

	function convertToReference() {
		if (!isReference) {
			foundry.applications.api.DialogV2.confirm({
				content: i18n('confirmConvert'),
				rejectClose: false,
				modal: true,
			}).then((x) => {
				if (!x) return
				value = ''
			})
		} else {
			value = [AnimCore.CONST.TEMPLATE_ANIMATION()]
		}
	}

	function addNewAnimation() {
		if (typeof value === 'string') throw new ErrorMsg('Trying to push a new animation into a reference!')
		value = [...value, (AnimCore.CONST.TEMPLATE_ANIMATION())]
	}
</script>

<div class='
	border border-solid border-slate-600 rounded-sm
	bg-slate-300 bg-opacity-50
	w-full p-2
'>
	<header class='flex text-lg'>
		<div>{key}</div>
		<div class='flex flex-grow justify-end gap-1'>
			{#if isReference}
				<input
					class='
						mx-1 h-full
						text-sm truncate
						w-40 focus:w-1/2 transition-all
					'
					type='text'
					bind:value
					list='options'
				/>
				<datalist id='options'>
					{#each AnimCore.keys as key}
						<option value={key}>{key}</option>
					{/each}
				</datalist>
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<i
				class='
					hover:bg-slate-400
					pseud-button
					fa{isReference ? '' : '-regular'} fa-clone
				'
				data-tooltip='pf2e-graphics.reference'
				on:click={convertToReference}
				role='button'
				tabindex='-1'
			/>
			{#if !isReference}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<i
					class='
						hover:bg-slate-400
						pseud-button
						fas fa-add
					'
					data-tooltip='pf2e-graphics.addAnim'
					on:click={addNewAnimation}
					role='button'
					tabindex='-1'
				/>
			{/if}
		</div>
	</header>
	{#if !isReference}
		<hr />
		{#each value as ani}
			<div class='text-red-600'>{JSON.stringify(ani)}</div>
		{/each}
	{/if}
</div>

<style lang='postcss'>
	.pseud-button {
		@apply p-1 border border-solid rounded-sm transition-colors;
	}
</style>
