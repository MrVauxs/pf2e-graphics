<script lang='ts'>
	import type { AnimationSetDocument } from 'src/extensions';

	export let animation: AnimationSetDocument;
	export let readonly: boolean;

	let currentSection: number | 'details' = 'details';
</script>

<div class='flex flex-row h-full pt-1'>
	<aside class='
		w-1/4
		border border-solid rounded-sm
		flex flex-col
	'>
		<div class='grow overflow-y-auto bg-slate-400/10'>
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
				Reference: {animation.animationSets}
			{:else}
				{#each animation.animationSets as set, index}
					<section
						role='button'
						tabindex='-1'
						on:keypress={() => currentSection = index}
						on:click={() => currentSection = index}
						class:shadow-inner={currentSection === index}
						class='
							hover:bg-slate-600/20
							border-0 border-b border-solid
							p-1
							shadow-slate-600
						'>
						<span>Section {index + 1}</span>
						{#if set.contents}
							<div class='pl-4'>
								- test
							</div>
						{/if}
					</section>
				{/each}
			{/if}
		</div>
		<footer class='p-1'>
			<button class='m-0'><i class='fa fa-plus'></i> Create New Section</button>
		</footer>
	</aside>
	<main class='flex flex-col space-y-2 grow px-2 w-3/4'>
		{#if currentSection === 'details'}
			<label>
				<span>Name</span>
				<input type='text' bind:value={animation.name} {readonly} disabled={readonly} />
			</label>
			<label>
				<span>Roll Option</span>
				<input type='text' bind:value={animation.rollOption} {readonly} disabled={readonly} />
			</label>
		{:else}
			test
		{/if}
	</main>
</div>
