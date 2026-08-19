<script lang='ts'>
	import type { Content, OnChange, OnChangeStatus, ValidationError } from 'svelte-jsoneditor';
	import { dev, devLog } from 'src/utils';
	import { Mode, ValidationSeverity } from 'svelte-jsoneditor';

	interface Props {
		json: object;
		mode?: Mode;
		onChange?: OnChange;
	}

	let { json, mode = Mode.text, onChange = (updatedContent: Content, previousContent: Content, status: OnChangeStatus) => devLog('onChange: ', { updatedContent, previousContent, status }) }: Props = $props();

	async function validatorFactory(): Promise<(json: unknown) => ValidationError[]> {
		const schema = (await import('schema')).animationSetDocument;
		const fromZodIssue = (await import('zod-validation-error')).fromZodIssue;
		return (json: unknown): ValidationError[] => {
			const result = schema.safeParse(json);
			if (result.success) return [];
			return result.error.issues.map((zodIssue) => {
				const issue = fromZodIssue(zodIssue, { prefix: null, includePath: false });

				console.error(issue.toString());
				return ({
					path: zodIssue.path.map(piece => piece.toString()),
					message: issue.toString(),
					severity: ValidationSeverity.error,
				});
			});
		};
	}
</script>

<section class='pf2e-g h-full'>
	{#await import('svelte-jsoneditor')}
		Waiting for extra JSONEditor code...
	{:then Module}
		{#if dev || window.pf2eGraphics.liveSettings.dev}
			{#await validatorFactory() then validator}
				<Module.JSONEditor
					content={{ json }}
					{mode}
					{validator}
					navigationBar={false}
					statusBar={false}
					indentation='	'
					tabSize={2}
					{onChange}
				/>
			{:catch}
				Errored trying to load Zod validator!
			{/await}
		{:else}
			<Module.JSONEditor
				content={{ json }}
				readOnly={true}
				{mode}
				navigationBar={false}
				statusBar={false}
				indentation='	'
				tabSize={2}
			/>
		{/if}
	{:catch}
		Errored trying to load JSONEditor!
	{/await}
</section>
