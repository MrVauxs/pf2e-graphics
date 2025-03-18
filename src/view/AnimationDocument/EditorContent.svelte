<script lang='ts'>
	import type { MacroPF2e } from 'foundry-pf2e';
	import type { AnimationSetDocument } from 'schema';
	import type { AnimationSetContentsItem } from 'schema/payload';
	import { TJSDialog } from '#runtime/svelte/application';
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
	import { ErrorMsg, isTrueish, log } from 'src/utils';
	import MultiSelect from 'svelte-multiselect';
	import { Animation, Crosshair, Graphic, Macro, Sound } from './execute';

	export let data: AnimationSetContentsItem;
	export let animation: AnimationSetDocument;
	export let readonly: boolean;

	log('Animation Document', animation);

	const options: (keyof AnimationSetContentsItem)[] = ['execute', 'label', 'triggers', 'predicates', 'overrides', 'removes'];
	$: remainingOptions = options.filter(x => !Object.keys(data).includes(x.toLowerCase()));
	let selection: keyof AnimationSetContentsItem = remainingOptions?.[0];
	$: selection = remainingOptions?.[0];

	function addSection() {
		if (selection === 'label') {
			data.label = 'animation-section';
		} else if (selection === 'triggers') {
			data.triggers = [];
		} else if (selection === 'predicates') {
			data.predicates = [];
		} else if (selection === 'removes') {
			data.removes = [];
		} else if (selection === 'execute') {
			data.execute = {};
		} else if (selection === 'overrides') {
			data.overrides = [];
		}
	}

	const macroDoc = new TJSDocument<MacroPF2e>();
	function onDrop(event: DragEvent) {
		if (readonly || data.execute?.type !== 'macro') return;
		try {
			const transfer = event.dataTransfer?.getData('text/plain');
			if (transfer) macroDoc.setFromDataTransfer(JSON.parse(transfer));
			if (macroDoc.get()?.collectionName !== 'macros') throw ErrorMsg.send('This isn\'t a macro!'); // TODO: i18n
			data.execute.document = macroDoc.get()?.uuid;
		} catch {}
	}

	function checkIfEmpty(object: object) {
		const entries = Object.entries(object)
			.filter(x => (Array.isArray(x[1]) ? x[1].length > 0 : true))
			.filter(x => x[0] !== 'type')
			.filter(x => isTrueish(x[1]));
		return entries.length === 0;
	}
</script>

