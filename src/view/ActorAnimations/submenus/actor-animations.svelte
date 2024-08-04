<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import type { moduleFlags } from 'src/extensions'
	import { devMessage } from 'src/utils'
	import writableDerived from 'svelte-writable-derived'
	import type { Writable } from 'svelte/store'

	export let doc: TJSDocument<ActorPF2e>

	const flag = writableDerived(
		doc,
		$doc => $doc.getFlag('pf2e-graphics', 'customAnimations'),
		data => $doc.setFlag('pf2e-graphics', 'customAnimations', data) as unknown as ActorPF2e,
	) as Writable<moduleFlags>
	$: devMessage($doc, $flag)
</script>

{$flag?.customAnimations}

a
