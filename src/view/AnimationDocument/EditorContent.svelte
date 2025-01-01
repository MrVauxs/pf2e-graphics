<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';
	import type { AnimationSetDocument } from 'src/extensions';
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
	import { ErrorMsg, log } from 'src/utils';
	import Svelecte from 'svelecte';
	import { Animation, Crosshair, Graphic, Macro, Sound } from './execute';

	export let data: AnimationSetItemPartial;
	export let animation: AnimationSetDocument;
	export let readonly: boolean;
	export let sectionArray: number[];

	log(animation);

	let selection: keyof AnimationSetItemPartial = 'name';

	// eslint-disable-next-line prefer-const
	let upperAnimation = sectionArray.slice(1).slice(0, -1).reduce(
		(object, index) => {
			return ({ ...object, ...object.contents![index] });
		},
		animation.animationSets[sectionArray[0]] as AnimationSetItemPartial,
	);

	$: log(upperAnimation);

	function addSection() {
		switch (selection) {
			case 'name': {
				data.name = 'Animation Name';
				break;
			}
			case 'triggers': {
				data.triggers = [];
				break;
			}
			case 'predicates': {
				data.predicates = [];
				break;
			}
			case 'removes': {
				data.removes = [];
				break;
			}
			case 'execute': {
				data.execute = {};
				break;
			}
		}
	}

	const macroDoc = new TJSDocument<Macro>();
	function onDrop(event: DragEvent) {
		if (readonly || data.execute?.type !== 'macro') return;
		try {
			const transfer = event.dataTransfer?.getData('text/plain');
			if (transfer) macroDoc.setFromDataTransfer(JSON.parse(transfer));
			if ($macroDoc.collectionName !== 'macros') throw ErrorMsg.send('This isn\'t a macro!'); // TODO: i18n
			data.execute.document = $macroDoc.uuid;
		} catch {}
	}
</script>

<div class='flex flex-col gap-2 h-full py-1'>
	{#if !readonly}
		<header class='flex items-center grow-0'>
			<button
				class='w-min text-nowrap h-8'
				on:click={addSection}
			>
				<i class='fa fa-plus pr-1'></i>
				Add
			</button>
			<select
				class='grow h-8'
				bind:value={selection}
			>
				{#each ['Name', 'Triggers', 'Predicates', 'Removes', 'Execute'].filter(x => !Object.keys(data).includes(x.toLowerCase())) as section}
					<option value={section.toLowerCase()}>{section}</option>
				{/each}
			</select>
		</header>
	{/if}
	<main class='p-0.5 grow space-y-1'>
		<!-- #region Name -->
		{#if 'name' in data}
			<label class='p-0.5 grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Name
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input
						type='text'
						bind:value={data.name}
						{readonly}
						disabled={readonly}
					/>
					<button
						class='w-min ml-1'
						on:click={() => { delete data.name; data = data; }}
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
				<span data-tooltip='TODO: Explain'>
					Triggers
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='
					flex align-middle items-center
					col-span-2
					[&_button]:w-min
				'>
					<Svelecte
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
						]}
						bind:value={data.triggers}
						disabled={readonly}
						selectOnTab={true}
						multiple
					/>
					<button
						class='w-min ml-1'
						on:click={() => { delete data.triggers; data = data; }}
						disabled={readonly}
					>
						<i class='fa fa-trash-can pl-0.5'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Predicates -->
		{#if 'predicates' in data || 'default' in data}
			<label class='p-0.5 grid grid-cols-3 items-center' for='predicates'>
				<span data-tooltip='TODO: Add link to pf2e wiki about roll options'>
					Predicates
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='
					flex align-middle items-center
					col-span-2
				'>
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
						on:click={() => { delete data.predicates; delete data.default; data = data; }}
						disabled={readonly}
					>
						<i class='fa fa-trash-can pl-0.5'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Removes -->
		{#if 'removes' in data}
			<label class='p-0.5 grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Removes
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='
					flex align-middle items-center
					col-span-2
					[&_button]:w-min
				'>
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
						on:click={() => { delete data.removes; data = data; }}
						disabled={readonly}
					>
						<i class='fa fa-trash-can pl-0.5'></i>
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
				class='
					border border-solid rounded-sm bg-slate-500/10
				'>
				<label class='p-0.5 pl-1 grid grid-cols-3 items-center'>
					<span data-tooltip='TODO: Explain'>
						Execute
						<i class='fa fa-info-circle pl-px'></i>
					</span>
					<div class='flex align-middle items-center col-span-2'>
						<select
							class='grow underline-offset-2'
							class:underline={Object.keys(data.execute).length > 1}
							bind:value={data.execute.type}
							disabled={readonly || Object.keys(data.execute).length > 1}
							data-tooltip={Object.keys(data.execute).length > 1 ? 'In order to change the type of Execute payload, you have to remove the existing one first.' : ''}
						>
							<option value='graphic'>Graphic</option>
							<option value='sound'>Sound</option>
							<option value='crosshair'>Crosshair</option>
							<option value='animation'>Animation</option>
							<option value='macro'>Macro</option>
						</select>
						<button
							class='w-min ml-1'
							on:click={() => { delete data.execute; data = data; }}
							disabled={readonly}
						>
							<i class='fa fa-trash-can pl-0.5'></i>
						</button>
					</div>
				</label>
				<hr class='mx-1' />
				<div class='p-1 pb-2'>
					{#if data.execute.type === 'graphic'}
						<Graphic bind:data={data} {readonly} />
					{:else if data.execute.type === 'animation'}
						<Animation bind:data={data} {readonly} />
					{:else if data.execute.type === 'sound'}
						<Sound bind:data={data} {readonly} />
					{:else if data.execute.type === 'crosshair'}
						<Crosshair bind:data={data} {readonly} />
					{:else if data.execute.type === 'macro'}
						<Macro bind:data={data} {readonly} />
					{/if}
				</div>
			</section>
		{/if}
		<!-- #endregion -->
	</main>
</div>
