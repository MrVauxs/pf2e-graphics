<script lang='ts'>
	import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import { dev, devMessage, i18n } from 'src/utils'
	import { derived } from 'svelte/store'
	import featData from './tokenimage-feat.json'

	export let actor: TJSDocument<ActorPF2e>

	const tokenImageID = derived(actor, $actor => $actor.flags['pf2e-graphics']?.tokenImageID)
	const derivedFeat = derived(actor, $actor => $actor.items.find(x => x.id === $actor.flags['pf2e-graphics']?.tokenImageID))
	let feat = new TJSDocument($derivedFeat)

	derivedFeat.subscribe(value => (feat = new TJSDocument(value)))

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

	const ruleTemplate = {
		id: foundry.utils.randomID(),
		key: 'TokenImage',
		value: $feat?.actor.prototypeToken.texture.src,
		predicate: [],
	}

	async function createRule() {
		await $feat?.update({ 'system.rules': $feat.system.rules.concat(ruleTemplate) })
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
</script>

<div class='p-2 pb-0 flex flex-col h-full'>
	{#if $tokenImageID}
		<div class='flex-grow flex-shrink overflow-y-scroll mb-2 text-center'>
			{#each $feat?.system.rules.filter(x => x.key === 'TokenImage') || [] as rule}
				<div class='border border-solid rounded-md p-1 m-1 gap-2 flex flex-col relative'>

					<div class='flex items-center gap-1'>
						<h3 class='border-b-0 -mt-1'><i class='fa-regular fa-circle mr-1.5 size-4 py-1' />Token Image</h3>
						<div class='ml-auto'>
							Priority Goes Here
							<button on:click={() => removeRule(rule)} class='fas fa-trash-can size-8 m-1' />
						</div>
					</div>

					<div class='flex items-center gap-1'>
						Drag-and-Drop Predicates Go Here
					</div>
					<div class='flex items-center gap-1'>
						Transition Options Go Here
					</div>
					<div class='flex items-center gap-1'>
						Scale / Tint / Opacity Options Go Here
					</div>
					<div class='flex items-center gap-1 '>
						<img
							src={rule.value}
							alt={rule.value}
							class='size-8 border-0'
							style:transform='scale({rule.scale ?? $feat.actor.prototypeToken.texture.scaleX})'
						/>
						<input
							class='image h-6'
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
								rule.value = x
								updateRules()
							})}
						/>
					</div>
					{#if dev}
						<div class='border border-solid bg-gray-400 p-1 mt-2 opacity-75'>
							{JSON.stringify(rule)}
						</div>
					{/if}
				</div>
			{/each}
			<button class='w-1/2' on:click={createRule}>
				<i class='fas fa-plus' />
				Create Token Image
			</button>
		</div>
		<div class='grid grid-flow-col columns-2 gap-1'>
			<div class='flex items-center'>
				<label for='displayFeat'>Display Feat on Character Sheet</label>
				<input type='checkbox' id='displayFeat' bind:checked={display} on:change={invisibility} />
			</div>
			<button class='' on:click={takethAway}>
				{i18n('Delete')}
			</button>
			<button class='' on:click={() => $feat.sheet.render(true)}>
				{i18n('actorAnimation.openFeat')}
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
