<script lang='ts'>
	import type { Writable } from 'svelte/store';
	import { AnimCore } from 'src/storage/animCore';
	import { arrayMove, camelToSpaces, ErrorMsg, i18n, nonNullable } from 'src/utils';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import Separator from './Separator.svelte';

	export let key: string;
	export let value: JSONData[string];
	export let flag: Writable<JSONData>;
	export let disabled: boolean = false;

	let isReference = typeof value === 'string';
	$: isReference = typeof value === 'string';
	let hidden = window.pf2eGraphics.liveSettings.dev;

	function convertToReference() {
		if (!isReference) {
			foundry.applications.api.DialogV2.confirm({
				content: i18n('confirmConvert'),
				rejectClose: false,
				modal: true,
			}).then((x) => {
				if (!x) return;
				value = '';
			});
		} else {
			value = [AnimCore.CONST.TEMPLATE_ANIMATION()];
		}
	}

	function bindJSON(event: Event, obj: Record<string, any>, prop: string) {
		try {
			obj[prop] = JSON.parse((event.target as HTMLInputElement).value);
			$flag = $flag;
		} catch {
			throw new ErrorMsg('Invalid JSON!');
		}
	}

	function addNewAnimation() {
		if (typeof value === 'string')
			throw new ErrorMsg('Trying to push a new animation into a reference!');

		value = [...value, (AnimCore.CONST.TEMPLATE_ANIMATION())];
	}

	function remove() {
		foundry.applications.api.DialogV2.confirm({
			content: i18n('areYouSureM8'),
			rejectClose: false,
			modal: true,
		}).then((x) => {
			if (!x) return;
			// @ts-ignore Explicit Deletion
			$flag[key] = null;
		});
	}

	function removeSub(index: number) {
		foundry.applications.api.DialogV2.confirm({
			content: i18n('areYouSureM8'),
			rejectClose: false,
			modal: true,
		}).then((x) => {
			if (!x || typeof value === 'string') return;
			value.splice(index, 1);
			value = value;
		});
	}

	function dragStart(event: DragEvent, index: Number) {
		const data = { indexFrom: index };
		event.dataTransfer?.setData('text/plain', JSON.stringify(data));
	}

	function drop(event: DragEvent, indexTo: number) {
		event?.preventDefault();
		const json = event.dataTransfer?.getData('text/plain');
		const { indexFrom } = JSON.parse(String(json));

		if (disabled || typeof value === 'string' || !nonNullable(indexFrom) || indexFrom === indexTo) return;

		value = arrayMove(value, indexFrom, indexTo);
	}

	// @ts-expect-error TODO: Yes it does.
	const dbEntries = window.Sequencer.Database.entries;
	const macroEntries = [
		...window.game.packs.filter(x => x.metadata.type === 'Macro').flatMap(x => Array.from(x.index)).map(x => x.uuid),
		...window.game.macros.contents.map(x => x.uuid),
	];
	const wrapTooltipText = (text: string) => `<div class='pf2e-g'>${i18n(`editor.tooltip.${text}`)}</div>`;
</script>

