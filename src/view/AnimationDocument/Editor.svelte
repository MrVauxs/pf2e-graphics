<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';
	import type { AnimationSetDocument } from 'src/extensions';
	import EditorContent from './EditorContent.svelte';
	import Section from './Section.svelte';

	export let animation: AnimationSetDocument;
	export let readonly: boolean;

	let currentSection: number | string = 'details';
	let sectionArray: number[] = [];
	$: sectionArray = String(currentSection).split('.').map(x => Number(x));

	let data: AnimationSetItemPartial;

	$: data = sectionArray.slice(1).reduce(
		(object, index) => object.contents![index],
		animation.animationSets[sectionArray[0]] as AnimationSetItemPartial,
	);
</script>

<div class='flex flex-row h-full pt-1'>
	<aside class='
		w-1/4
		border border-solid rounded-sm
		flex flex-col
		bg-slate-400/10
	'>
		<div class='grow overflow-y-auto '>
			<section
				role='button'
				tabindex='-1'
				on:keypress={() => currentSection = 'details'}
				on:click={() => currentSection = 'details'}
				class:shadow-inner={currentSection === 'details'}
				class='
					hover:bg-slate-600/20
					border-0 border-b border-solid
					p-1
					shadow-slate-600
				'>
				<span> Details </span>
			</section>
			{#if typeof animation.animationSets === 'string'}
				<section
					class='
						hover:bg-slate-600/20
						border-0 border-b border-solid
						p-1
						shadow-slate-600
					'>
					Reference: <i class='text-nowrap'>{animation.animationSets}</i>
				</section>
			{:else}
				{#each animation.animationSets as section, index}
					<Section {section} index={index} bind:selection={currentSection} />
				{/each}
			{/if}
		</div>
		<footer class='p-1'>
			<button class='m-0'><i class='fa fa-plus'></i> Create New Section</button>
		</footer>
	</aside>
	<main class='px-2 w-3/4 overflow-hidden'>
		{#if currentSection === 'details'}
			<div class='space-y-1'>
				<label class='grid grid-cols-2 items-center'>
					<span>
						Display Name
					</span>
					<input type='text' bind:value={animation.name} {readonly} disabled={readonly} />
				</label>
				<label class='grid grid-cols-2 items-center'>
					<span>
						Primary Predicate
						<i class='fa fa-info-circle pl-px' data-tooltip='TODO: Explain'></i>
					</span>
					<input type='text' bind:value={animation.rollOption} {readonly} disabled={readonly} />
				</label>
			</div>
		{:else}
			{#if typeof animation.animationSets === 'string'}
				References {animation.animationSets}
			{:else}
				<EditorContent bind:data={data} {animation} {readonly} {sectionArray} />
			{/if}
		{/if}
	</main>
</div>
