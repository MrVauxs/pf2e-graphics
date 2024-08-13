<script lang='ts'>
	import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document'
	import { devMessage } from 'src/utils'

	export let doc: TJSDocument<ActorPF2e>

	devMessage($doc)
</script>

work in progress, this tab will show all animations that are stored on their items
