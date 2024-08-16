<script lang='ts'>
	import { clearEmpties, i18n } from 'src/utils'

	export let animData
	export let item
</script>

<div class='p-2 pb-0'>
	{#if Object.keys(animData.animations).length === 0}
		<p>No animations found for this item.</p>
	{:else}
		<h2>
			<span data-tooltip='pf2e-graphics.tooltip.imported' data-tooltip-direction='RIGHT'>
				Existing Animations
			</span>
		</h2>
		<div class='ml-4'>
			{#each Object.keys(animData.animations) as animationKey}
				{#if animData.animations[animationKey].length > 0}
					<h3>
						{animationKey} ({i18n(`source`, { format: Object.keys(animData.sources).at(-1) })})
					</h3>
					<div class='flex flex-col gap-1 ml-4'>
						{#each animData.animations[animationKey] as animation}
							<div class='flex flex-row w-[99%]'>
								<textarea
									class='resize-y'
									disabled
									value={JSON.stringify(clearEmpties(animation), null, ' ')}
								/>
								<div class='flex flex-col flex-grow-0'>
									<button
										class='text-xs h-full'
										on:click={() =>
											window.pf2eGraphics.AnimCore.testAnimation(
												animation,
												item,
											)}
									>
										Test
									</button>
									<button class='text-xs h-full' disabled> ___ </button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
