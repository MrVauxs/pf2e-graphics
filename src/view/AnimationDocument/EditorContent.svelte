<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';
	import type { AnimationSetDocument } from 'src/extensions';
	import { log } from 'src/utils';

	export let data: AnimationSetItemPartial;
	export let animation: AnimationSetDocument;

	log(animation);
	$: log(data);
</script>

<code>
	{JSON.stringify(data)}
</code>
