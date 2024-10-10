<script lang='ts'>
	import { clearEmpties, i18n } from 'src/utils';
	import JSONEditorApp from 'src/view/_components/JSONEditor/JSONEditor';
	import { writable } from 'svelte/store';

	export let doc;

	function getAnimations() {
		return window.pf2eGraphics.AnimCore.getMatchingAnimationTrees($doc.getRollOptions('item'), $doc.actor, $doc);
	}

	const animData = writable(getAnimations());
	doc.subscribe(() => $animData = getAnimations());

	function findSource(key: string) {
		return Object.entries($animData.sources).findLast(([,v]) => v.includes(key))?.[0];
	}
</script>

<div class='p-2 pb-0'>
	{#if Object.keys(clearEmpties($animData.animations)).length === 0}
		<p>No animations found for this item.</p>
	{:else}
		<span data-tooltip='pf2e-graphics.tooltip.imported' data-tooltip-direction='RIGHT'>
			Existing Animations
		</span>
		<ul class='list-item list-disc'>
			{#each Object.entries($animData.animations) as [key, animation]}
				{#if animation.length > 0}
					<li>
						<div class='flex'>
							{key} ({i18n(`source`, { format: findSource(key) })})
							<button
								class='fas fa-brackets-curly h-full w-min ml-auto'
								on:click={() => {
									new JSONEditorApp({
										store: writable({ [key]: animation }),
										permission: false,
										validate: true,
									}).render(true, {
										focus: true,
									});
								}}
							></button>
						</div>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</div>
