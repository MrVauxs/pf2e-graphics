<script lang='ts'>
	import type { ValidationError } from 'svelte-jsoneditor';
	import { dev } from 'src/utils';
	import { Mode, ValidationSeverity } from 'svelte-jsoneditor';

	export let json: object;
	export let mode: Mode = Mode.text;

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
		{#if dev}
			{#await validatorFactory() then validator}
				<Module.JSONEditor
					content={{ json }}
					readOnly={true}
					{mode}
					{validator}
					navigationBar={false}
					statusBar={false}
					indentation='	'
					tabSize={2}
				/>
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
	{/await}
</section>
