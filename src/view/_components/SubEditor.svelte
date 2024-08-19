<script lang='ts'>
	import { AnimCore, type AnimationDataObject, type ReferenceObject } from 'src/storage/AnimCore'
	import { ErrorMsg, camelToSpaces, i18n } from 'src/utils'

	export let ani: AnimationDataObject | ReferenceObject
	export let disabled: boolean
	export let flag

	function bindJSON(event: Event, obj: Record<string, any>, prop: string) {
		try {
			obj[prop] = JSON.parse((event.target as HTMLInputElement).value)
			$flag = $flag
		} catch {
			throw new ErrorMsg('Invalid JSON!')
		}
	}

	ani.options ??= {}
	ani.options.sound ??= {}
</script>

<header class='flex justify-between gap-1.5'>
	<!-- Preset -->
	<label class='flex items-center gap-2'>
		<span class='mr-1 text-nowrap'> {i18n('editor.preset')} </span>
		<select bind:value={ani.preset} {disabled}>
			{#each AnimCore.CONST.PRESETS as preset}
				<option value={preset}>{camelToSpaces(preset).titleCase()}</option>
			{/each}
		</select>
	</label>

	<!-- Trigger -->
	<label class='flex items-center gap-2'>
		<span class='mr-1 text-nowrap'> {i18n('editor.trigger')} </span>
		<select bind:value={ani.trigger} {disabled}>
			{#each AnimCore.CONST.TRIGGERS as trigger}
				<option value={trigger}>{i18n(`triggers.${trigger}`)}</option>
			{/each}
		</select>
	</label>

	<!-- Predicate -->
	<label class='flex items-center gap-2'>
		<span class='mr-1 text-nowrap'> {i18n('editor.predicate')} </span>
		<input
			{disabled}
			type='text'
			value={JSON.stringify(ani.predicate || [])}
			on:change={e => bindJSON(e, ani, 'predicate')}
		/>
	</label>
</header>

<!-- Image File -->
<label class='flex items-center gap-1 col-span-4'>
	<span class='mr-1 text-nowrap'>{i18n('editor.imageFile')}</span>
	<input
		{disabled}
		type='text'
		bind:value={ani.file}
	/>
	<button
		class='fas fa-database w-min leading-6'
		data-tooltip='SEQUENCER.SidebarButtons.Database'
		on:click={() => window.Sequencer.DatabaseViewer.show()}
	/>
</label>

{#if Array.isArray(ani.options.sound)}
	<div class='p-1 text-center text-opacity-50 text-slate-600 border border-solid rounded-sm'><i>This animation contains multiple sounds which are modifiable only through JSON editor.</i></div>
{:else}
	<!-- Sound File -->
	<label class='flex items-center gap-1 col-span-4'>
		<span class='mr-1 text-nowrap'>{i18n('editor.soundFile')}</span>
		<input
			{disabled}
			type='text'
			bind:value={ani.options.sound.file}
		/>
		<button
			class='fas fa-database w-min leading-6'
			data-tooltip='SEQUENCER.SidebarButtons.Database'
			on:click={() => window.Sequencer.DatabaseViewer.show()}
		/>
	</label>
{/if}

<div class='
	relative
	flex flex-col gap-1
	p-1
	border border-solid rounded-sm border-slate-400
	bg-slate-400/25
'>
	<button class='fa fa-chevron-down size-8 absolute -right-8 top-0' />
	<!-- Booleans -->
	<div class='flex justify-between'>
		<label class='flex items-center gap-1 text-nowrap'>
			<span>Persistent</span>
			<input {disabled} type='checkbox' bind:checked={ani.options.persist} />
		</label>
		<label class='flex items-center gap-1 text-nowrap'>
			<span>Masked</span>
			<input {disabled} type='checkbox' bind:checked={ani.options.mask} />
		</label>
		<label class='flex items-center gap-1 text-nowrap'>
			<span>Tie To Documents</span>
			<input {disabled} type='checkbox' bind:checked={ani.options.tieToDocuments} />
		</label>
	</div>

	<!-- Delays -->
	<div class='flex justify-between gap-2'>
		<label class='flex items-center gap-1 text-nowrap'>
			<span>Wait Until Finished</span>
			<input {disabled} type='number'
				placeholder='-1000 (ms)'
				bind:value={ani.options.waitUntilFinished}
			/>
		</label>
		<label class='flex items-center gap-1 text-nowrap'>
			<span>Wait</span>
			<input {disabled} type='number'
				placeholder='1000 (ms)'
				bind:value={ani.options.wait}
			/>
		</label>
		<label class='flex items-center gap-1 text-nowrap'>
			<span>Delay</span>
			<input {disabled} type='number'
				placeholder='1000 (ms)'
				bind:value={ani.options.delay}
			/>
		</label>
	</div>

</div>