{#if nonNullable(value)}
	<section class='
		border border-solid border-slate-600 rounded-sm
		bg-slate-300 bg-opacity-50
		w-full px-1 py-2
	'>
		<header class='flex text-lg items-center px-1'>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<i
				class='fa fa-chevron-{!hidden ? 'down' : 'up'} pr-2'
				on:click={() => hidden = !hidden}
				role='button'
				tabindex='-1'
			></i>
			<div>{key}</div>
			<div class='flex flex-grow justify-end gap-1'>
				{#if isReference}
					<input
						{disabled}
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
				<div class='flex'>
					<button
						{disabled}
						class='
							pseud-button
							fa{isReference ? '' : '-regular'} fa-clone
						'
						data-tooltip='pf2e-graphics.reference'
						on:click={convertToReference}
						tabindex='-1'
					></button>
					{#if !isReference}
						<button
							{disabled}
							class='
								pseud-button
								fas fa-add
							'
							data-tooltip='pf2e-graphics.addAnim'
							on:click={addNewAnimation}
							tabindex='-1'
						></button>
					{/if}
					<button
						{disabled}
						class='
							pseud-button
							fa fa-trash-can
						'
						data-tooltip='Delete'
						on:click={remove}
						tabindex='-1'
					></button>
				</div>
			</div>
		</header>
		{#if !isReference && typeof value !== 'string' && hidden}
			<div
				transition:slide
				class='[&>*]:bg-slate-300 [&>*]:bg-opacity-80 [&>*]:rounded-sm'
			>
				<hr />
				{#if !value.length}
					<div class='text-center w-full opacity-50 pb-2'>
						<i>There's nothing here. This may be done on purpose to disable a preset animation.</i>
					</div>
				{:else}
					{#each value as ani, index (ani)}
						<section
							animate:flip={{ duration: 250 }}
							class='
								flex flex-col gap-1.5
								overflow-clip p-1.5 my-1
								border border-solid border-slate-600
								[&>*]:w-full
							'
							role='group'
							draggable={Boolean(value.length - 1)}
							on:dragstart={event => dragStart(event, index)}
							on:drop={event => drop(event, index)}
						>
							{(ani.options ??= {}) && ''}
							<header class='flex justify-between gap-1.5'>
								<!-- Preset -->
								<label class='flex items-center gap-2'>
									<span
										class='mr-1 text-nowrap'
										data-tooltip={wrapTooltipText('preset')}
									>
										{i18n('editor.preset')}
									</span>
									<select bind:value={ani.preset} {disabled} required
										class='h-7'>
										{#each AnimCore.CONST.PRESETS as preset}
											<option value={preset}>{camelToSpaces(preset).titleCase()}</option>
										{/each}
									</select>
								</label>

								<!-- Trigger -->
								<label class='flex items-center gap-2' for='trigger'>
									<span
										class='mr-1 text-nowrap'
										data-tooltip={wrapTooltipText('trigger')}
									>
										{i18n('editor.trigger')}
									</span>
									{#if Array.isArray(ani.trigger)}
										<div class='p-1 text-center text-opacity-50 text-slate-600 rounded-sm'>
											<i>{i18n('editor.triggerDisclaimer')}</i>
										</div>
									{:else}
										<select
											{disabled}
											bind:value={ani.trigger}
											required
											class='h-7 p-0 max-h-60 resize-y overflow-y-auto'
										>
											{#if ani.preset === 'template'}
												<option value='place-template'>{i18n(`triggers.place-template`)}</option>
											{:else}
												{#each AnimCore.CONST.TRIGGERS as trigger}
													<option value={trigger}>{i18n(`triggers.${trigger}`)}</option>
												{/each}
											{/if}
										</select>
									{/if}
								</label>

								<!-- Predicate -->
								<label class='flex items-center gap-2'>
									<span
										class='mr-1 text-nowrap'
										data-tooltip={wrapTooltipText('predicate')}
									>
										{i18n('editor.predicate')}
									</span>
									<input
										{disabled}
										type='text'
										value={JSON.stringify(ani.predicate || [])}
										on:change={e => bindJSON(e, ani, 'predicate')}
									/>
								</label>

								<!-- Delete (Finally) -->
								<button
									class='fa fa-trash w-8'
									data-tooltip='Delete'
									on:click={() => removeSub(index)}
								></button>
							</header>

							{#if ani.preset === 'macro'}
								<label class='flex items-center gap-1 col-span-4'>
									<span
										class='mr-1 text-nowrap'
										data-tooltip={wrapTooltipText('macro')}
									>
										{i18n('editor.macro')}
									</span>
									<div class='w-full relative'>
										<input
											{disabled}
											type='text'
											placeholder={window.Sequencer.Helpers.random_array_element(macroEntries)}
											bind:value={ani.macro}
										/>
									</div>
								</label>
							{:else}
								<!-- Image File -->
								<label class='flex items-center gap-1 col-span-4'>
									<span
										class='mr-1 text-nowrap'
									>
										{i18n('editor.imageFile')}
									</span>
									<div class='w-full relative'>
										{#if ani.file?.includes('/')}
											<i
												class='
													fa fa-warning
													absolute text-base right-2 top-px leading-6 text-center
												'
												data-tooltip='pf2e-graphics.editor.notDb'
											></i>
											<i
												class='
													fa fa-warning
													animate-ping
													absolute text-base right-2 top-px leading-6 text-center
												'
												data-tooltip='pf2e-graphics.editor.notDb'
											></i>
										{/if}
										<input
											{disabled}
											type='text'
											class='pr-6'
											placeholder={window.Sequencer.Helpers.random_array_element(dbEntries.jb2a ?? [{ dbPath: 'No JB2A entries?! Enable at least one of them!' }]).dbPath}
											bind:value={ani.file}
										/>
									</div>
									<button
										class='fas fa-database w-min leading-6'
										data-tooltip='SEQUENCER.SidebarButtons.Database'
										on:click={() => window.Sequencer.DatabaseViewer.show()}
									></button>
									<!-- svelte-ignore missing-declaration -->
									<button
										class='fas fa-file-import fa-fw w-min leading-6'
										data-tooltip='FILES.BrowseTooltip'
										on:click={() => {
											new FilePicker({
												type: 'imagevideo',
												callback: (v) => {
													ani.file = v;
												},
												current: ani.file,
											}).render();
										}}
									></button>
								</label>
								{#if Array.isArray(ani.options.sound)}
									<div class='p-1 text-center text-opacity-50 text-slate-600 border border-solid rounded-sm'>
										<i>{i18n('editor.soundDisclaimer')}</i>
									</div>
								{:else}
									<!-- Sound File -->
									<label class='flex items-center gap-1 col-span-4 relative'>
										<span
											class='mr-1 text-nowrap'
										>
											{i18n('editor.soundFile')}
										</span>
										<div class='w-full relative'>
											{#if ani.options.sound?.file?.includes('/')}
												<i
													class='
														fa fa-warning
														absolute text-base right-2 top-px leading-6 text-center
													'
													data-tooltip='pf2e-graphics.editor.notDb'
												></i>
												<i
													class='
														fa fa-warning
														animate-ping
														absolute text-base right-2 top-px leading-6 text-center
													'
													data-tooltip='pf2e-graphics.editor.notDb'
												></i>
											{/if}
											<input
												{disabled}
												type='text'
												class='pr-6'
												placeholder={window.Sequencer.Helpers.random_array_element(dbEntries['graphics-sfx']).dbPath}
												value={ani.options.sound?.file || ''}
												on:change={(ev) => {
													ani.options.sound ??= {};
													ani.options.sound.file = ev.currentTarget.value;
												}}
											/>
										</div>
										<button
											class='fas fa-database w-min leading-6'
											data-tooltip='SEQUENCER.SidebarButtons.Database'
											on:click={() => window.Sequencer.DatabaseViewer.show()}
										></button>
										<!-- svelte-ignore missing-declaration -->
										<button
											class='fas fa-file-import fa-fw w-min leading-6'
											data-tooltip='FILES.BrowseTooltip'
											on:click={() => {
												new FilePicker({
													type: 'audio',
													callback: (v) => {
														ani.options.sound ??= {};
														ani.options.sound.file = v;
													},
													current: ani.options.sound?.file,
												}).render();
											}}
										></button>
									</label>
								{/if}
								<Separator>
									{i18n('editor.advancedOptions')}
								</Separator>
								<!-- Booleans -->
								<div class='flex justify-evenly flex-wrap'>
									<label class='flex items-center gap-1 text-nowrap'>
										<span
											class='mr-1 text-nowrap'
											data-tooltip={wrapTooltipText('persistent')}
										>
											{i18n('editor.persistent')}
										</span>
										<input {disabled} type='checkbox' bind:checked={ani.options.persist} />
									</label>
									{#if ani.options.persist}
										<label class='flex items-center gap-1 text-nowrap'>
											<span
												class='mr-1 text-nowrap'
												data-tooltip={wrapTooltipText('tieToDocuments')}
											>
												{i18n('editor.tieToDocuments')}
											</span>
											<input {disabled} type='checkbox' bind:checked={ani.options.tieToDocuments} />
										</label>
									{/if}
									<label class='flex items-center gap-1 text-nowrap'>
										<span
											class='mr-1 text-nowrap'
											data-tooltip={wrapTooltipText('masked')}
										>
											{i18n('editor.masked')}
										</span>
										<input {disabled} type='checkbox' bind:checked={ani.options.mask} />
									</label>
									<label class='flex items-center gap-1 text-nowrap'>
										<span
											class='mr-1 text-nowrap'
											data-tooltip={wrapTooltipText('belowTokens')}
										>
											{i18n('editor.belowTokens')}
										</span>
										<input {disabled} type='checkbox' bind:checked={ani.options.belowTokens} />
									</label>
									<div class='flex justify-evenly w-full'>
										<label class='flex items-center gap-1 text-nowrap'>
											<span
												class='mr-1 text-nowrap'
												data-tooltip={wrapTooltipText('randomizeMirrorX')}
											>
												{i18n('editor.randomizeMirrorX')}
											</span>
											<input {disabled} type='checkbox' bind:checked={ani.options.randomizeMirrorX} />
										</label>
										<label class='flex items-center gap-1 text-nowrap'>
											<span
												class='mr-1 text-nowrap'
												data-tooltip={wrapTooltipText('randomizeMirrorY')}
											>
												{i18n('editor.randomizeMirrorY')}
											</span>
											<input {disabled} type='checkbox' bind:checked={ani.options.randomizeMirrorY} />
										</label>
										<label class='flex items-center gap-1 text-nowrap'>
											<span
												class='mr-1 text-nowrap'
												data-tooltip={wrapTooltipText('mirrorX')}
											>
												{i18n('editor.mirrorX')}
											</span>
											<input {disabled} type='checkbox' bind:checked={ani.options.mirrorX} />
										</label>
										<label class='flex items-center gap-1 text-nowrap'>
											<span
												class='mr-1 text-nowrap'
												data-tooltip={wrapTooltipText('mirrorY')}
											>
												{i18n('editor.mirrorY')}
											</span>
											<input {disabled} type='checkbox' bind:checked={ani.options.mirrorY} />
										</label>
									</div>
								</div>
								<!-- Delays -->
								<div class='flex justify-between gap-2'>
									<label class='flex items-center gap-1 text-nowrap'>
										<span
											class='mr-1 text-nowrap'
											data-tooltip={wrapTooltipText('delay')}
										>
											{i18n('editor.delay')}
										</span>
										<input {disabled} type='number'
											placeholder='1000 (ms)'
											bind:value={ani.options.delay}
										/>
									</label>
									<label class='flex items-center gap-1 text-nowrap'>
										<span
											class='mr-1 text-nowrap'
											data-tooltip={wrapTooltipText('waitUntilFinished')}
										>
											{i18n('editor.waitUntilFinished')}
										</span>
										<input {disabled} type='number'
											placeholder='-1000 (ms)'
											bind:value={ani.options.waitUntilFinished}
										/>
									</label>
								</div>
								<!-- Fade -->
								<div class='flex justify-between gap-2'>
									<label class='flex items-center gap-1 text-nowrap'>
										<span
											class='mr-1 text-nowrap'
											data-tooltip={wrapTooltipText('fadeIn')}
										>
											{i18n('editor.fadeIn')}
										</span>
										<input {disabled} type='number'
											placeholder='1000 (ms)'
											bind:value={ani.options.fadeIn}
										/>
									</label>
									<label class='flex items-center gap-1 text-nowrap'>
										<span
											class='mr-1 text-nowrap'
											data-tooltip={wrapTooltipText('fadeOut')}
										>
											{i18n('editor.fadeOut')}
										</span>
										<input {disabled} type='number'
											placeholder='1000 (ms)'
											bind:value={ani.options.fadeOut}
										/>
									</label>
								</div>
								<!-- Scale -->
								{#if ani.preset !== 'ranged'}
									<div class='flex justify-between gap-2'>
										<label class='flex items-center gap-1 text-nowrap'>
											<span
												class='mr-1 text-nowrap'
												data-tooltip={wrapTooltipText('scale')}
											>
												{i18n('editor.scale')}
											</span>
											<input {disabled} type='number'
												min='0.1'
												step='0.1'
												placeholder='2'
												bind:value={ani.options.scale}
											/>
										</label>
										<label class='flex items-center gap-1 text-nowrap'>
											<span
												class='mr-1 text-nowrap'
												data-tooltip={wrapTooltipText('scaleToObject')}
											>
												{i18n('editor.scaleToObject')}
											</span>
											<input {disabled} type='number'
												min='0.1'
												step='0.1'
												placeholder='1.5'
												bind:value={ani.options.scaleToObject}
											/>
										</label>
										<!-- <label class='flex items-center gap-1 text-nowrap'>
											<span
												class='mr-1 text-nowrap'
												data-tooltip={wrapTooltipText('size')}
											>
												{i18n('editor.size')}
											</span>
											{#if ani.options.size?.gridUnits}
												<input {disabled} type='number'
													placeholder='1 (square)'
													bind:value={ani.options.size.value}
												/>
											{:else}
												<input {disabled} type='number'
													placeholder='100 (px)'
													bind:value={ani.options.size}
												/>
											{/if}
											<input {disabled} type='checkbox'
												data-tooltip={wrapTooltipText('gridUnits')}
												value={ani.options.size.gridUnits}
												on:change={(ev) => {
													const bool = ev.currentTarget?.checked;
													if (bool) {
														ani.options.size = { value: Number(ani.options.size), gridUnits: true };
													} else {
														ani.options.size = ani.options.size?.value || undefined;
													}
												}}
											/>
										</label> -->
									</div>
								{/if}
							{/if}
						</section>
					{/each}
				{/if}
			</div>
		{/if}
	</section>
{/if}

<style lang='postcss'>
	.pseud-button {
		@apply p-1 border border-solid rounded-sm transition-colors size-8;
	}
</style>
