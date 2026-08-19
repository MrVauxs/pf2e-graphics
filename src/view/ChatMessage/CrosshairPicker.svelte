<script lang='ts'>
	import type { ChatMessagePF2e } from 'foundry-pf2e';
	import { devLog } from 'src/utils';
	import { onMount } from 'svelte';

	interface Props {
		message: ChatMessagePF2e;
	}

	let { message }: Props = $props();

	onMount(() => {
		devLog('Mounted Message Svelte Component');
		return () => devLog('Destroyed Message Svelte Component');
	});

	function play() {
		devLog('Play', message.getFlag('pf2e-graphics', 'arguments'));
	}
</script>

<div class='pf2e-g'>
	<div class='
		p-2 px-6 relative
		bg-purple-400/25 rounded-xs
		space-y-2
	'>
		<button class='flex flex-col items-center' onclick={play}>
			Select crosshairs.
		</button>
		<div class='absolute top-0 right-0 !m-1'>
			<i class='fas fa-info-circle' data-tooltip='Added by PF2e Graphics'></i>
		</div>
	</div>
</div>
