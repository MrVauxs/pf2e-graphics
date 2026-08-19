<script lang='ts'>
	import type { Content } from 'svelte-jsoneditor';
	import type { BasicAppExternal, BasicAppOptions } from './AnimationDocumentApp';
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import { clearEmpties, devLog } from 'src/utils';
	import { getContext } from 'svelte';
	import JsonEditor from '../_components/JSONEditor.svelte';
	import EditorShell from './EditorShell.svelte';

	interface Props {
		elementRoot: HTMLElement;
	}

	let { elementRoot = $bindable() }: Props = $props();

	// TRL locates the application root via an `elementRoot` get/set pair on the component
	// (`applicationShellContract` in `@typhonjs-fvtt/runtime/svelte/application`). Re-exporting the
	// bindable prop emits exactly that accessor pair, which is what `accessors={true}` used to provide
	// in legacy mode — so this component can stay in runes mode. Removing this export makes TRL throw
	// "No application shell contract found".
	export { elementRoot };

	// The external context object is supplied once by TRL and never reassigned, so it needs no
	// reactive wrapper (the migration tool added a redundant `$state()` here).
	const { application } = getContext<BasicAppExternal>('#external');
	let animation = $state(application.options.animation);
	let json = $derived(clearEmpties(foundry.utils.deepClone(animation)));

	// `application.options` is a plain TRL object rather than `$state`, so mutating it no longer
	// re-renders anything: Svelte 4's compiler used to rewrite `application.options.tab = x` into
	// an invalidation of `application` itself, and runes mode does not. Keep the active tab in
	// local state and write through to the options so it still survives a re-render of the app.
	let tab: NonNullable<BasicAppOptions['tab']> = $state(application.options.tab ?? 'main');

	function setTab(next: typeof tab) {
		tab = next;
		application.options.tab = next;
	}

	function onChange(content: Content) {
		devLog('JSONEditor OnChange:', content);
		if ('json' in content) {
			animation = clearEmpties(content.json as typeof animation);
			application.save(animation);
		} else if ('text' in content) {
			const json = clearEmpties(JSON.parse(content.text));
			devLog('Parsed JSON:', json);
			animation = json;
			application.save(animation);
		}
	}

</script>

<ApplicationShell bind:elementRoot>
	<div class='flex flex-col overflow-hidden p-3'>
		<header class='grow-0'>
			<nav class='flex'>
				<button
					onclick={() => setTab('main')}
					class:underline={tab === 'main'}
					class='
						p-2 -my-2 leading-4
						bg-transparent border-0
						underline-offset-2 decoration-red-700
						hover:shadow-none
						hover:underline hover:decoration-red-800 hover:decoration-dashed
					'>
					Main
				</button>
				<button
					onclick={() => setTab('json')}
					class:underline={tab === 'json'}
					class='
						p-2 -my-2 leading-4
						bg-transparent border-0
						underline-offset-2 decoration-red-700
						hover:shadow-none
						hover:underline hover:decoration-red-800 hover:decoration-dashed
					'>
					Raw Data
				</button>
			</nav>
			<hr />
		</header>
		<main class='grow overflow-y-auto'>
			{#if tab === 'main'}
				<EditorShell bind:animation readonly={application.options.readonly} />
			{:else if tab === 'json'}
				<JsonEditor
					{json}
					{onChange}
				/>
			{/if}
		</main>
		<footer class='flex gap-1 grow-0 pt-2'>
			{#if !application.options.readonly}
				<button onclick={() => application.save(animation)}>
					Save
				</button>
				<button onclick={() => {
					application.save(animation);
					application.close({ dontSave: true });
				}}>
					Save and Close
				</button>
			{/if}
		</footer>
	</div>
</ApplicationShell>
