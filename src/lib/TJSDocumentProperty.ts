import type { Subscriber, Unsubscriber } from 'svelte/store';
import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document';

import { safeAccess } from '#runtime/util/object';

import { Timing } from '#runtime/util';

/**
 * Provides a custom store for accessing a property of a `TJSDocument` instance.
 *
 * @template T
 */
export default class TJSDocumentProperty<T> {
	/**
	 * When a positive integer debounce input in milliseconds.
	 *
	 * @type {number}
	 */
	#debounce: number = 0;

	/**
	 * Stores any active debounce function for set operation.
	 *
	 * @type {Function | undefined}
	 */
	// eslint-disable-next-line ts/no-unsafe-function-type
	#debounceSetFn: Function | undefined = void 0;

	/**
	 * When true enables debug logging.
	 *
	 * @type {boolean}
	 */
	#debug: boolean = false;

	/**
	 * The backing TJSDocument instance.
	 *
	 * @type {TJSDocument}
	 */
	#doc: TJSDocument;

	/**
	 * The property accessor for document lookups.
	 *
	 * @type {string}
	 */
	#accessor: string;

	#subscribers: Subscriber<T>[] = [];

	/**
	 * A Symbol used with `safeAccess` to determine if a value is present in update data.
	 *
	 * @type {symbol}
	 */
	#symbolNoop: symbol = Symbol('noop');

	// @ts-expect-error It is set
	#value: T;

	#unsubscribeDoc: Unsubscriber | undefined;

	constructor({ doc, accessor, debounce, debug = false }: { doc: any; accessor: string; debounce?: number; debug?: boolean }) {
		if (!(doc instanceof TJSDocument)) {
			throw new TypeError(`'doc' is not an instance of TJSDocument.`);
		}

		if (accessor !== void 0 && typeof accessor !== 'string') {
			throw new TypeError(`'accessor' is not a string or undefined.`);
		}

		if (typeof debug !== 'boolean') {
			throw new TypeError(`'debug' is not a boolean.`);
		}

		this.#doc = doc;
		this.#accessor = accessor;
		this.#debug = debug;

		if (debounce !== void 0) {
			this.debounce = debounce;
		}
	}

	/**
	 * @returns {string} The current property accessor.
	 */
	get accessor(): string {
		return this.#accessor;
	}

	/**
	 * @returns {number} The debounce time in milliseconds.
	 */
	get debounce(): number {
		return this.#debounce;
	}

	/**
	 * Sets the property accessor.
	 *
	 * @param {string} accessor - New property accessor.
	 */
	set accessor(accessor: string) {
		if (accessor !== void 0 && typeof accessor !== 'string') {
			throw new TypeError(`'accessor' is not a string or undefined.`);
		}

		this.#accessor = accessor;

		this.#value = safeAccess(this.#doc?.get(), this.#accessor);
		this.#updateSubscribers();

		this.#log(`[TJSDocumentProperty] set accessor (${this.#accessor}) - value:\n`, this.#value);
	}

	/**
	 * @param {number}   debounce - A positive integer including zero for no debounce.
	 */
	set debounce(debounce: number) {
		if (!Number.isInteger(debounce)) {
			throw new TypeError(`'debounce' must be an integer`);
		}

		this.#log(`[TJSDocumentProperty] set debounce: `, debounce);

		this.#debounce = debounce;

		this.#debounceSetFn = debounce > 0 ? Timing.debounce(this.#setImpl, debounce) : void 0;
	}

	/**
	 * @returns {T} Current document accessor value.
	 */
	get(): T {
		return this.#value;
	}

	/**
	 * @param {T}  value - New value to post as DB update.
	 */
	set(value: T) {
		if (this.#debounceSetFn) {
			this.#debounceSetFn(value);
		} else {
			this.#setImpl(value);
		}
	}

