<script lang='ts'>
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import { camelToSpaces, i18n } from 'src/utils'

	export let animation: Exclude<JSONData[string], string>[number]
	export let deleteSelf: (a: typeof animation) => void

	let childCounter = 0
	function countOrDeleteChild(child: typeof animation) {
		childCounter += 1
		if (childCounter === 2) {
			deleteSelf(child)
			childCounter = 0
		}
	}

	let open = false
</script>

<div class='p-1.5 border border-solid rounded-sm border-opacity-50 border-gray-800'>
	<div class='flex gap-2 w-full'>
		<button class='size-8 fa fa-chevron-{open ? 'up' : 'down'} border-none' on:click={() => open = !open} />

		<label class='flex items-center gap-2'>
			<span>Preset</span>
			<select bind:value={animation.preset}>
				{#each AnimCore.CONST.PRESETS as preset}
					<option value={preset}>{camelToSpaces(preset).titleCase()}</option>
				{/each}
			</select>
		</label>

		<label class='flex items-center gap-2'>
			<span>Trigger</span>
			<select bind:value={animation.trigger}>
				{#each AnimCore.CONST.TRIGGERS as trigger}
					<option value={trigger}>{i18n(`triggers.${trigger}`)}</option>
				{/each}
			</select>
		</label>

		<label class='flex items-center gap-2'>
			<span>Predicate</span>
			<input type='text'
				value={JSON.stringify(animation.predicate || [])}
				on:change={e => animation.predicate = JSON.parse(e.target?.value)} />
		</label>

		<div class='flex items-center gap-2 ml-auto text-nowrap'>
			{#if childCounter === 1}
				<span>
					{i18n('areYouSureM8')}
				</span>
			{/if}
			<button
				class='fa fa-trash-can size-8 {childCounter === 1 ? 'bg-red-500' : ''}'
				data-tooltip={childCounter === 1 ? 'pf2e-graphics.areYouSureM8' : 'Delete'}
				on:click={() => countOrDeleteChild(animation)}
			/>
		</div>
	</div>
	{#if open}
		<hr />
		<div class='flex gap-2 w-full p-1'>
			<label class='flex items-center gap-2'>
				File
				<!-- eslint-disable-next-line no-self-assign -->
				<input type='text' bind:value={animation.file} on:change={() => animation = animation} />
			</label>
		</div>
	{/if}
</div>
