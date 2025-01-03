<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';
	import Svelecte from 'svelecte';

	export let data: AnimationSetItemPartial;
	export let readonly: boolean;

	// TODO: .location, .borderColor, .fillColor, .icon

	function addType() {
		if (!data.execute || data.execute.type !== 'crosshair') return;
		data.execute.template = {
			type: 'token',
			relativeTo: 'SOURCES',
		};
	}
</script>
{#if !data.execute || data.execute?.type !== 'crosshair'}
	<p>This isn't the right component! Something went extremely wrong if you are seeing this!</p>
{:else}
	<div class='space-y-2'>
		<!-- #region Name -->
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
		<!-- #endregion -->
		<!-- #region Label -->
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
		<!-- #endregion -->
		<!-- #region Template -->
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
							disabled={readonly}
						/>
					</label>
					<label>
						Targets
						<input
							type='radio'
							name='scoops'
							value='TARGETS'
							bind:group={data.execute.template.relativeTo}
							disabled={readonly}
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
					<input
						type='number'
						bind:value={data.execute.template.padding}
						step='1' min='0'
						disabled={readonly}
					/>
				</div>
			</label>
		{/if}
		{#if data.execute.template && data.execute.template.type !== 'token'}
			{#if !data.execute.template.size}
				<!-- If wrong, don't! -->
				{(data.execute.template.size = { default: 5 }) && ''}
			{:else}
				<label class='grid grid-cols-3 items-center'>
					<span data-tooltip='TODO: Explain'>
						Default Size
						<i class='fa fa-info-circle pl-px'></i>
					</span>
					<div class='flex align-middle items-center col-span-2'>
						<input
							type='number'
							bind:value={data.execute.template.size.default}
							step='5' min='0'
							disabled={readonly}
						/>
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
							disabled={readonly}
						/>

						<label class='grid grid-cols-3 items-center col-span-2 gap-2'>
							<span data-tooltip='TODO: Explain'>
								Max Size
								<i class='fa fa-info-circle pl-px'></i>
							</span>
							<div class='flex align-middle items-center col-span-2'>
								<input
									type='number'
									bind:value={data.execute.template.size.max}
									step='5' min='0'
									placeholder='Infinite...?'
									disabled={readonly}
								/>
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
					<input
						type='number'
						bind:value={data.execute.template.angle}
						step='10' min='0' max='360'
						disabled={readonly}
					/>
				</div>
			</label>
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Direction
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input
						type='number'
						bind:value={data.execute.template.direction}
						step='10' min='-180' max='180'
						disabled={readonly}
					/>
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
					<input
						type='number'
						bind:value={data.execute.template.width}
						step='5' min='0'
						disabled={readonly}
					/>
				</div>
			</label>
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Direction
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input
						type='number'
						bind:value={data.execute.template.direction}
						step='10' min='-180' max='180'
						disabled={readonly}
					/>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Snap -->
		{#if !data.execute.snap}
			<!-- If wrong, don't! -->
			{(data.execute.snap = { position: ['CENTER'] }) && ''}
		{:else}
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Snap Location
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align middle items-center col-span-2'>
					<Svelecte
						options={[
							'BOTTOM_LEFT_CORNER',
							'BOTTOM_LEFT_VERTEX',
							'BOTTOM_RIGHT_CORNER',
							'BOTTOM_RIGHT_VERTEX',
							'BOTTOM_SIDE_MIDPOINT',
							'CENTER',
							'CORNER',
							'EDGE_MIDPOINT',
							'LEFT_SIDE_MIDPOINT',
							'RIGHT_SIDE_MIDPOINT',
							'SIDE_MIDPOINT',
							'TOP_LEFT_CORNER',
							'TOP_LEFT_VERTEX',
							'TOP_RIGHT_CORNER',
							'TOP_RIGHT_VERTEX',
							'TOP_SIDE_MIDPOINT',
							'VERTEX',
						]}
						bind:value={data.execute.snap.position}
						disabled={readonly}
						selectOnTab={true}
						multiple
					/>
				</div>
			</label>
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Snap Direction
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input
						type='number'
						bind:value={data.execute.snap.direction}
						step='1' min='2' max='8'
						disabled={readonly}
					/>
				</div>
			</label>
		{/if}
		<!-- #endregion -->
		<!-- #region Lock Drag -->
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				Lock Drag
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex items-center col-span-2'>
				<input
					type='checkbox'
					bind:checked={data.execute.lockDrag}
					disabled={readonly}
				/>
			</div>
		</label>
		<!-- #endregion -->
		<!-- #region Lock Rotation -->
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				Lock Rotation
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					type='checkbox'
					bind:checked={data.execute.lockManualRotation}
					disabled={readonly}
				/>
			</div>
		</label>
		<!-- #endregion -->
		<!-- #region No Grid Highlight -->
		<label class='grid grid-cols-3 items-center'>
			<span data-tooltip='TODO: Explain'>
				No Grid Highlight
				<i class='fa fa-info-circle pl-px'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					type='checkbox'
					bind:checked={data.execute.noGridHighlight}
					disabled={readonly}
				/>
			</div>
		</label>
		<!-- #endregion -->
	</div>
{/if}
