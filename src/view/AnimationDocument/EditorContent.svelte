<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';
	import type { AnimationSetDocument } from 'src/extensions';
	import { ErrorMsg, log } from 'src/utils';
	import Svelecte from 'svelecte';

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
			case 'triggers':{
				data.triggers = [];
				break;
			}
			case 'predicates':{
				data.predicates = [];
				break;
			}
		}
	}
</script>

<div class='flex flex-col gap-2 h-full py-1'>
	{#if !readonly}
		<header class='flex items-center grow-0'>
			<button
				class='w-min text-nowrap h-8'
				on:click={addSection}
			>
				<i class='fa fa-plus pr-1'></i>Add
			</button>
			<select
				class='grow h-8'
				bind:value={selection}
			>
				<option value='name'>Name</option>
				<option value='triggers'>Triggers</option>
				<option value='predicates'>Predicates</option>
			</select>
		</header>
	{/if}
	<main class='p-1 grow space-y-1'>
		<!-- #region Name -->
		{#if 'name' in data}
			<label class='grid grid-cols-3 items-center'>
				<span>
					Name
					<i class='fa fa-info-circle pl-px align-middle' data-tooltip='TODO: Explain'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input
						class=''
						type='text'
						bind:value={data.name}
						{readonly}
						disabled={readonly}
					/>
					<button
						class='w-min mx-2'
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
			<label class='grid grid-cols-3 items-center'>
				<span>
					Triggers
					<i class='fa fa-info-circle pl-px align-middle' data-tooltip='TODO: Explain'></i>
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
						class='w-min mx-2'
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
		{#if 'predicates' in data}
			<label class='grid grid-cols-3 items-center'>
				<span>
					Predicates
					<i class='fa fa-info-circle pl-px align-middle' data-tooltip='TODO: Add link to pf2e wiki about roll options'></i>
				</span>
				<div class='
					flex align-middle items-center
					col-span-2
					[&_button]:w-min
				'>
					<input
						type='text'
						value={JSON.stringify(data.predicates)}
						on:change={(ev) => {
							try {
								data.predicates = JSON.parse(ev.currentTarget.value);
							} catch {
								ErrorMsg.send('Invalid JSON! Any unsaved progress will be lost.');
							}
						}}
					/>
					<button
						class='w-min mx-2'
						on:click={() => { delete data.predicates; data = data; }}
						disabled={readonly}
					>
						<i class='fa fa-trash-can pl-0.5'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
	</main>
</div>
