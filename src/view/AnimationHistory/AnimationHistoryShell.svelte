<svelte:options accessors={true} />

<script lang='ts'>
	import type { AnimationHistoryObject } from 'src/storage/AnimCore';
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import { i18n } from '../../utils';

	export let elementRoot: HTMLElement;
	let sidebarElement: HTMLElement;

	const history = window.pf2eGraphics.history;
	let selected: undefined | AnimationHistoryObject;

	function clearHistory() {
		history.set([]);
	}

	history.subscribe(async () => {
		selected = $history.at(-1);
		sidebarElement?.scroll({ top: sidebarElement.scrollHeight, behavior: 'smooth' });
	});

	let search = '';
</script>

<ApplicationShell bind:elementRoot>
	<div class='flex flex-row gap-1 h-[calc(100%-2rem)]'>
		<aside
			class='
				flex flex-col gap-1
				w-1/3 pr-1
				overflow-y-scroll overflow-x-hidden
			'
			style:content-visibility='auto'
			bind:this={sidebarElement}
		>
			{#if $history.length}
				{#each $history as entry}
					<section
						class='
							flex p-1
							border border-solid border-gray-500 rounded-sm
							bg-gray-400/25
							hover:shadow-inner
							hover:bg-gray-500/25
						'
						role='button'
						tabindex='0'
						on:click={() => (selected = entry)}
						on:keydown={() => (selected = entry)}
					>
						<header class='[&>p]:m-0 w-full'>
							<p class='text-lg text-nowrap truncate'>{entry.item?.name ?? '???'}</p>
							<p class='text-xs align-right'>
								{@html i18n('pf2e-graphics.history.window.data.summary', {
									trigger: entry.trigger,
									name: entry.actor.name,
								})}
								<span class='float-right'>
									<i
										data-tooltip={entry.animations.length > 1
											? i18n('pf2e-graphics.history.window.data.count.many', {
												count: entry.animations.length,
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
			{:else}
				<i class='text-gray-500 opacity-50 text-center my-auto'>No animations.</i>
			{/if}
		</aside>
		<main class='w-2/3 flex overflow-hidden'>
			{#if selected}
				{#key selected}
					<div class='w-2/3'>
						<div class='flex flex-row gap-1 border border-solid rounded-md'>
							<div class='self-center text-lg leading-3 pl-1'>
								{i18n('pf2e-graphics.history.window.search')}
							</div>
							<input type='text' bind:value={search} />
						</div>
						<ul
							class='overflow-y-scroll px-1 list-none text-ellipsis overflow-x-hidden leading-5 h-full text-nowrap'
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
					</div>
				{/key}
			{/if}
		</main>
	</div>
	<footer class='grow-0 py-1 h-8'>
		<button type='button' on:click={clearHistory}>
			<i class='fa fa-trash'></i>
			{i18n('pf2e-graphics.history.window.clear')}
		</button>
	</footer>
</ApplicationShell>
