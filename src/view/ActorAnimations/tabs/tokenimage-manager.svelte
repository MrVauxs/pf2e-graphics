<script lang='ts' context='module'>
	const ruleTemplate = (feat: ItemPF2e) => ({
		id: foundry.utils.randomID(),
		key: 'TokenImage',
		value: feat?.actor?.prototypeToken.texture.src as string,
		uuidPredicate: '',
		animation: {},
		predicate: [] as (string | object)[],
	});
	export type CustomTokenImage = ReturnType<typeof ruleTemplate> & TokenImageRuleSource;
</script>

<script lang='ts'>
	import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document';
	import { AnimCore } from 'src/storage/AnimCore';
	import { devLog, i18n } from 'src/utils';
	import { derived } from 'svelte/store';
	import PredicateSection from './elements/PredicateSection.svelte';
	import TokenThumbnail from './elements/TokenThumbnail.svelte';
	import featData from './tokenimage-feat.json';

	export let actor: TJSDocument<ActorPF2e>;

	const tokenImageID = derived(actor, $actor => $actor.flags['pf2e-graphics']?.tokenImageID);
	const derivedFeat = derived(actor, $actor => $actor.items.get(String($actor.flags['pf2e-graphics']?.tokenImageID)));
	const feat = new TJSDocument($derivedFeat);

	derivedFeat.subscribe(value => feat.set(value));

	if ($tokenImageID && !$feat) {
		ui.notifications.error('PF2e Graphics | PF2e Graphics bonus feat got deleted! Removing flags.');
		$actor.unsetFlag('pf2e-graphics', 'tokenImageID');
	}

	devLog($actor, $feat, $feat?.system.rules);
	const FeatPF2e = CONFIG.PF2E.Item.documentClasses.feat;
	const ActionPF2e = CONFIG.PF2E.Item.documentClasses.action;

	async function giveth() {
		const feature = $actor.isOfType('character')
			? new FeatPF2e({ ...featData, type: 'feat' })
			: new ActionPF2e({ ...featData, type: 'action' });

		// @ts-ignore Idle did it and why shouldn't I
		const feat = (await $actor.createEmbeddedDocuments('Item', [feature]))[0] as typeof feature;

		$actor.setFlag('pf2e-graphics', 'tokenImageID', feat.id);
	}

	async function takethAway() {
		($actor.items.find(x => x.id === $actor.flags['pf2e-graphics']?.tokenImageID))?.delete();
		$actor.unsetFlag('pf2e-graphics', 'tokenImageID');
	}

	async function modifieth(e: Event) {
		$actor.setFlag('pf2e-graphics', 'tokenImageID', (e.target as HTMLSelectElement)?.value);
		$actor.setFlag('pf2e-graphics', 'displayFeat', true);
	}

	let display = $actor.getFlag('pf2e-graphics', 'displayFeat') as boolean;
	async function invisibility() {
		$actor.setFlag('pf2e-graphics', 'displayFeat', display);
	}

	async function createRule(_event: Event, rules?: TokenImageRuleSource[]) {
		await $feat?.update({ 'system.rules': $feat.system.rules.concat(rules ?? ruleTemplate($feat)) });
	}

	async function removeRule(rule: RuleElementSource) {
		await $feat?.update({ 'system.rules': $feat.system.rules.filter(x => x !== rule) });
	}

	async function updateRules(toUpdate?: CustomTokenImage, updateWith?: Partial<CustomTokenImage>) {
		const rules = $feat.system.rules;
		if (toUpdate && updateWith) {
			// Doing black magic just to get around APPARENT Object.preventExtensions()
			rules[rules.findIndex(x => x === toUpdate)] = foundry.utils.mergeObject({ ...toUpdate }, updateWith);
		}

		await $feat?.update({ 'system.rules': rules });
	}

	async function PickAFile(current: string) {
		// @ts-ignore Good grief, why cant all these be FilePicker options be OPTIONAL?
		return new Promise(resolve => new FilePicker({ current, callback: result => resolve(result) }).browse());
	}

	function isCustomTokenImage(rule: RuleElementSource): rule is CustomTokenImage {
		return rule.key === 'TokenImage';
	}

	let toggleExisting = false;

	const TransitionFilters = Object.values(TextureTransitionFilter.TYPES);
	const EaseNames = Object.values(Object.keys(CanvasAnimation).filter(x => x.includes('ease')));

	let showImagePacks = false;
	let packToImport: TokenImageRuleSource[] = [];
