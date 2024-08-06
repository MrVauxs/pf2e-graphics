<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import { writableDerived } from '@typhonjs-fvtt/runtime/svelte/store/writable-derived'
	import { AnimCore, type JSONData } from 'src/storage/AnimCore'
	import { camelToSpaces, devMessage, i18n, log } from 'src/utils'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let doc: TJSDocument<ActorPF2e>

	const flag = writableDerived(
		doc,
		$doc => $doc.getFlag('pf2e-graphics', 'customAnimations'),
		(data, doc) => {
			const diff = foundry.utils.diffObject(doc.flags['pf2e-graphics'] || {}, data || {})
			function changeValue(obj: Record<string, any>) {
				if (typeof obj === 'object') {
					// iterating over the object using for..in
					for (const key in obj) {
						if (obj[key] === null) {
							obj[`-=${key}`] = null
							delete obj[key]
						} else if (typeof obj[key] === 'object') {
							changeValue(obj[key])
						}
					}
				}
				return obj
			}

			doc.setFlag('pf2e-graphics', 'customAnimations', changeValue(diff))
			return doc
		},
	) as Writable<{ customAnimations: Record<string, Exclude<JSONData[string], string>> }>

	$flag.customAnimations ??= {}

	const sessionStorage = getContext('#external').sessionStorage
	const showNewAnimation = sessionStorage.getStore('showNewAnimation', false)
	let newKey = ''

	function createAnimation() {
		if (!$flag?.customAnimations) throw log('Something went wrong, check with Vauxs!')
		if (!newKey.length) throw ui.notifications.error('Primary roll option must not be empty!')
		$flag.customAnimations[newKey] = []
		$showNewAnimation = !$showNewAnimation
	}

	async function deleteAnimation(key: string) {
		Dialog.confirm({
			content: `Are you sure you want to delete all animations under "${key}"?`,
			title: 'Confirm Deletion',
			yes: () => {
				// @ts-ignore Explicitly a deletion thing
				$flag.customAnimations[key] = null
			},
		})
	}

	function bindJSON(event: Event, _property: any) {
		_property = JSON.parse((event.target as HTMLInputElement).value)
	}

	$: devMessage('Actor Animations Tab', $flag.customAnimations, $showNewAnimation)
</script>

<div class='p-2 pb-0 flex flex-col h-full items-center'>
	{#if $flag.customAnimations}
		<div class='flex flex-col w-full items-center gap-1.5'>
			{#each Object.keys($flag.customAnimations).filter(x => Boolean($flag.customAnimations?.[x])) as key}
				<div class='border border-solid bg-slate-300 bg-opacity-50 w-full rounded-sm p-2.5'>
					<label class='flex items-center gap-1'>
						<span>Primary Roll Option:</span>
						<input type='text' value={key} disabled class='w-min text-center' />

						<div class='ml-auto flex items-center'>
							<button
								on:click={() => { $flag.customAnimations[key] = [...$flag.customAnimations[key], AnimCore.CONST.TEMPLATE_ANIMATION()] }}
								class='w-min text-nowrap items-center'
							>
								<i class='fa fa-plus' />
								New Child Animation
							</button>
							<button
								on:click={() => deleteAnimation(key)}
								class='fa fa-trash-can size-8'
							/>
						</div>
					</label>

					{#if $flag.customAnimations[key].length}
						<hr />
						<div class='flex flex-col gap-1.5'>
							{#each $flag.customAnimations[key] as animation}
								<div class='p-1.5 border border-solid rounded-sm border-opacity-50 border-gray-800'>
									<div class='flex gap-2 w-full'>
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
											<input
												type='text'
												value={JSON.stringify(animation.predicate || [])}
												on:change={e => bindJSON(e, animation.predicate)}
											/>
										</label>

										<div class='flex items-center gap-2 ml-auto text-nowrap'>
											<button
												on:click={() => Dialog.confirm({
													content: `Are you sure you want to delete this animation?`,
													title: 'Confirm Deletion',
													yes: () => {
														// @ts-ignore Explicitly a deletion thing
														$flag.customAnimations[key] = $flag.customAnimations[key].filter(x => x !== animation)
													},
												})}
												class='fa fa-trash-can size-8'
											/>
										</div>
									</div>
									<hr />
									<div class='flex gap-2 w-full p-1'>
										<label class='flex items-center gap-2'>
											File
											<!-- eslint-disable-next-line no-self-assign -->
											<input type='text' bind:value={animation.file} on:change={() => animation = animation} />
										</label>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<div class='w-1/2 m-1 text-center items-center flex flex-col gap-1'>
			{#if !$showNewAnimation}
				<button on:click={() => $showNewAnimation = !$showNewAnimation}>
					<i class='fas fa-plus' />
					Create New Animation
				</button>
			{:else}
				<span class='px-1'> Input the primary roll option. </span>
				<div class='flex w-full gap-1'>
					<input
						type='text'
						bind:value={newKey}
						placeholder={Sequencer.Helpers.random_array_element(AnimCore.getKeys())}
					/>
					<button
						data-tooltip='pf2e-graphics.cancel'
						class='fa fa-times w-min m-0'
						on:click={() => $showNewAnimation = !$showNewAnimation} />
				</div>
				<button
					class=''
					on:click={createAnimation}
				>
					<i class='fas fa-check' />
					Submit
				</button>
			{/if}
		</div>
	{/if}
</div>