<div class='flex flex-col gap-2 h-full py-1'>
	{#if !readonly}
		<header class='flex items-center grow-0'>
			<button class='w-min text-nowrap h-8' on:click={addSection} disabled={!selection}>
				<i class='fa fa-plus pr-1'></i>
				Add
			</button>
			<select class='grow h-8 capitalize' bind:value={selection} disabled={!remainingOptions.length}>
				{#each remainingOptions as section}
					<option value={section.toLowerCase()}>{section}</option>
				{/each}
			</select>
		</header>
	{/if}
	<main class='p-0.5 grow space-y-1 overflow-y-scroll'>
		<!-- #region Label -->
		{#if 'label' in data}
			<label class='p-0.5 grid grid-cols-3 items-center'>
				<span class='flex items-center' data-tooltip='pf2e-graphics.explanations.label'>
					Label
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input type='text' bind:value={data.label} {readonly} disabled={readonly} />
					<button
						class='w-min ml-1'
						on:click={() => {
							delete data.label;
							data = data;
						}}
						disabled={readonly}
					>
						<i class='fa fa-trash-can pl-0.5'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Triggers -->
		{#if 'triggers' in data}
			<label class='p-0.5 grid grid-cols-3 items-center'>
				<span class='flex items-center' data-tooltip='pf2e-graphics.explanations.triggers'>
					Triggers&nbsp;
					<span class='opacity-50'>
						(<a
							href='https://github.com/MrVauxs/pf2e-graphics/wiki/Animation-Details#trigger'
							target='_blank'>wiki</a>)
					</span
					>
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div
					class='
						flex align-middle items-center
						col-span-2
					'
				>
					<MultiSelect
						bind:selected={data.triggers}
						options={[
							'attack-roll',
							'damage-roll',
							'place-template',
							'action',
							'toggle',
							'effect',
							'self-effect',
							'start-turn',
							'end-turn',
							'damage-taken',
							'saving-throw',
							'check',
							'skill-check',
							'flat-check',
							'initiative',
							'perception-check',
							'counteract-check',
							'modifiers-matter',
						]} />
					<button
						class='w-min ml-1'
						on:click={() => {
							delete data.triggers;
							data = data;
						}}
						disabled={readonly}
					>
						<i class='fa fa-trash-can mx-auto fa-fw'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Predicates -->
		{#if 'predicates' in data || 'default' in data}
			<label class='p-0.5 grid grid-cols-3 items-center' for='predicates'>
				<span class='flex items-center' data-tooltip='pf2e-graphics.explanations.predicates'>
					Predicates&nbsp;
					<span class='opacity-50'>
						(<a
							href='https://github.com/foundryvtt/pf2e/wiki/Quickstart-guide-for-rule-elements#predicates'
							target='_blank'>wiki</a>)
					</span
					>
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div
					class='
						flex align-middle items-center
						col-span-2
					'
				>
					<label
						data-tooltip={data.predicates?.length ? 'Must empty out the Predicates (to [])' : ''}
						class='flex align-middle items-center text-xs'
						for='default'
					>
						Default
						<input
							id='default'
							type='checkbox'
							disabled={readonly || !!data.predicates?.length}
							bind:checked={data.default}
						/>
					</label>
					<input
						id='predicates'
						type='text'
						disabled={data.default || readonly}
						value={JSON.stringify(data.predicates || [])}
						on:change={(ev) => {
							try {
								data.predicates = JSON.parse(ev.currentTarget.value);
							} catch {
								ErrorMsg.send('Invalid JSON! Any unsaved progress will be lost.');
							}
						}}
					/>
					<button
						class='w-min ml-1'
						on:click={() => {
							delete data.predicates;
							delete data.default;
							data = data;
						}}
						disabled={readonly}
					>
						<i class='fa fa-trash-can mx-auto fa-fw'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Overrides -->
		{#if 'overrides' in data}
			<label class='p-0.5 grid grid-cols-3 items-center'>
				<span class='flex items-center' data-tooltip='pf2e-graphics.explanations.overrides'>
					Overrides
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div
					class='
						flex align-middle items-center
						col-span-2
						[&_button]:w-min
					'
				>
					<input
						type='text'
						value={JSON.stringify(data.overrides)}
						on:change={(ev) => {
							try {
								data.overrides = JSON.parse(ev.currentTarget.value);
							} catch {
								ErrorMsg.send('Invalid JSON! Any unsaved progress will be lost.');
							}
						}}
					/>
					<button
						class='w-min ml-1'
						on:click={() => {
							delete data.overrides;
							data = data;
						}}
						disabled={readonly}
					>
						<i class='fa fa-trash-can mx-auto fa-fw'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Removes -->
		{#if 'removes' in data}
			<label class='p-0.5 grid grid-cols-3 items-center'>
				<span class='flex items-center' data-tooltip='pf2e-graphics.explanations.removes'>
					Removes
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div
					class='
						flex align-middle items-center
						col-span-2
						[&_button]:w-min
					'
				>
					<input
						type='text'
						value={JSON.stringify(data.removes)}
						on:change={(ev) => {
							try {
								data.removes = JSON.parse(ev.currentTarget.value);
							} catch {
								ErrorMsg.send('Invalid JSON! Any unsaved progress will be lost.');
							}
						}}
					/>
					<button
						class='w-min ml-1'
						on:click={() => {
							delete data.removes;
							data = data;
						}}
						disabled={readonly}
					>
						<i class='fa fa-trash-can mx-auto fa-fw'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Execute -->
		{#if 'execute' in data && data.execute}
			<section
				on:drop|preventDefault|stopPropagation={onDrop}
				on:dragover|preventDefault
				aria-dropeffect='none'
				aria-label='Document drop target'
				class='border border-solid rounded-sm bg-slate-600/15'
			>
				<label class='p-0.5 pl-1 grid grid-cols-3 items-center'>
					<span class='flex items-center' data-tooltip='pf2e-graphics.explanations.execute'>
						Execute
						<i class='fa fa-info-circle px-2 ml-auto'></i>
					</span>
					<div class='flex align-middle items-center col-span-2'>
						<select
							class='grow underline-offset-2'
							bind:value={data.execute.type}
							class:underline={!checkIfEmpty(data.execute)}
							disabled={readonly || !checkIfEmpty(data.execute)}
							data-tooltip={!checkIfEmpty(data.execute)
								? 'In order to change the type of Execute payload, you have to remove the existing one first.'
								: ''}
						>
							<option value='graphic'>Graphic</option>
							<option value='sound'>Sound</option>
							<option value='crosshair'>Crosshair</option>
							<option value='animation'>Animation</option>
							<option value='macro'>Macro</option>
						</select>
						<button
							class='w-min ml-1'
							on:click={() => {
								TJSDialog.confirm({
									modal: true,
									title: 'Confirm Deletion',
									content:
										`Are you sure you want to delete this ${data.execute?.type ?? 'unconfigured'} payload? <p /> <center><b>All data will be irretrievably lost.</b></center>`,
									onYes: () => {
										delete data.execute;
										data = data;
									},
								});
							}}
							disabled={readonly}
						>
							<i class='fa fa-trash-can fa-fw mx-auto'></i>
						</button>
					</div>
				</label>
				<hr class='mx-1' />
				<div class='p-1 pb-2'>
					<!--
						The ts-ignores below are an absolute hack that should be
						removed when Svelte 5 comes around with TS support in Svelte markup.
						See https://github.com/sveltejs/language-tools/issues/1026
					-->
					{#if data.execute.type === 'graphic'}
						{true && /* @ts-ignore */ ''}
						<Graphic bind:data {readonly} />
					{:else if data.execute.type === 'animation'}
						{true && /* @ts-ignore */ ''}
						<Animation bind:data {readonly} />
					{:else if data.execute.type === 'sound'}
						{true && /* @ts-ignore */ ''}
						<Sound bind:data {readonly} />
					{:else if data.execute.type === 'crosshair'}
						{true && /* @ts-ignore */ ''}
						<Crosshair bind:data {readonly} />
					{:else if data.execute.type === 'macro'}
						{true && /* @ts-ignore */ ''}
						<Macro bind:data {readonly} />
					{/if}
				</div>
			</section>
		{/if}
		<!-- #endregion -->
	</main>
</div>
