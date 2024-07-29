<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import { devMessage } from 'src/utils'
	import { derived } from 'svelte/store'
	import featData from './tokenimage-feat.json'

	export let doc: TJSDocument<ActorPF2e>

	const tokenImageID = derived(doc, $doc => $doc.flags['pf2e-graphics']?.tokenImageID)
	const feat = derived(doc, $doc => $doc.items.find(x => x.id === $doc.flags['pf2e-graphics']?.tokenImageID))

	if ($tokenImageID && !$feat) {
		ui.notifications.error('PF2e Graphics | PF2e Graphics bonus feat got deleted! Removing flags.')
		$doc.unsetFlag('pf2e-graphics', 'tokenImageID')
	}

	devMessage($doc, $tokenImageID, $feat)
	const FeatPF2e = CONFIG.PF2E.Item.documentClasses.feat

	async function giveth() {
		const feat = (await $doc.createEmbeddedDocuments('Item', [new FeatPF2e(featData)]))[0]
		$doc.setFlag('pf2e-graphics', 'tokenImageID', feat.id)
	}

	async function takethAway() {
		($doc.items.find(x => x.id === $doc.flags['pf2e-graphics']?.tokenImageID))?.delete()
		$doc.unsetFlag('pf2e-graphics', 'tokenImageID')
	}

	let display = $doc.getFlag('pf2e-graphics', 'displayFeat') as boolean
	async function invisibility() {
		$doc.setFlag('pf2e-graphics', 'displayFeat', display)
	}
</script>

<div class='p-2'>
	{#if $tokenImageID}
		<div class='grid grid-flow-col columns-2'>
			<div class='flex items-center'>
				<label for='displayFeat'>Display Feat on Character Sheet</label>
				<input type='checkbox' id='displayFeat' bind:checked={display} on:change={invisibility} />
			</div>
			<button class='' on:click={takethAway}>
				Delet
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
