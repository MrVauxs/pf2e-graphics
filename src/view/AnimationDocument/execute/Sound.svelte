<script lang='ts'>
	import type { AnimationSetContentsItem } from 'schema/payload';

	interface Props {
		data: AnimationSetContentsItem<'sound'>;
		readonly: boolean;
	}

	let { data = $bindable(), readonly }: Props = $props();
</script>
{#if !data.execute}
	{#if !readonly}
		<p><em>Attempted to render a 'sound' execute section without an execute object present.</em></p>
	{/if}
{:else}
	<div class='space-y-2'>
		{#if !data.execute.sound}
			<!-- If wrong, don't! -->
			{(data.execute.sound = []) && ''}
		{:else}
			<label class='grid grid-cols-3 items-center'>
				<span class='flex items-center' data-tooltip='TODO: Explain'>
					Sound
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input
						list='graphic'
						type='text'
						value={data.execute.sound?.length ? JSON.stringify(data.execute.sound) : ''}
						onchange={(e) => {
							if (!data.execute) data.execute = {};
							if (e.currentTarget.value) {
								try {
									const val = JSON.parse(e.currentTarget.value);
									if (!Array.isArray(val)) {
										ui.notifications.error('Sound must be an array of strings! ex. <code>["jb2a.arrow"]</code>');
									} else {
										data.execute.sound = JSON.parse(e.currentTarget.value);
									}
								} catch {
									ui.notifications.error('The current Sound value is not valid JSON.');
								}
							} else {
								data.execute.sound = [];
							};
						}}
						{readonly}
						disabled={readonly}
						placeholder='["graphics-sfx.generic.miss.01"]'
					/>
				</div>
			</label>
		{/if}
	</div>
{/if}