	subscribe(handler: Subscriber<T>): Unsubscriber {
		this.#log(`[TJSDocumentProperty] subscribe - 0`);
		if (this.#subscribers.length === 0) {
			this.#log(`[TJSDocumentProperty] subscribe - A - no current subscribers`);

			this.#unsubscribeDoc = this.#doc?.subscribe(this.#handleDocUpdate.bind(this));

			this.#value = safeAccess(this.#doc?.get(), this.#accessor);
		}

		this.#subscribers.push(handler);

		handler(this.#value);

		// Return unsubscribe function.
		return () => {
			const index = this.#subscribers.findIndex(sub => sub === handler);
			if (index >= 0) {
				this.#subscribers.splice(index, 1);
			}

			// Unsubscribe from document callback if there are no subscribers.
			if (this.#subscribers.length === 0 && typeof this.#unsubscribeDoc === 'function') {
				this.#log(`[TJSDocumentProperty] subscribe - B - unsubscribing`);

				this.#unsubscribeDoc();
				this.#unsubscribeDoc = void 0;

				// @ts-expect-error Explicit removal
				this.#value = void 0;
			}
		};
	}

	/**
	 * Provides the {@link Writable} store `update` method. Receive and return a {@link TJSPositionData} instance to
	 * update the position state. You may manipulate numeric properties by providing relative adjustments described in
	 * {@link TJSPositionDataRelative}.
	 *
	 * @param {import('svelte/store').Updater<any>} updater -
	 */
	update(updater: import('svelte/store').Updater<any>) {
		const result = updater(this.get());

		this.set(result);
	}

	// Internal Implementation ----------------------------------------------------------------------------------------

	/**
	 *
	 * @param {any} message
	 * @param  {...any} extra
	 */
	#log(message: any, ...extra: any[]) {
		if (this.#debug) {
		// eslint-disable-next-line no-console
			console.log(message, ...extra);
		}
	}

	#handleDocUpdate(_doc: object, context?: { renderData?: object; renderContext?: string; action?: string }) {
		this.#log(`[TJSDocumentProperty] #handleDocUpdate - 0 - context:\n`, context);

		// TODO: Note that this is based on the current `0.2.0` internal release and may need to be changed based on TRL
		//  `0.1.3`.

		switch (context?.action) {
			case 'delete':
				// @ts-expect-error Explicit removal
				this.#value = void 0;
				this.#updateSubscribers();
				this.#log(`[TJSDocumentProperty] #handleDocUpdate - A - delete; value:\n`, this.#value);
				break;

			case 'subscribe':
				this.#value = safeAccess(this.#doc?.get(), this.#accessor);
				this.#updateSubscribers();
				this.#log(`[TJSDocumentProperty] #handleDocUpdate - B - subscribe; value:\n`, this.#value);
				break;

			case 'tjs-set-new':
				this.#value = safeAccess(this.#doc?.get(), this.#accessor);
				this.#updateSubscribers();
				this.#log(`[TJSDocumentProperty] #handleDocUpdate - C - tjs-set-new; value:\n`, this.#value);
				break;
		}

		// TODO: Note that this specifically handles Foundry v12. In TRL `0.2.0` `renderContext` will be normalized to
		// `action`.

		if (context?.renderData && typeof context.renderContext === 'string' && context.renderContext.startsWith('update')) {
			const newValue = safeAccess(this.#doc?.get(), this.#accessor, this.#symbolNoop);

			if (newValue !== this.#symbolNoop) {
				this.#value = newValue;
				this.#updateSubscribers();

				this.#log(`[TJSDocumentProperty] #handleDocUpdate - D - updateItem; value:\n`, this.#value);
			}
		}
	}

	/**
	 * Provides the set implementation
	 *
	 * @param {T}  value - New value to set to document property accessor.
	 */
	#setImpl(value: T) {
		const doc = this.#doc?.get();
		if (doc) {
			doc?.update?.({ [this.#accessor]: value });

			this.#log(`[TJSDocumentProperty] #setImpl - value: `, value);
		}
	}

	/**
	 * Updates all subscribers.
	 */
	#updateSubscribers() {
		for (let cntr = 0; cntr < this.#subscribers.length; cntr++) {
			this.#subscribers[cntr](this.#value);
		}
	}
}
