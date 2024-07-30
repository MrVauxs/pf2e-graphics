<script lang='ts'>
	import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import { ErrorMsg, dev, devMessage, i18n } from 'src/utils'
	import { derived } from 'svelte/store'
	import featData from './tokenimage-feat.json'

	export let actor: TJSDocument<ActorPF2e>

	const tokenImageID = derived(actor, $actor => $actor.flags['pf2e-graphics']?.tokenImageID)
	const derivedFeat = derived(actor, $actor => $actor.items.find(x => x.id === $actor.flags['pf2e-graphics']?.tokenImageID))
	const feat = new TJSDocument($derivedFeat)

	derivedFeat.subscribe(value => feat.set(value))

	if ($tokenImageID && !$feat) {
		ui.notifications.error('PF2e Graphics | PF2e Graphics bonus feat got deleted! Removing flags.')
		$actor.unsetFlag('pf2e-graphics', 'tokenImageID')
	}

	devMessage($actor, $tokenImageID, $feat)
	const FeatPF2e = CONFIG.PF2E.Item.documentClasses.feat

	async function giveth() {
		const feat = (await $actor.createEmbeddedDocuments('Item', [new FeatPF2e(featData)]))[0]
		$actor.setFlag('pf2e-graphics', 'tokenImageID', feat.id)
	}

	async function takethAway() {
		($actor.items.find(x => x.id === $actor.flags['pf2e-graphics']?.tokenImageID))?.delete()
		$actor.unsetFlag('pf2e-graphics', 'tokenImageID')
	}

	let display = $actor.getFlag('pf2e-graphics', 'displayFeat') as boolean
	async function invisibility() {
		$actor.setFlag('pf2e-graphics', 'displayFeat', display)
	}

	const ruleTemplate = () => ({
		id: foundry.utils.randomID(),
		key: 'TokenImage',
		value: $feat?.actor.prototypeToken.texture.src as string,
		uuidPredicate: '',
	})
	type CustomTokenImage = ReturnType<typeof ruleTemplate> & TokenImageRuleSource

	async function createRule() {
		await $feat?.update({ 'system.rules': $feat.system.rules.concat(ruleTemplate()) })
	}

	async function removeRule(rule: RuleElementSource) {
		await $feat?.update({ 'system.rules': $feat.system.rules.filter(x => x !== rule) })
	}

	async function updateRules() {
		await $feat?.update({ 'system.rules': $feat.system.rules })
	}

	async function PickAFile(current: string) {
		// @ts-ignore Good grief, why cant all these be FilePicker options be OPTIONAL?
		return new Promise(resolve => new FilePicker({ current, callback: result => resolve(result) }).browse())
	}

	async function dropPredicate(event: DragEvent, rule: CustomTokenImage): Promise<void> {
		const data = event?.dataTransfer?.getData('text/plain')
		if (!data) return
		const effect = await fromUuid(JSON.parse(data).uuid) as EffectPF2e

		if (effect?.type !== 'effect') throw new ErrorMsg('The dragged entity is not an effect!')

		// TODO: I swear this feels so wrong using an index for this.
		rule.predicate = [`self:${effect.getRollOptions()[1]}`]
		rule.uuidPredicate = effect.uuid

		updateRules()
	}

	function isCustomTokenImage(rule: RuleElementSource): rule is CustomTokenImage {
		return rule.key === 'TokenImage'
	}

	function isEffect(doc?: ClientDocument | null): doc is EffectPF2e {
		return doc?.type === 'effect'
	}
</script>

