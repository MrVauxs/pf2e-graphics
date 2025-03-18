<script lang='ts'>
	import type { AnimationSet, AnimationSetContentsItem, AnimationSetDocument } from 'schema';
	import type { Writable } from 'svelte/store';
	import type { BasicAppExternal } from './AnimationDocumentApp';
	import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
	import { devLog } from 'src/utils';
	import { getContext } from 'svelte';
	import { sluggify } from '../AnimationSidebar/sidebarFunctions';
	import EditorContent from './EditorContent.svelte';
	import Section from './Section.svelte';

	export let animation: AnimationSetDocument;
	export let readonly: boolean;

	const { application } = getContext<BasicAppExternal>('#external');

	const currentSection: Writable<string> = application.reactive.sessionStorage.getStore(
		`${application.options.id}`,
		'details',
	);

	let sectionArray: number[] = [];
	$: sectionArray = String($currentSection)
		.split('.')
		.map(x => Number(x));

	let data: AnimationSetContentsItem = animation.animationSets?.[0] as AnimationSetContentsItem;

	$: {
		// Crash prevention in case the animation was modified
		// when you were gone or crashed before saving.
		try {
			const found = sectionArray.slice(1).reduce((object, index) => {
				try {
					return object.contents![index];
				} catch {
					currentSection.set('details');
					return object;
				}
			}, animation.animationSets[sectionArray[0]] as AnimationSetContentsItem);

			if (found) {
				data = found;
			} else {
				currentSection.set('details');
			};
		} catch {
			currentSection.set('details');
		}
		devLog('Animation Document Data', data);
	}

	function addSection() {
		if (typeof animation.animationSets === 'string') return;
		animation.animationSets ??= [];
		animation.animationSets.push({});
		animation = animation;
	}

	function deleteSectionOrContent(location: string) {
		const locationArray = location.split('.').map(x => Number(x));

		if (location === $currentSection) {
			$currentSection = locationArray.join('.').slice(0, -2) || 'details';
		}

		if (locationArray.length === 1) {
			(animation.animationSets as AnimationSet[]).splice(locationArray[0], 1);
		} else {
			let current = animation.animationSets[locationArray[0]] as AnimationSetContentsItem;
			const last = locationArray.pop()!;
			for (let i = 0; i < locationArray.length - 1; i++) {
				const key = locationArray[i];
				if (current.contents) current = current.contents[key];
			}
			current.contents!.splice(last, 1);
		}

		animation = animation;
	}

	let reference = typeof animation.animationSets === 'string';
</script>

<div class='flex flex-row h-full pt-1'>
	<aside
		class='
			w-1/4
			border border-solid rounded-sm
			flex flex-col
			bg-slate-400/10
		'
	>
		<div class='grow overflow-y-auto'>
			<section
				role='button'
				tabindex='-1'
				on:keypress={() => ($currentSection = 'details')}
				on:click={() => ($currentSection = 'details')}
				class:shadow-inner={$currentSection === 'details'}
				class='
					hover:bg-slate-600/20
					border-0 border-b border-solid
					p-1
					shadow-slate-600
				'
			>
				<span> Details </span>
			</section>
			{#if typeof animation.animationSets === 'string'}
				<section
					class='
						hover:bg-slate-600/20
						border-0 border-b border-solid
						p-1
						shadow-slate-600
					'
				>
					Reference: <i class='text-nowrap'>{animation.animationSets}</i>
				</section>
			{:else}
				{#each animation?.animationSets ?? [] as section, index}
					<Section
						{readonly}
						{section}
						bind:array={animation.animationSets}
						bind:selection={$currentSection}
						globalIndex={String(index)}
						localIndex={index}
						deleteFn={deleteSectionOrContent}
					/>
				{/each}
			{/if}
		</div>
		<footer class='p-1'>
			<button class='m-0' on:click={addSection}>
				<i class='fa fa-plus'></i> Create New Section
			</button>
		</footer>
	</aside>
	<main class='px-2 w-3/4 overflow-y-auto overflow-x-hidden'>
		{#if $currentSection === 'details'}
			<div class='space-y-1'>
				<label class='grid grid-cols-2 items-center'>
					<span> Display Name </span>
					<input
						type='text'
						{readonly}
						disabled={readonly}
						bind:value={animation.name}
						on:change={() => {
							if (animation.name.trim() === '' && 'id' in animation)
								animation.name = `Animation ${animation.id.slice(0, 4)}`;
						}}
					/>
				</label>
				<label class='grid grid-cols-2 items-center'>
					<span class='flex items-center' data-tooltip='pf2e-graphics.explanations.rollOption'>
						Roll Option&nbsp;
						<span style:opacity='0.5'>
							(<a href='https://github.com/foundryvtt/pf2e/wiki/Quickstart-guide-for-rule-elements#predicates' target='_blank'>wiki</a>)
						</span>
						<i class='fa fa-info-circle px-2 ml-auto'></i>
					</span>
					<input
						type='text'
						{readonly}
						disabled={readonly}
						bind:value={animation.rollOption}
						on:change={() => {
							if (animation.rollOption.trim() === '' && 'id' in animation)
								animation.rollOption = sluggify(`Animation ${animation.id.slice(0, 4)}`);
						}}
					/>
				</label>
				<label class='grid grid-cols-2 items-center'>
					<span class='flex items-center' data-tooltip='pf2e-graphics.explanations.reference'>
						Reference
						<i class='fa fa-info-circle px-2 ml-auto'></i>
					</span>
					<div class='flex flex-row flex-nowrap items-center'>
						<input
							type='checkbox'
							{readonly}
							disabled={readonly}
							bind:checked={reference}
							on:change={() => {
								if (typeof animation.animationSets === 'string') {
									animation.animationSets = [];
								} else if (animation.animationSets.length) {
									TJSDialog.confirm({
										modal: true,
										title: 'Confirm',
										content: 'By converting to a reference, the existing animationSets will be deleted. Are you sure you want to do this?',
										onYes: () => {
											animation.animationSets = '';
										},
										onNo: () => {
											reference = false;
										},
									});
								} else {
									animation.animationSets = '';
								}
							}}
						/>
						{#if typeof animation.animationSets === 'string'}
							<input
								class='grow'
								type='text'
								{readonly}
								disabled={readonly}
								placeholder='roll-option'
								bind:value={animation.animationSets}
							/>
						{/if}
					</div>
				</label>
			</div>
		{:else if typeof animation.animationSets === 'string'}
			References {animation.animationSets}, mimicking all of its animations.
		{:else}
			<EditorContent bind:data {animation} {readonly} />
		{/if}
	</main>
</div>
