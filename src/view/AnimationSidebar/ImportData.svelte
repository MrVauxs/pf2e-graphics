<script lang='ts'>
	import type { AnimationSetDocument } from 'schema';
	import { devLog, error, safeJSONParse, warn } from 'src/utils';
	import AnimationDocumentApp from '../AnimationDocument/AnimationDocumentApp';

	export let animation: AnimationSetDocument;
	export let close: (force: boolean) => void;

	let json = '';
	let data: undefined | AnimationSetDocument;

	$: if (json) {
		const safeJSON = safeJSONParse(json);
		if (safeJSON.success) {
			data = safeJSON.data as AnimationSetDocument;
			devLog('Import JSON Data', data);
		} else {
			warn(`Invalid JSON data!`);
		}
	}

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			try {
				if (e.target?.result) {
					json = e.target.result as string;
				}
			} catch (err) {
				console.error('Error parsing JSON:', err);
				error('Failed to read the file.', undefined, { console: false });
				json = '';
			}
		};

		reader.onerror = () => {
			console.error('Error reading file.');
			json = '';
		};

		reader.readAsText(file);
	};

	async function importAnimationData() {
		if (!data) return;
		const doc = new AnimationDocumentApp({ animation });

		// Alternatively we could do Spappz suggestion of just the name and animationSets but that's more of a types issue than a coding problem.
		const cleanedData = data;
		cleanedData.source = animation.source;
		// @ts-expect-error TODO: Can't be bothered to fix whatever wrong schema we have going on here
		cleanedData.user = animation.user;
		// @ts-expect-error TODO: Can't be bothered to fix whatever wrong schema we have going on here
		cleanedData.id = animation.id;

		await doc.save(cleanedData);
		close(true);
	}
</script>

<div class='space-y-2'>
	<div class='flex flex-nowrap items-center gap-2'>
		Select a File:
		<input class='grow' type='file' accept='application/JSON' on:change={handleFileChange} />
	</div>
	<div class='transition duration-300 ease-out {data ? 'opacity-100' : 'opacity-0'}'>
		<p><b>Name:</b> {data ? data.name : ''}</p>
		<p><b>Roll Option:</b> <code>{data ? data.rollOption : ''}</code></p>
		<p><b>Animation Sets:</b> {data ? data.animationSets.length : ''}</p>
	</div>
	<button
		disabled={!(data && data?.animationSets)}
		class:disabled={!(data && data?.animationSets)}
		on:click={importAnimationData}
	>
		Import
	</button>
</div>
