<svelte:options accessors={true} />

<script lang='ts'>
	import type { AnimationHistoryObject } from 'src/storage/AnimCore';
	import type { Mode } from 'svelte-jsoneditor';
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import { onMount, tick } from 'svelte';
	import { i18n, nonEmpty } from '../../utils';

	export let elementRoot: HTMLElement;
	let sidebarElement: HTMLElement;

	const history = window.pf2eGraphics.history;
	let selected: undefined | AnimationHistoryObject;
	let userSelected = false;

	function clearHistory() {
		history.set([]);
	}

	onMount(() => {
		setTimeout(() => {
			if (!sidebarElement) return;
			const el = sidebarElement.lastElementChild as HTMLButtonElement;
			if (el) el.scrollIntoView({ behavior: 'instant' });
		}, 1);
		return history.subscribe(() => {
			tick().then(() => {
				if (!sidebarElement) return;
				const el = sidebarElement.lastElementChild as HTMLButtonElement;
				if (!userSelected && el) {
					el.scrollIntoView({ behavior: 'smooth' });
					el.click();
				}
			});
		});
	});

	let search = '';
	let json = false;
	const mode = 'text' as Mode;
</script>

<ApplicationShell bind:elementRoot>
	{#if $history.length === 0}
		<div style:display='flex' style:flex-flow='column'>
			<p class='text-gray-500 opacity-50 text-center my-auto'>
				<i>No animations recorded.</i>
			</p>
		</div>
	{:else}
		<div class='flex flex-row gap-1 h-[calc(100%-2rem)]'>
			<aside
				class='
					flex flex-col gap-1
					w-1/4 pr-1
					overflow-y-scroll overflow-x-hidden
				'
				style:content-visibility='auto'
				bind:this={sidebarElement}
			>
				{#each $history as entry, index}
					<section
						class='
							flex p-1
							border border-solid border-gray-500 rounded-sm
							bg-gray-400/25
							hover:bg-gray-500/25
							hover:cursor-pointer
							shadow-slate-600
						'
						class:shadow-inner={selected === entry}
						role='button'
						tabindex='0'
						on:click={() => {
							selected = entry;
							if ((index + 1) !== $history.length) {
								userSelected = true;
							} else {
								userSelected = false;
							};
						}}
						on:keydown={() => {
							selected = entry;
							if ((index + 1) !== $history.length) {
								userSelected = true;
							} else {
								userSelected = false;
							};
						}}
					>
						<header class='[&>p]:m-0 w-full'>
							<p class='text-lg text-nowrap truncate'>
								{#if entry.item?.name}{entry.item.name}{:else}<i>Unknown</i>{/if}
							</p>
							<p class='text-xs align-right'>
								{@html i18n('pf2e-graphics.history.window.data.summary', {
									trigger: entry.trigger,
									name: entry.actor.name,
								})}
								<span class='float-right'>
									<i
										data-tooltip={entry.animations.length > 1
											? i18n('pf2e-graphics.history.window.data.count.many', {
												count: String(entry.animations.length),
											})
											: entry.animations.length === 1
											? i18n('pf2e-graphics.history.window.data.count.one')
											: i18n('pf2e-graphics.history.window.data.count.zero')}
										class="fa {entry.animations.length ? 'fa-check' : 'fa-xmark'}"
									>
									</i>
									{window.foundry.utils.timeSince(new Date(entry.timestamp))}
								</span>
							</p>
						</header>
					</section>
				{/each}
			</aside>
			<main class='w-3/4 flex'>
				{#if selected}
					{#if !json}
						<div class='w-2/3'>
							<div class='flex flex-row gap-1 border border-solid rounded-md'>
								<div class='self-center text-lg leading-3 pl-1'>
									{i18n('pf2e-graphics.history.window.search')}
								</div>
								<input type='text' bind:value={search} />
							</div>
							<ul
								class='
									px-1 h-[calc(100%-2rem)]
									overflow-y-scroll overflow-x-hidden
									list-none text-ellipsis
									leading-5 text-nowrap
								'
							>
								{#each selected.rollOptions.filter(option => option
									.toLowerCase()
									.includes(search.toLowerCase())) as option}
									<li class='even:bg-black/10 px-2 -mx-2 select-text'>
										{option}
									</li>
								{/each}
							</ul>
						</div>
					{:else}
						<div class='w-2/3 text-xs' style:--jse-font-size-mono='12px'>
							{#await import('svelte-jsoneditor')}
								Waiting for extra JSONEditor code...
							{:then Module}
								<Module.JSONEditor
									content={{ json: selected }}
									readOnly={true}
									{mode}
									navigationBar={false}
									statusBar={false}
									indentation='	'
									tabSize={2}
								/>
							{/await}
						</div>
					{/if}
					<div class='w-1/3 p-2 [&>section]:pb-2'>
						<section>
							<h4 class='text-lg bold w-full border-0 border-b border-solid'>
								{i18n('pf2e-graphics.history.window.data.actor.header')}
							</h4>
							{selected.actor.name}
						</section>
						<section>
							<h4 class='text-lg bold w-full border-0 border-b border-solid'>
								{i18n('pf2e-graphics.history.window.data.trigger.header')}
							</h4>
							<code>{selected.trigger}</code>
						</section>
						<section>
							<h4 class='text-lg bold w-full border-0 border-b border-solid'>
								{i18n('pf2e-graphics.history.window.data.user.header')}
							</h4>
							{#if selected.user?.name}
								{selected.user.name}
							{:else}
								<i>{i18n('pf2e-graphics.history.window.data.user.unknown')}</i>
							{/if}
						</section>
						{#if selected.triggerContext && nonEmpty(selected.triggerContext)}
							<section>
								<h4 class='text-lg bold w-full border-0 border-b border-solid'>
									{i18n('pf2e-graphics.history.window.data.triggerContext.header')}
								</h4>
								{#each Object.keys(selected.triggerContext) as key}
									<b><code>{key}</code>:</b>
									<code>
										{JSON.stringify(
											// @ts-ignore-error Can't easily index objects
											selected.triggerContext[key],
											undefined,
											'\t',
										)}
									</code>
								{/each}
							</section>
						{/if}
						<div>
							<button
								type='button'
								on:click={() => {
									json = !json;
								}}
							>
								{json ? 'Text' : 'JSON'}
							</button>
						</div>
					</div>
				{/if}
			</main>
		</div>
		<footer class='grow-0 py-1 h-8'>
			<button type='button' on:click={clearHistory}>
				<i class='fa fa-trash'></i>
				{i18n('pf2e-graphics.history.window.clear')}
			</button>
		</footer>
	{/if}
</ApplicationShell>
