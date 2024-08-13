<script lang='ts'>
	import { ErrorMsg } from 'src/utils'
	import type { CustomTokenImage } from '../tokenimage-manager.svelte'

	export let rule: CustomTokenImage
	export let updateRules: (rule1?: CustomTokenImage, rule2?: Partial<CustomTokenImage>) => void

	async function dropPredicate(event: DragEvent, rule: CustomTokenImage): Promise<void> {
		const data = event?.dataTransfer?.getData('text/plain')
		if (!data) return
		const effect = await fromUuid(JSON.parse(data).uuid) as EffectPF2e

		if (effect?.type !== 'effect') throw new ErrorMsg('The dragged entity is not an effect!')

		// TODO: I swear this feels so wrong using an index for this.
		return updateRules(rule, {
			predicate: [`self:${effect.getRollOptions()[1]}`],
			uuidPredicate: effect.uuid,
		})
	}

	function removeDropPredicate(rule: CustomTokenImage) {
		rule.predicate = []
		rule.uuidPredicate = ''
		updateRules()
	}

	function isEffect(doc?: ClientDocument | null): doc is EffectPF2e {
		return doc?.type === 'effect'
	}

	let showPredicate = (rule.predicate || [])?.length > 1 || !rule.uuidPredicate

	function updatePredicates(e: Event) {
		rule.predicate = JSON.parse((e.target as HTMLInputElement)?.value ?? '[]')
		updateRules()
	}
</script>

<section
	class='border border-solid p-1 rounded-sm bg-opacity-50 bg-slate-100 flex h-9 gap-1'
	on:drop|preventDefault|stopPropagation={event => dropPredicate(event, rule)}
	aria-dropeffect='none'
	aria-label='Drag and Drop Effect Target'
>
	{#await window.fromUuid(rule.uuidPredicate) then effect}
		{#if showPredicate}
			<input class='' type='text'
				value={JSON.stringify(rule.predicate)}
				on:change={updatePredicates}
			/>
		{:else}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<div
				class='flex items-center mx-auto cursor-pointer text-nowrap'
			>
				{#if isEffect(effect)}
					<div
						class='flex items-center gap-1'
						on:click={() => effect.sheet.render(true)}
						on:keyup={() => effect.sheet.render(true)}
						role='document'
					>
						<img
							src={effect.img}
							alt='Effect Icon'
							class='size-6 cursor-pointer aspect-square'
						/>
						<span>
							{effect.name}
						</span>
						<i class='fa fa-close ml-auto mr-6 p-1 py-0 leading-normal hover:underline'
							role='button'
							tabindex='-1'
							on:click|stopPropagation={() => removeDropPredicate(rule)}
							on:keyup|stopPropagation={() => removeDropPredicate(rule)}
						/>
					</div>
				{:else}
					<span class='px-1'>Drag and drop an effect to predicate onto!</span>
				{/if}
			</div>
		{/if}

		<button data-tooltip='pf2e-graphics.actorAnimation.switch' class='fa fa-refresh w-min' on:click={() => showPredicate = !showPredicate} />
	{/await}
</section>
