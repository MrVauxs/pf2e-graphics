import type { Writable } from 'svelte/store';
import { Timing } from '@typhonjs-fvtt/runtime/util';
import type { TJSDocument } from '#runtime/svelte/store/fvtt/document';
import { writableDerived } from '#runtime/svelte/store/writable-derived';
import { isObject } from '#runtime/util/object';

function changeValue(data: unknown) {
	if (isObject(data)) {
		// iterating over the object using for..in
		for (const key in data) {
			if (data[key] === null) {
				if (key.startsWith('-=')) {
					delete data[key];
					continue;
				}
				data[`-=${key}`] = null;
				delete data[key];
			} else if (isObject(data[key])) {
				changeValue(data[key]);
			}
		}
	}
	return data;
}

/**
 * Currently supports object data as the flag value.
 *
 * @param doc     TJSDocument instance.
 *
 * @param scope   The flag scope which namespaces the key.
 *
 * @param key     The flag key.
 *
 * @param defaultValue Optional default flag value.
 *
 * @param debounce Optional debounce timing.
 */
export default function docFlagDerived<T>(
	doc: TJSDocument,
	scope: string,
	key: string,
	defaultValue: T,
	debounce?: null | number,
): Writable<T> {
	return writableDerived(
		doc,
		$doc => $doc.getFlag(scope, key) ?? defaultValue,
		(data, doc) => {
			const save = () => doc.setFlag(scope, key, changeValue(data));
			if (debounce) {
				Timing.debounce(save, debounce)();
			} else {
				save();
			}
			return doc;
		},
	);
}
