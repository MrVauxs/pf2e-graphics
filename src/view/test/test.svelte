<svelte:options accessors={true} />

<script lang='ts'>
	// @ts-ignore - TJS-2-TS
	import type { Writable } from 'svelte/store'
	import { writableDerived } from '@typhonjs-fvtt/runtime/svelte/store/writable-derived'
	import { ApplicationShell } from '#runtime/svelte/component/core'
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document'

	export let elementRoot: HTMLElement | undefined
	export let document: ItemPF2e | null = null

	// import { getContext } from "svelte";
	// const application = getContext("#external").application;

	const doc = new TJSDocument(document)

	const itemFlag = writableDerived(
		doc,
		$doc => $doc.getFlag('pf2e-graphics', 'test') || {},
		(data, doc) => {
			function changeValue(obj: Record<string, any>) {
				if (typeof obj === 'object') {
					// iterating over the object using for..in
					for (const key in obj) {
						if (obj[key] === null) {
							if (key.startsWith('-=')) {
								delete obj[key]
								continue
							}
							obj[`-=${key}`] = null
							delete obj[key]
						} else if (typeof obj[key] === 'object') {
							changeValue(obj[key])
						}
					}
				}
				return obj
			}

			doc.setFlag('pf2e-graphics', 'test', changeValue(data))
			return doc
		},
	) as Writable<any>
</script>

<ApplicationShell bind:elementRoot>
	<main class='overflow-hidden flex flex-col h-full'>
		<div>{$doc.name} {JSON.stringify($doc?.flags['pf2e-graphics'])}</div>
		<input bind:value={$itemFlag} />
	</main>
</ApplicationShell>
