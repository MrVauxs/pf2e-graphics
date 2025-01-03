<script lang='ts'>
	import type { AnimationSetItemPartial } from 'schema/payload';

	export let data: AnimationSetItemPartial<'graphic'>;
	export let readonly: boolean;

	// @ts-expect-error TODO: Sequencer Types
	const entries: string[] = window.Sequencer.Database.publicFlattenedSimpleEntries;

	let positionType: 'static' | 'dynamic' = 'static';
</script>
{#if !data.execute || data.execute?.type !== 'graphic'}
	<p>This isn't the right component! Something went extremely wrong if you are seeing this!</p>
{:else}
	<div class='space-y-2'>
		<!-- #region Graphic -->
		{#if !data.execute.graphic}
			<!-- If wrong, don't! -->
			{(data.execute.graphic = []) && ''}
		{:else}
			<label class='grid grid-cols-3 items-center'>
				<span data-tooltip='TODO: Explain'>
					Graphic
					<i class='fa fa-info-circle pl-px'></i>
				</span>
				<div class='flex align-middle items-center col-span-2'>
					<datalist id='graphic'>
						{#each entries as name}
							<option>{name}</option>
						{/each}
					</datalist>
					<input
						list='graphic'
						type='text'
						value={data.execute.graphic}
						on:change={(e) => {
							if (!data.execute) data.execute = {};
							data.execute.graphic = [e.currentTarget.value];
						}}
						{readonly}
						disabled={readonly}
					/>
				</div>
			</label>
		{/if}
		{#if !data.execute.position}
			<!-- If wrong, don't! -->
			{(data.execute.position = []) && ''}
		{:else}
			<div class='
				flex flex-col gap-2 p-1
				border border-solid rounded-sm bg-slate-600/15
			'>
				<label class='grid grid-cols-3 items-center'>
					<span data-tooltip='TODO: Explain'>
						Position
						<i class='fa fa-info-circle pl-px'></i>
					</span>
					<div class='flex align-middle items-center col-span-2'>
						<select bind:value={positionType} class='grow h-8 capitalize'>
							{#each ['static', 'dynamic'] as section}
								<option value={section}>{section}</option>
							{/each}
						</select>
						<button
							class='w-min text-nowrap h-8'
							on:click={() => {
								if (!data.execute || !data.execute.position) return;
								data.execute.position.push({
									type: positionType,
									location: 'SOURCES',
								});
								data = data;
							}}
						>
							<i class='fa fa-plus pr-1'></i>
							Add
						</button>
					</div>
				</label>
				{#each data.execute.position as position}
					<div class='
						flex flex-col gap-2 p-1
						border border-solid rounded-sm bg-slate-400/10
					'>
						<header class='flex items-center gap-2 border-0 border-b pb-1 border-solid'>
							<span class='text-lg'>
								Type: <i>{position.type}</i>
							</span>
							<button
								class='ml-auto size-min'
								on:click={() => {
									if (data.execute?.position)
										data.execute.position.splice(data.execute.position.indexOf(position), 1);
									data = data;
								}}
							>
								<i class='fa fa-trash fa-fw p-0 m-0'></i>
							</button>
						</header>
						<!-- #region Static -->
						{#if position.type === 'static'}
							<label class='grid grid-cols-3 items-center'>
								<span data-tooltip='TODO: Explain'>
									Location
									<i class='fa fa-info-circle pl-px'></i>
								</span>
								<select
									class='col-span-2'
									bind:value={position.location}
									disabled={readonly}
								>
									{#each ['SOURCES', 'TARGETS', 'TEMPLATES'] as section}
										<option value={section}>
											{section.toLowerCase().capitalize()}
										</option>
									{/each}
								</select>
							</label>
							<label class='grid grid-cols-3 items-center'>
								<span data-tooltip='TODO: Explain'>
									Move Towards
									<i class='fa fa-info-circle pl-px'></i>
								</span>
								<div class='flex items-center gap-2 h-7 col-span-2'>
									<input
										type='checkbox'
										checked={Boolean(position.moveTowards)}
										on:change={(e) => {
											// TODO: Remove unnecessary typecheck in Svelte 5
											if (position.type !== 'static') return;
											if (e.currentTarget.checked) {
												position.moveTowards = { target: 'SOURCES' };
											} else {
												delete position.moveTowards;
												position = position;
											}
										}}
									/>
									{#if position.moveTowards}
										<select
											class='grow'
											bind:value={position.moveTowards.target}
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
						{#if !position.offset}
							<!-- If wrong, don't! -->
							{(position.offset = { x: 0, y: 0 }) && ''}
						{:else}
							<label class='grid grid-cols-3 items-center'>
								<span data-tooltip='TODO: Explain'>
									Offset
									<i class='fa fa-info-circle pl-px'></i>
								</span>
								<div class='grid grid-cols-2 gap-4 items-stretch col-span-2'>
									<label class='flex items-center gap-2'>
										X
										<input
											type='text'
											bind:value={position.offset.x}
											{readonly}
											disabled={readonly}
										/>
									</label>
									<label class='flex items-center gap-2'>
										Y
										<input
											type='text'
											bind:value={position.offset.y}
											{readonly}
											disabled={readonly}
										/>
									</label>
								</div>
							</label>
						{/if}

						{#if position.type !== 'screenSpace'}
							<!-- Random Offset -->
							<label class='grid grid-cols-3 items-center'>
								<span data-tooltip='TODO: Explain'>
									Random Offset
									<i class='fa fa-info-circle pl-px'></i>
								</span>
								<div class='flex align-middle items-center col-span-2'>
									<input
										type='number'
										bind:value={position.randomOffset}
										{readonly}
										disabled={readonly}
									/>
								</div>
							</label>
							<!-- Grid Units -->
							<label class='grid grid-cols-3 items-center'>
								<span data-tooltip='TODO: Explain'>
									Grid Units
									<i class='fa fa-info-circle pl-px'></i>
								</span>
								<div class='flex align-middle items-center col-span-2'>
									<input
										type='checkbox'
										bind:checked={position.gridUnits}
										{readonly}
										disabled={readonly}
									/>
								</div>
							</label>
							<!-- Local -->
							<label class='grid grid-cols-3 items-center'>
								<span data-tooltip='TODO: Explain'>
									Local
									<i class='fa fa-info-circle pl-px'></i>
								</span>
								<div class='flex align-middle items-center col-span-2'>
									<input
										type='checkbox'
										bind:checked={position.local}
										{readonly}
										disabled={readonly}
									/>
								</div>
							</label>
							<!-- Missed -->
							<label class='grid grid-cols-3 items-center'>
								<span data-tooltip='TODO: Explain'>
									Missed
									<i class='fa fa-info-circle pl-px'></i>
								</span>
								<div class='flex align-middle items-center col-span-2'>
									<input
										type='number'
										bind:value={position.missed}
										{readonly}
										disabled={readonly}
									/>
								</div>
							</label>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
