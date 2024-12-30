<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';
	import type { AnimationSetDocument } from 'src/extensions';
	import { log } from 'src/utils';

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
					>
						<i class='fa fa-trash-can pl-0.5'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Name -->
		{#if 'triggers' in data}
			<label class='grid grid-cols-3 items-center'>
				<span>
					Triggers
					<i class='fa fa-info-circle pl-px align-middle' data-tooltip='TODO: Explain'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<select
						class='grow checked:[&>option]:bg-red-500/50'
						bind:value={data.triggers}
						multiple
					>
						<option value='attack-roll'>Attack Roll</option>
						<option value='damage-roll'>Damage Roll</option>
						<option value='place-template'>Place Template</option>
						<option value='action'>Action</option>
						<option value='toggle'>Toggle</option>
						<option value='effect'>Effect</option>
						<option value='self-effect'>Self-Effect</option>
						<option value='start-turn'>Start of Turn</option>
						<option value='end-turn'>End of Turn</option>
						<option value='damage-taken'>Damage Taken</option>
						<option value='saving-throw'>Saving Throw</option>
						<option value='check'>Check</option>
						<option value='skill-check'>Skill Check</option>
						<option value='flat-check'>Flat Check</option>
						<option value='initiative'>Initiative</option>
						<option value='perception-check'>Perception Check</option>
						<option value='counteract-check'>Counteract Check</option>
						<option value='modifiers-matter'>Modifiers Matter</option>
					</select>
					<button
						class='w-min mx-2'
						on:click={() => { delete data.triggers; data = data; }}
					>
						<i class='fa fa-trash-can pl-0.5'></i>
					</button>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
	</main>
</div>
