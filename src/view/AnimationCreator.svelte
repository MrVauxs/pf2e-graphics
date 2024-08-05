<script lang='ts'>
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import { ErrorMsg, camelToSpaces, devMessage, i18n } from 'src/utils'

	export let key: string
	export let allAnimations: JSONData
	export let deleteSelf: (key: string) => void

	let animations = allAnimations[key] as Exclude<JSONData[string], string>

	if (typeof animations === 'string')	throw new ErrorMsg('"Pure" references are not (yet?) configurable by users! Create a new custom animation entry using an array and a { "reference": string } object.')

	$: devMessage(`AnimationCreator: ${key}`, animations)

	function newChild() {
		animations.push(AnimCore.CONST.TEMPLATE_ANIMATION())
		// eslint-disable-next-line no-self-assign
		animations = animations
	}

	function deleteTheChild(discardedChild: typeof animations[number]) {
		const index = animations.findIndex(child => foundry.utils.objectsEqual(child, discardedChild))
		animations.splice(index, 1)
		// eslint-disable-next-line no-self-assign
		animations = animations
	}

	let adultCounter = 0
	let childCounter = 0
	function countOrDeleteSelf() {
		adultCounter += 1
		if (adultCounter === 2) {
			deleteSelf(key)
			adultCounter = 0
		}
	}
	function countOrDeleteChild(animation: typeof animations[number]) {
		childCounter += 1
		if (childCounter === 2) {
			deleteTheChild(animation)
			childCounter = 0
		}
	}
</script>

<div class='border border-solid bg-slate-300 bg-opacity-50 w-full rounded-sm p-2.5'>
	<label class='flex items-center gap-1'>
		<span>Primary Roll Option:</span>
		<input type='text' value={key} disabled class='w-min text-center' />

		<div class='ml-auto flex items-center'>
			{#if adultCounter === 1}
				<span class='mr-2'>
					{i18n('areYouSureM8')}
				</span>
			{:else}
				<button class='w-min text-nowrap  items-center' on:click={newChild}>
					<i class='fa fa-plus' />
					New Child Animation
				</button>
			{/if}
			<button
				class='fa fa-trash-can size-8 {adultCounter === 1 ? 'bg-red-500' : ''}'
				data-tooltip={adultCounter === 1 ? 'pf2e-graphics.areYouSureM8' : 'Delete'}
				on:click={countOrDeleteSelf}
			/>
		</div>
	</label>

	{#if animations.length}
		<hr />
		<div class='flex flex-col gap-1.5'>
			{#each animations as animation}
				<div class='flex gap-2 p-1.5 border border-solid rounded-sm border-opacity-50 border-gray-800'
				>
					<button class='size-8 fa fa-chevron-down border-none' />

					<label class='flex items-center gap-2'>
						<span>Preset</span>
						<select bind:value={animation.preset}>
							{#each AnimCore.CONST.PRESETS as preset}
								<option value={preset}>{camelToSpaces(preset).titleCase()}</option>
							{/each}
						</select>
					</label>

					<label class='flex items-center gap-2'>
						<span>Trigger</span>
						<select bind:value={animation.trigger}>
							{#each AnimCore.CONST.TRIGGERS as trigger}
								<option value={trigger}>{i18n(`triggers.${trigger}`)}</option>
							{/each}
						</select>
					</label>

					<label class='flex items-center gap-2'>
						<span>Predicate</span>
						<input type='text'
							value={JSON.stringify(animation.predicate || [])}
							on:change={e => animation.predicate = JSON.parse(e.target?.value)} />
					</label>

					<div class='flex items-center gap-2 ml-auto text-nowrap'>
						{#if childCounter === 1}
							<span>
								{i18n('areYouSureM8')}
							</span>
						{/if}
						<button
							class='fa fa-trash-can size-8 {childCounter === 1 ? 'bg-red-500' : ''}'
							data-tooltip={childCounter === 1 ? 'pf2e-graphics.areYouSureM8' : 'Delete'}
							on:click={() => countOrDeleteChild(animation)}
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