</script>

<div class='p-2 pb-0 flex flex-col h-full w-full'>
	{#if $tokenImageID && $feat}
		<div
			class='
				flex-grow flex-shrink
				overflow-y-scroll
				mb-2 text-center
				contain-strict
			'
			style:content-visibility='auto'
		>
			{#each $feat.system.rules.filter(isCustomTokenImage) as rule}
				<div class='p-2 m-1 border border-solid rounded-md bg-gray-400 bg-opacity-20'>
					<section class='flex items-center mb-1'>
						<h3 class='border-b-0'>
							<i class='fa-regular fa-circle align-middle'></i>
							Token Image
						</h3>
						<div class='ml-auto flex items-center'>
							<label class='flex items-center' data-tooltip='PF2E.RuleEditor.General.PriorityHint'>
								<i class='fa-solid fa-fw fa-list-ol mr-1'></i>
								<input
									class='h-8 w-10'
									type='number'
									bind:value={rule.priority}
									on:change={() => updateRules()} />
							</label>
							<button
								on:click={() => removeRule(rule)}
								class='fas fa-trash-can size-8'></button>
						</div>
					</section>
					<div class='grid grid-cols-5 items-center gap-1.5
						[&>section]:col-span-4
						[&>span]:justify-self-start
						[&>span]:pl-1
					'>
						<!-- #region Predicate -->
						<span>
							Predicate:
						</span>
						<PredicateSection {rule} {updateRules} />

						<!-- #endregion -->
						<!-- #region Token Image -->
						<span>
							Token Image:
						</span>
						<section class='flex gap-1 items-center flex-grow'>
							<TokenThumbnail
								img={rule.value}
								transform={rule.scale ?? $feat.actor.prototypeToken.texture.scaleX}
							/>
							<input
								class='h-6 bg-opacity-50 bg-slate-100'
								type='text'
								placeholder='path/to/file.ext'
								bind:value={rule.value}
								on:change={() => updateRules()}
							/>
							<button
								class='fas fa-file-import w-10 bg-button h-6'
								type='button'
								data-tooltip={i18n('FILES.BrowseTooltip')}
								aria-label={i18n('FILES.BrowseTooltip')}
								tabindex='-1'
								on:click={() => PickAFile(rule.value).then((x) => {
									rule.value = String(x);
									updateRules();
								})}
							></button>
						</section>
						<!-- #endregion -->
						<!-- #region Transitions -->
						<span>
							Animation:
						</span>
						<section class='
							grid grid-cols-2 gap-2
							border border-solid p-1 rounded-sm bg-opacity-50 bg-slate-100 flex-grow'
						>
							<!-- Sneakily update the data to include the object lest all shit below breaks -->
							{Number(rule.animation ??= {}) || ''}
							<label class='grid grid-cols-2 items-center'>
								Transition:
								<select name='transition'
									bind:value={rule.animation.transition}
									on:change={() => updateRules()}>
									{#each TransitionFilters as value}
										<option {value}>{value.titleCase()}</option>
									{/each}
								</select>
							</label>
							<label class='grid grid-cols-2 items-center'>
								Duration:
								<input class="" type='number'
									bind:value={rule.animation.duration}
									on:change={() => updateRules()} />
							</label>
							<label class='grid grid-cols-2 items-center'>
								<span>
									<a class='no-underline' href='https://easings.net/' data-tooltip='pf2e-graphics.easingTooltip'>
										<i class='fa fa-info-circle size-4'></i>
									</a>
									Easing:
								</span>
								<select name='easing'
									bind:value={rule.animation.easing}
									on:change={() => updateRules()}>
									<option value=""></option>
									{#each EaseNames as value}
										<option {value}>{value}</option>
									{/each}
								</select>
							</label>
						</section>
						<!-- #endregion -->
						<!-- #region Options -->
						<span>
							Options:
						</span>
						<section class='
							grid grid-cols-2 gap-2
							border border-solid p-1 rounded-sm bg-opacity-50 bg-slate-100 flex-grow'
						>
							<label class='grid grid-cols-2 items-center'>
								Scale:
								<input type='number'
									step='0.1'
									min='0.1'
									max='4'
									bind:value={rule.scale}
									on:change={() => updateRules()} />
							</label>
							<label class='grid grid-cols-2 items-center'>
								Tint:
								<div class='flex h-6 items-center gap-1'>
									<input class='w-24' type='color'
										bind:value={rule.tint}
										on:change={() => updateRules()} />
									<button
										class='fa fa-refresh bg-button h-6 w-10'
										on:click={() => {
											rule.tint = undefined;
											updateRules();
										}}
									></button>
								</div>
							</label>
							<label class='grid grid-cols-2 items-center'>
								Opacity / Alpha:
								<input class="" type='number'
									step='0.1' min='0.1' max='1'
									bind:value={rule.alpha}
									on:change={() => updateRules()} />
							</label>
						</section>
						<!-- #endregion -->
					</div>
				</div>
			{/each}
			<div class='flex w-2/3 text-nowrap mx-auto flex-grow basis-1/2 h-8'>
				<button class='m-1 h-full' on:click={createRule}>
					<i class='fas fa-plus'></i>
					Create Token Image
				</button>
				{#if !showImagePacks}
					<button class='m-1 h-full' on:click={() => { showImagePacks = !showImagePacks; }}>
						<i class='fas fa-plus'></i>
						Import Token Image Pack
					</button>
				{:else}
					<div class='m-1 h-full w-full flex'>
						<select class='w-full h-full block flex-grow' bind:value={packToImport}>
							{#each AnimCore.getTokenImages() as pack}
								<option value={pack.rules}>
									{pack.uuid ? window.fromUuidSync(pack.uuid)?.name : pack.name}
									{pack.requires ? `(${pack.requires})` : ''}
								</option>
							{/each}
						</select>
						<button class='fas fa-plus w-min' on:click={e => createRule(e, packToImport)}></button>
					</div>
				{/if}
			</div>
		</div>
		<div class='grid grid-flow-col columns-2 gap-1 p-1 pt-0'>
			<div class='flex items-center'>
				<label for='displayFeat'>Display Feat on Character Sheet</label>
				<input type='checkbox' id='displayFeat' bind:checked={display} on:change={invisibility} />
			</div>
			<button class='' on:click={takethAway}>
				<i class='fa fa-trash-can pr-1'></i>{i18n('Delete')}
			</button>
			<button class='' on:click={() => $feat.sheet.render(true)}>
				<i class='fa fa-folder-open pr-1'></i>{i18n('actorAnimation.openFeat')}
			</button>
		</div>
	{:else}
		<div class='w-full h-full text-center content-center mx-auto'>
			<div>
				<p>
					The actor does not have a dedicated token image feature!
				</p>
				<p>
					Choose one of the options below:
				</p>
			</div>
			<div class='flex items-center gap-1 h-8 '>
				<button class='m-1 basis-1/2' on:click={giveth}>
					Create a New Feature
				</button>
				<span>or...</span>
				{#if toggleExisting}
					<select on:change={modifieth} class='block w-full h-full m-1 basis-1/2'>
						<option value="">
							<span>None</span>
						</option>
						{#each $actor.items.filter(x => x.type === 'feat' || x.type === 'action') as item}
							<option value={item.id}>
								<span>{item.name}</span>
							</option>
						{/each}
					</select>
				{:else}
					<button class='m-1 basis-1/2' on:click={() => { toggleExisting = !toggleExisting; }}>
						Select an Existing Feature
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
