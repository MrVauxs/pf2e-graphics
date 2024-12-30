<svelte:options accessors={true} />

<script lang='ts'>
	import type { BasicAppExternal } from './AnimationDocumentApp';
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import { getContext } from 'svelte';

	export let elementRoot: HTMLElement;
	const { application } = getContext<BasicAppExternal>('#external');
	const { animation } = application.options;
</script>

<ApplicationShell bind:elementRoot>
	{animation.rollOption}
</ApplicationShell>
