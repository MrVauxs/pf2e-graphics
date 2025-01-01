<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';

	export let data: AnimationSetItemPartial;
	export let readonly: boolean;

	function addType() {
		if (!data.execute || data.execute.type !== 'crosshair') return;
		data.execute.template = {
			type: 'token',
			relativeTo: 'SOURCES',
		};
		// @ts-expect-error We are ignoring this so Svelte doesnt shit itself on attempting to null-coalesce (?.)
		data.execute.template.size = {
			default: 5,
		};
	}
</script>
{#if !data.execute || data.execute?.type !== 'crosshair'}
	<p>This isn't the right component! Something went extremely wrong if you are seeing this!</p>
{:else}
	<div class='space-y-2'>
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				Name
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					type='text'
					bind:value={data.execute.name}
					{readonly}
					disabled={readonly}
				/>
			</div>
		</label>
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				Label
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					type='text'
					bind:value={data.execute.label}
					{readonly}
					disabled={readonly}
				/>
			</div>
		</label>
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				Template
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				{#if data.execute.template}
					<select
						bind:value={data.execute.template.type}
						disabled={readonly}
					>
						<option value='token'>Token</option>
						<option value='CIRCLE'>Circle</option>
						<option value='CONE'>Cone</option>
						<option value='RAY'>Ray</option>
					</select>
				{:else}
					<button on:click={addType}>
						<i class='fa fa-plus'></i>
					</button>
				{/if}
			</div>
		</label>

		{#if data.execute.template && data.execute.template.type === 'token'}
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Relative To
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='col-span-2 grid grid-cols-2 justify-items-center'>
					<label>
						Sources
						<input
							type='radio'
							name='scoops'
							value='SOURCES'
							bind:group={data.execute.template.relativeTo}
						/>
					</label>
					<label>
						Targets
						<input
							type='radio'
							name='scoops'
							value='TARGETS'
							bind:group={data.execute.template.relativeTo}
						/>
					</label>
				</div>
			</label>
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Padding
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input type='number' bind:value={data.execute.template.padding} step='1' min='0' />
				</div>
			</label>
		{/if}
		{#if data.execute.template && data.execute.template.type !== 'token'}
			{#if !data.execute.template.size}
				{data.execute.template.size = { default: 5 }}
			{:else}
				<!-- Set the Default, Min, Max -->
				<label class='grid grid-cols-3 items-center'>
					<span data-tooltip='TODO: Explain'>
						Default Size
						<i class='fa fa-info-circle pl-px'></i>
					</span>
					<div class='flex align-middle items-center col-span-2'>
						<input type='number' bind:value={data.execute.template.size.default} step='5' min='0' />
					</div>
				</label>
				<label class='grid grid-cols-3 items-center'>
					<span data-tooltip='TODO: Explain'>
						Min Size
						<i class='fa fa-info-circle pl-px'></i>
					</span>
					<div class='items-center col-span-2 grid grid-cols-3 gap-2'>
						<input
							type='number'
							bind:value={data.execute.template.size.min}
							step='5' min='0'
							placeholder='0'
						/>

						<label class='grid grid-cols-3 items-center col-span-2 gap-2'>
							<span data-tooltip='TODO: Explain'>
								Max Size
								<i class='fa fa-info-circle pl-px'></i>
							</span>
							<div class='flex align-middle items-center col-span-2'>
								<input type='number' bind:value={data.execute.template.size.max} step='5' min='0' placeholder='Infinite...?' />
							</div>
						</label>
					</div>
				</label>
			{/if}
		{/if}
		{#if data.execute.template && data.execute.template.type === 'CONE'}
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Angle
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input type='number' bind:value={data.execute.template.angle} step='10' min='0' max='360' />
				</div>
			</label>
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Direction
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input type='number' bind:value={data.execute.template.direction} step='10' min='-180' max='180' />
				</div>
			</label>
		{/if}
		{#if data.execute.template && data.execute.template.type === 'RAY'}
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Width
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input type='number' bind:value={data.execute.template.width} step='5' min='0' />
				</div>
			</label>
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Direction
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input type='number' bind:value={data.execute.template.direction} step='10' min='-180' max='180' />
				</div>
			</label>
		{/if}
	</div>
{/if}
