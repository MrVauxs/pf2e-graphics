<script lang='ts'>
	import type { AnimationSetContentsItem } from 'schema/payload';
	import FadedWrapper from 'src/view/_components/FadedWrapper.svelte';

	export let data: AnimationSetContentsItem<'graphic'>;
	export let readonly: boolean;

	let positionType: 'static' | 'dynamic' = 'static';
	let size: 'absolute' | 'relative' | 'directed' | 'screenSpace' = 'relative';
</script>

{#if !data.execute}
	{#if !readonly}
		<p>
			<em>Attempted to render a 'graphic' execute section without an execute object present.</em>
		</p>
	{/if}
{:else}
	<div class='space-y-2'>
		<!-- #region Graphic -->
		{(data.execute.graphic ??= []) && ''}
		<label class='grid grid-cols-3 items-center'>
			<span class='flex items-center' data-tooltip='TODO: Explain'>
				Graphic
				<i class='fa fa-info-circle px-2 ml-auto'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					list='graphic'
					type='text'
					value={data.execute.graphic?.length ? JSON.stringify(data.execute.graphic) : ''}
					on:change={(e) => {
						if (!data.execute) data.execute = {};
						if (e.currentTarget.value) {
							try {
								const val = JSON.parse(e.currentTarget.value);
								if (!Array.isArray(val)) {
									window.ui.notifications.error(
										'Graphic must be an array of strings! ex. <code>["jb2a.arrow"]</code>',
									);
								} else {
									data.execute.graphic = JSON.parse(e.currentTarget.value);
								}
							} catch {
								window.ui.notifications.error('The current Graphics value is not valid JSON.');
							}
						} else {
							data.execute.graphic = [];
						}
					}}
					{readonly}
					disabled={readonly}
					placeholder='["graphics-vfx.rpg.accelerate"]'
				/>
			</div>
		</label>
		<!-- #endregion -->
		<!-- #region Position -->
		<FadedWrapper showButton={Boolean(data.execute?.position)}>
			<label class='grid grid-cols-3 items-center' slot='title'>
				<span class='flex items-center' data-tooltip='TODO: Explain'>
					Position
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<select
						disabled={readonly || Boolean(data.execute.position)}
						bind:value={positionType}
						class='grow h-8 capitalize'
					>
						{#each ['static', 'dynamic'] as section}
							<option value={section}>{section}</option>
						{/each}
					</select>
					<button
						disabled={readonly}
						class='w-min text-nowrap h-8 ml-1'
						on:click={() => {
							if (!data.execute) return;
							if (data.execute.position) {
								delete data.execute.position;
							} else {
								data.execute.position = {
									type: positionType,
									location: 'SOURCES',
									offset: {
										x: undefined,
										y: undefined,
									},
									anchor: {
										x: undefined,
										y: undefined,
									},
								};
							}
							data = data;
						}}
					>
						{#if data.execute.position}
							<i class='fa fa-trash fa-fw mx-auto'></i>
						{:else}
							<i class='fa fa-plus fa-fw mx-auto'></i>
						{/if}
					</button>
				</div>
			</label>
			{#if data.execute.position}
				{#if data.execute.position.type !== 'screenSpace'}
					<label class='grid grid-cols-3 items-center'>
						<span class='flex items-center' data-tooltip='TODO: Explain'>
							Location
							<i class='fa fa-info-circle px-2 ml-auto'></i>
						</span>
						<datalist id='location'>
							<option>SOURCES</option>
							<option>TARGETS</option>
							<option>TEMPLATES</option>
						</datalist>
						<input
							class='col-span-2'
							list='location'
							type='text'
							bind:value={data.execute.position.location}
							{readonly}
							disabled={readonly}
						/>
					</label>
				{/if}
				<!-- #region Static -->
				{#if data.execute.position.type === 'static'}
					<label class='grid grid-cols-3 items-center'>
						<span class='flex items-center' data-tooltip='TODO: Explain'>
							Move Towards
							<i class='fa fa-info-circle px-2 ml-auto'></i>
						</span>
						<div class='flex items-center gap-2 h-7 col-span-2'>
							<input
								type='checkbox'
								disabled={readonly}
								checked={Boolean(data.execute.position.moveTowards)}
								on:change={(e) => {
									// TODO: Remove unnecessary typecheck in Svelte 5
									if (data.execute?.position?.type !== 'static') return;
									if (e.currentTarget.checked) {
										data.execute.position.moveTowards = { target: 'SOURCES' };
									} else {
										delete data.execute.position.moveTowards;
										data.execute.position = data.execute.position;
									}
								}}
							/>
							{#if data.execute.position.moveTowards}
								<select
									class='grow'
									bind:value={data.execute.position.moveTowards.target}
									disabled={readonly}
								>
									{#each ['SOURCES', 'TARGETS', 'TEMPLATES'] as section}
										<option value={section}>
											{section.toLowerCase().capitalize()}
										</option>
									{/each}
								</select>
							{/if}
						</div>
					</label>
				{/if}
				<!-- #endregion -->
				{#if !data.execute.position.offset}
					<!-- If wrong, don't! -->
					{(data.execute.position.offset = { x: undefined, y: undefined }) && ''}
				{:else}
					<label class='grid grid-cols-3 items-center'>
						<span class='flex items-center' data-tooltip='TODO: Explain'>
							Offset
							<i class='fa fa-info-circle px-2 ml-auto'></i>
						</span>
						<div class='grid grid-cols-2 gap-4 items-stretch col-span-2'>
							<label class='flex items-center gap-2'>
								X
								<input
									type='number'
									bind:value={data.execute.position.offset.x}
									{readonly}
									disabled={readonly}
								/>
							</label>
							<label class='flex items-center gap-2'>
								Y
								<input
									type='number'
									bind:value={data.execute.position.offset.y}
									{readonly}
									disabled={readonly}
								/>
							</label>
						</div>
					</label>
				{/if}

				{#if !data.execute.position.anchor}
					<!-- If wrong, don't! -->
					{(data.execute.position.anchor = { x: undefined, y: undefined }) && ''}
				{:else}
					<label class='grid grid-cols-3 items-center'>
						<span class='flex items-center' data-tooltip='TODO: Explain'>
							Anchor
							<i class='fa fa-info-circle px-2 ml-auto'></i>
						</span>
						<div class='grid grid-cols-2 gap-4 items-stretch col-span-2'>
							<label class='flex items-center gap-2'>
								X
								<input
									type='number'
									bind:value={data.execute.position.anchor.x}
									{readonly}
									disabled={readonly}
									placeholder='0.5'
								/>
							</label>
							<label class='flex items-center gap-2'>
								Y
								<input
									type='number'
									bind:value={data.execute.position.anchor.y}
									{readonly}
									disabled={readonly}
									placeholder='0.5'
								/>
							</label>
						</div>
					</label>
				{/if}

				{#if data.execute.position.type !== 'screenSpace'}
					<!-- Random Offset -->
					<label class='grid grid-cols-3 items-center'>
						<span class='flex items-center' data-tooltip='TODO: Explain'>
							Random Offset
							<i class='fa fa-info-circle px-2 ml-auto'></i>
						</span>
						<div class='flex align-middle items-center col-span-2'>
							<input
								type='number'
								bind:value={data.execute.position.randomOffset}
								{readonly}
								disabled={readonly}
							/>
						</div>
					</label>
					<!-- Grid Units -->
					<label class='grid grid-cols-3 items-center'>
						<span class='flex items-center' data-tooltip='TODO: Explain'>
							Grid Units
							<i class='fa fa-info-circle px-2 ml-auto'></i>
						</span>
						<div class='flex align-middle items-center col-span-2'>
							<input
								type='checkbox'
								bind:checked={data.execute.position.gridUnits}
								{readonly}
								disabled={readonly}
							/>
						</div>
					</label>
					<!-- Local -->
					<label class='grid grid-cols-3 items-center'>
						<span class='flex items-center' data-tooltip='TODO: Explain'>
							Local
							<i class='fa fa-info-circle px-2 ml-auto'></i>
						</span>
						<div class='flex align-middle items-center col-span-2'>
							<input
								type='checkbox'
								bind:checked={data.execute.position.local}
								{readonly}
								disabled={readonly}
							/>
						</div>
					</label>
					<!-- Missed -->
					<label class='grid grid-cols-3 items-center'>
						<span class='flex items-center' data-tooltip='TODO: Explain'>
							Missed
							<i class='fa fa-info-circle px-2 ml-auto'></i>
						</span>
						<div class='flex align-middle items-center col-span-2'>
							<input
								type='number'
								bind:value={data.execute.position.missed}
								{readonly}
								disabled={readonly}
							/>
						</div>
					</label>
				{/if}
			{/if}
		</FadedWrapper>
		<!-- #endregion -->
		<!-- #region Size -->
		<FadedWrapper showButton={Boolean(data.execute.size)}>
			<label class='grid grid-cols-3 items-center' slot='title'>
				<span class='flex items-center' data-tooltip='TODO: Explain'>
					Size / Direction
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<select
						disabled={readonly || Boolean(data.execute.size)}
						bind:value={size}
						class='grow h-8 capitalize'
					>
						{#each ['absolute', 'relative', 'directed', 'screenSpace'] as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
					<button
						disabled={readonly}
						class='w-min text-nowrap h-8 ml-1'
						on:click={() => {
							if (data.execute?.size) {
								if (!data.execute) return;
								delete data.execute.size;
								data = data;
							} else {
								// @ts-ignore-error Lacking typescript support in Svelte 4
								data.execute.size = { type: size };
								data = data;
							}
						}}
					>
						{#if data.execute.size}
							<i class='fa fa-trash fa-fw mx-auto'></i>
						{:else}
							<i class='fa fa-plus fa-fw mx-auto'></i>
						{/if}
					</button>
				</div>
			</label>
			{#if data.execute?.size?.type === 'relative'}
				<label class='grid grid-cols-3 items-center'>
					<span class='flex items-center' data-tooltip='TODO: Explain'>
						Relative To
						<i class='fa fa-info-circle px-2 ml-auto'></i>
					</span>
					<div class='flex align-middle items-center col-span-2'>
						<select
							disabled={readonly}
							class='grow h-8 capitalize'
							bind:value={data.execute.size.relativeTo}
						>
							{#each ['SOURCES', 'TARGETS'] as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</div>
				</label>
				<label class='grid grid-cols-3 items-center'>
					<span class='flex items-center' data-tooltip='TODO: Explain'>
						Scaling
						<i class='fa fa-info-circle px-2 ml-auto'></i>
					</span>
					<div class='flex align-middle items-center col-span-2'>
						<input
							disabled={readonly}
							{readonly}
							type='number'
							bind:value={data.execute.size.scaling}
							min='0.1'
							step='0.1'
							placeholder='1'
							on:change={() => {
								if (
									data.execute
									&& data.execute?.size
									&& data.execute?.size?.type === 'relative'
									&& !data.execute.size?.scaling
								) {
									delete data.execute.size.scaling;
									data = data;
								}
							}}
						/>
					</div>
				</label>
			{/if}
			{#if data.execute?.size?.type === 'directed'}
				<label class='grid grid-cols-3 items-center'>
					<span class='flex items-center' data-tooltip='TODO: Explain'>
						Endpoint
						<i class='fa fa-info-circle px-2 ml-auto'></i>
					</span>
					<div class='flex align-middle items-center col-span-2'>
						<select
							disabled={readonly}
							class='grow h-8 capitalize'
							bind:value={data.execute.size.endpoint}
						>
							{#each ['SOURCES', 'TARGETS'] as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</div>
				</label>
			{/if}
			{#if data.execute?.size?.type === 'screenSpace'}
				Unimplemented!
			{/if}
			{#if data.execute?.size?.type === 'absolute'}
				Unimplemented!
			{/if}
		</FadedWrapper>
		<!-- #endregion -->
		<!-- #region Reflection -->
		<!-- If wrong, don't! -->
		{(data.execute.reflection ??= { x: undefined, y: undefined }) && ''}
		<label class='grid grid-cols-3 items-center'>
			<span class='flex items-center' data-tooltip='TODO: Explain'>
				Reflection
				<i class='fa fa-info-circle px-2 ml-auto'></i>
			</span>
			<div class='grid grid-cols-2 gap-4 items-stretch col-span-2'>
				<label class='flex items-center gap-2'>
					X
					<select bind:value={data.execute.reflection.x} class='w-full'>
						<option value={undefined}>None</option>
						<option value='always'>Always</option>
						<option value='random'>Random</option>
					</select>
				</label>
				<label class='flex items-center gap-2'>
					Y
					<select bind:value={data.execute.reflection.y} class='w-full'>
						<option value={undefined}>None</option>
						<option value='always'>Always</option>
						<option value='random'>Random</option>
					</select>
				</label>
			</div>
		</label>
		<!-- #endregion -->
		<!-- #region Persistent -->
		<label class='grid grid-cols-3 items-center'>
			<span class='flex items-center' data-tooltip='TODO: Explain'>
				Persistent
				<i class='fa fa-info-circle px-2 ml-auto'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input
					disabled={readonly}
					type='checkbox'
					checked={Boolean(data.execute?.persistent)}
					on:change={(e) => {
						if (!data?.execute) return;
						if (e.currentTarget.checked) {
							data.execute.persistent = 'canvas';
						} else {
							delete data.execute.persistent;
						}
						data = data;
					}}
				/>
				{#if data.execute?.persistent}
					<select disabled={readonly || !data.execute.persistent} bind:value={data.execute.persistent}>
						<option value='canvas'>Canvas</option>
						<option value='tokenPrototype'>Token Prototype</option>
					</select>
				{/if}
			</div>
		</label>
		<!-- #endregion -->
		<!-- #region Tie To Documents -->
		<label class='grid grid-cols-3 items-center'>
			<span class='flex items-center' data-tooltip='TODO: Explain'>
				Tie To Documents
				<i class='fa fa-info-circle px-2 ml-auto'></i>
			</span>
			<div class='flex align-middle items-center col-span-2'>
				<input disabled={readonly} {readonly} bind:checked={data.execute.tieToDocuments} type='checkbox' />
			</div>
		</label>
		<!-- #endregion -->
		<!-- #region Visibility -->
		<FadedWrapper>
			<h3 slot='title' class='text-lg font-bold mb-0'>Visibility</h3>

			<!-- If wrong, don't! -->
			{(data.execute.visibility ??= {}) && ''}
			<label class='grid grid-cols-3 items-center'>
				<span class='flex items-center' data-tooltip='TODO: Explain'>
					Opacity
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div class='flex align-middle items-center col-span-2 gap-2'>
					<input
						class='grow'
						bind:value={data.execute.visibility.opacity}
						type='range'
						placeholder='1'
						min='0.05' max='1' step='.05' disabled={readonly} {readonly}
					/>
					<input
						class='shrink w-min'
						bind:value={data.execute.visibility.opacity}
						on:change={() => {
							if (!data.execute?.visibility?.opacity) return;

							if (data.execute.visibility.opacity < 0) data.execute.visibility.opacity = 0.05;
							if (data.execute.visibility.opacity > 1) data.execute.visibility.opacity = 1;
						}}
						type='number'
						placeholder='1'
						min='0.05' max='1' step='.05' disabled={readonly} {readonly}
					/>
				</div>
			</label>
			<label class='grid grid-cols-3 items-center'>
				<span class='flex items-center' data-tooltip='TODO: Explain'>
					Mask To
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<datalist id='mask'>
						<option>SOURCES</option>
						<option>TARGETS</option>
						<option>TEMPLATES</option>
					</datalist>
					<input
						class='col-span-2'
						list='mask'
						type='text'
						bind:value={data.execute.visibility.mask}
						{readonly}
						disabled={readonly}
					/>
				</div>
			</label>
			<label class='grid grid-cols-3 items-center'>
				<span class='flex items-center' data-tooltip='TODO: Explain'>
					Ignore Token Vision
					<i class='fa fa-info-circle px-2 ml-auto'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<input disabled={readonly} {readonly} bind:checked={data.execute.visibility.ignoreTokenVision} type='checkbox' />
				</div>
			</label>
		</FadedWrapper>
		<!-- #endregion -->
		<!-- #region Unfinished -->
		<FadedWrapper>
			<p>Missing things in the UI, in no particular order:</p>
			<ul class='columns-2'>
				{#each ['rotation', 'elevation', 'varyProperties (😭)', 'drawings (😭)', 'filters (😭)'] as item}
					<li>{item}</li>
				{/each}
			</ul>
		</FadedWrapper>
		<!-- #endregion -->
	</div>
{/if}
