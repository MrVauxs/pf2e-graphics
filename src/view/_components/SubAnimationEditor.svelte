<script lang='ts'>
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import { camelToSpaces, dev, i18n } from 'src/utils'
	import { slide } from 'svelte/transition'

	export let animation: Exclude<JSONData[string], string>[number]
	export let deleteSubAnimation

	function bindJSON(event: Event, prop: keyof typeof animation) {
		animation[prop] = JSON.parse((event.target as HTMLInputElement).value)
	}

	let open = dev || false

	animation.options ??= {}
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
			<input
				type='text'
				value={JSON.stringify(animation.predicate || [])}
				on:change={e => bindJSON(e, 'predicate')}
			/>
		</label>

		<div class='flex items-center gap-2 ml-auto text-nowrap'>
			<button data-tooltip='Delete' on:click={() => deleteSubAnimation(animation)} class='fa fa-trash-can size-8' />
		</div>
	</div>
	{#if open}
		<hr />
		<div class='grid grid-cols-4 gap-2 w-full p-1' transition:slide>
			<!-- File -->
			<label class='flex items-center gap-1 w-full col-span-4'>
				<span class='mr-1'>File</span>
				<input
					type='text'
					bind:value={animation.file}
				/>
				<!-- svelte-ignore missing-declaration -->
				<button
					class='fas fa-database w-min h-full'
					data-tooltip='SEQUENCER.SidebarButtons.Database'
					on:click={() => Sequencer.DatabaseViewer.show()}
				/>
			</label>
			<!-- Booleans -->
			<div class='col-span-4 flex'>
				<label class='flex items-center gap-1 w-full text-nowrap'>
					<span>Persistent</span>
					<input type='checkbox' bind:checked={animation.options.persist} />
				</label>
				<label class='flex items-center gap-1 w-full text-nowrap'>
					<span>Masked</span>
					<input type='checkbox' bind:checked={animation.options.mask} />
				</label>
				<label class='flex items-center gap-1 w-full text-nowrap'>
					<span>Tie To Documents</span>
					<input type='checkbox' bind:checked={animation.options.tieToDocuments} />
				</label>
			</div>
			<!-- Numbers -->
			<label class='flex items-center gap-1 w-full text-nowrap'>
				<span>Scale to Object</span>
				<input
					class='w-8'
					type='number'
					step='0.1'
					min='0.1'
					bind:value={animation.options.scaleToObject}
				/>
			</label>
			<label class='flex items-center gap-1 w-full text-nowrap'>
				<span>Fade In</span>
				<input
					class='w-8'
					type='number'
					step='100'
					bind:value={animation.options.fadeIn}
				/>
			</label>
			<label class='flex items-center gap-1 w-full text-nowrap'>
				<span>Fade Out</span>
				<input
					class='w-8'
					type='number'
					step='100'
					bind:value={animation.options.fadeOut}
				/>
			</label>
		</div>
	{/if}
</div>