<div class='p-2 pb-0 flex flex-col h-full'>
	{#if $tokenImageID}
		<div class='flex-grow flex-shrink overflow-y-scroll mb-2 text-center'>
			{#each $feat?.system.rules.filter(isCustomTokenImage) || [] as rule}
				<div class='p-2 m-1 border border-solid rounded-md bg-gray-400 bg-opacity-20'>
					<section class='flex items-center mb-1'>
						<h3 class='border-b-0'>
							<i class='fa-regular fa-circle align-middle' />
							Token Image
						</h3>
						<div class='ml-auto'>
							Priority Goes Here
							<button on:click={() => removeRule(rule)} class='fas fa-trash-can size-8' />
						</div>
					</section>
					<div class='grid grid-cols-5 items-center gap-1.5
						[&>section]:col-span-4
						[&>span]:justify-self-start
						[&>span]:pl-1
					'>
						<!-- #region Predicate -->
						<span>
							Activate on:
						</span>
						<section
							class='border border-solid p-1 rounded-sm bg-opacity-50 bg-slate-100 flex-grow'
							on:drop|preventDefault|stopPropagation={event => dropPredicate(event, rule)}
							aria-dropeffect='none'
							aria-label='Drag and Drop Effect Target'
						>
							{#await fromUuid(rule.uuidPredicate) then effect}
								{#if isEffect(effect)}
									<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
									<div
										class='flex items-center gap-1 mx-auto cursor-pointer'
										on:click={() => effect.sheet.render(true)}
										on:keyup={() => effect.sheet.render(true)}
										role='document'
									>
										<img
											src={effect.img}
											alt='Effect Icon'
											class='size-6 cursor-pointer'
										/>
										<span>
											{effect.name}
										</span>
									</div>
								{:else}
									Drag and drop an effect to predicate onto!
								{/if}
							{/await}
						</section>
						<!-- #endregion -->
						<!-- #region Token Image -->
						<span>
							Token Image:
						</span>
						<section class='flex gap-1 items-center flex-grow'>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<img
								src={rule.value}
								alt={rule.value}
								class='size-8 border-0 cursor-pointer'
								style:transform='scale({rule.scale ?? $feat.actor.prototypeToken.texture.scaleX})'
								on:click={() => new ImagePopout(rule.value).render(true)}
							/>
							<input
								class='h-6 bg-opacity-50 bg-slate-100'
								type='text'
								placeholder='path/to/file.ext'
								bind:value={rule.value}
								on:change={updateRules}
							/>
							<button
								class='fas fa-file-import w-10 bg-button h-6'
								type='button'
								data-tooltip={i18n('FILES.BrowseTooltip')}
								aria-label={i18n('FILES.BrowseTooltip')}
								tabindex='-1'
								on:click={() => PickAFile(rule.value).then((x) => {
									rule.value = String(x)
									updateRules()
								})}
							/>
						</section>
						<!-- #endregion -->
						<!-- #region Transitions -->
						<span>
							Transition
						</span>
						<section class='border border-solid p-1 rounded-sm bg-opacity-50 bg-slate-100 flex-grow'>
							Options
						</section>
						<!-- #endregion -->
						<!-- #region Options -->
						<span>
							Scale / Tint / Opacity
						</span>
						<section class='border border-solid p-1 rounded-sm bg-opacity-50 bg-slate-100 flex-grow'>
							Options
						</section>
						<!-- #endregion -->
					</div>
					{#if dev}
						<section class='col-span-2 border border-solid bg-gray-400 p-1 mt-2 opacity-75 overflow-auto'>
							{JSON.stringify(rule)}
						</section>
					{/if}
				</div>
			{/each}
			<button class='w-1/2 m-1' on:click={createRule}>
				<i class='fas fa-plus' />
				Create Token Image
			</button>
		</div>
		<div class='grid grid-flow-col columns-2 gap-1 p-1 pt-0'>
			<div class='flex items-center'>
				<label for='displayFeat'>Display Feat on Character Sheet</label>
				<input type='checkbox' id='displayFeat' bind:checked={display} on:change={invisibility} />
			</div>
			<button class='' on:click={takethAway}>
				<i class='fa fa-trash-can pr-1' />{i18n('Delete')}
			</button>
			<button class='' on:click={() => $feat.sheet.render(true)}>
				<i class='fa fa-folder-open pr-1' />{i18n('actorAnimation.openFeat')}
			</button>
		</div>
	{:else}
		<div class='w-3/4 h-full text-center content-center mx-auto'>
			<div>
				<p>
					The actor does not have a dedicated token image feature!
				</p>
				<p>
					Choose one of the options below:
				</p>
			</div>
			<div class='flex'>
				<button on:click={giveth}>
					Create New
				</button>
				<button class='disabled' disabled>
					Select Existing Feature
				</button>
			</div>
		</div>
	{/if}
</div>
