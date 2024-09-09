<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document';
	import derivedFlag from 'src/lib/docFlagDerived';
	import { AnimCore, type JSONData } from 'src/storage/AnimCore';
	import { type Writable, writable } from 'svelte/store';
	import { ErrorMsg, nonNullable } from 'src/utils';
	import JSONEditorApp from './JSONEditor/JSONEditor';
	import SingleEditor from './AnimationSubEditor.svelte';

	export let doc: TJSDocument<ActorPF2e | ItemPF2e | UserPF2e> | Writable<{ id: 'settings' }>;
	export function createAnimation() {}
	const inStasis = writable(true);

	const flag = $doc.id === 'settings'
		? writable(window.pf2eGraphics.liveSettings.worldAnimations) as Writable<JSONData>
		// @ts-ignore Above is a type guard
		: derivedFlag(doc, 'pf2e-graphics', 'customAnimations', {} as JSONData, 500);

	if ($doc.id === 'settings') {
		inStasis.set(!game.user.can('SETTINGS_MODIFY'));

		flag.subscribe((v) => {
			game.settings.set('pf2e-graphics', 'worldAnimations', v);
		});

		flag.subscribe((v) => {
			const newFlag = Object.fromEntries(Object.entries(v).filter(([,v]) => nonNullable(v)));

			if (Object.keys(newFlag).length !== Object.keys(v).length)
				flag.set(Object.fromEntries(Object.entries(v).filter(([,v]) => nonNullable(v))));
		});
	} else {
		inStasis.set(!($doc as ActorPF2e | ItemPF2e | UserPF2e).canUserModify(game.user, 'update'));
	}

	if (!flag) throw new ErrorMsg('No document was provided to AnimationEditor?!');

	let search = '';
	let newAnimeKey = '';

	function openJSON(event: MouseEvent) {
		new JSONEditorApp({
			id: `pf2e-graphics-${$doc.id}`,
			store: flag,
			stasis: $inStasis ? undefined : event.shiftKey ? undefined : inStasis,
			readOnly: $inStasis || event.shiftKey ? true : undefined,
			validate: true,
			permission: 'canUserModify' in $doc ? $doc.canUserModify(game.user, 'update') : true,
		}).render(true);
	}

	function addNew() {
		if (newAnimeKey.trim().length) {
			$flag[newAnimeKey.trim()] ??= [AnimCore.CONST.TEMPLATE_ANIMATION()];
			newAnimeKey = '';
		} else {
			newAnimeKey = ($doc as ItemPF2e)?.slug ? `item:slug:${($doc as ItemPF2e).slug}` : ' ';
		}
	}
</script>

<div class='
	flex
	border border-solid rounded-sm
	mb-1 p-1
	overflow-clip
'>
	<div class='[&>*:not(:first-child)]:mx-1 my-auto flex items-center text-nowrap'>
		<span><i class='fa fa-search'></i> Search</span><input bind:value={search} />
	</div>

	<button
		class='fa fa-brackets-curly size-8 ml-auto'
		data-tooltip='pf2e-graphics.jsonEditorTooltip'
		on:click={openJSON}
	></button>
	{#if newAnimeKey.length}
		<input bind:value={newAnimeKey} />
	{/if}
	<button
		class='fa fa-add size-8 text-lg leading-4'
		data-tooltip='pf2e-graphics.addAnim'
		on:click={addNew}
		disabled={$inStasis}
	></button>
</div>
<div
	class='
		flex flex-col gap-1
		contain-strict
	'
	style:content-visibility='auto'
>
	{#each Object.keys($flag).filter(k => k.includes(search)) as key}
		<SingleEditor
			bind:key
			bind:value={$flag[key]}
			bind:disabled={$inStasis}
			flag={flag}
		/>
	{/each}
</div>
