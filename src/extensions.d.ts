import type { SvelteApplicationOptions } from '@typhonjs-fvtt/runtime/svelte/application'
import type { TJSSessionStorage } from '@typhonjs-fvtt/runtime/svelte/store/web-storage'

declare module '@typhonjs-fvtt/runtime/svelte/application' {
	// @ts-expect-error https://github.com/microsoft/TypeScript/issues/20920
	// eslint-disable-next-line ts/no-unsafe-declaration-merging
	export interface SvelteApplication extends Application { }
	// eslint-disable-next-line ts/no-unsafe-declaration-merging
	export class SvelteApplication implements Application {
		options: CombinedSvelteApplicationOptions
		static defaultOptions: CombinedSvelteApplicationOptions
	}
}

export type CombinedSvelteApplicationOptions = ApplicationOptions & SvelteApplicationOptions

export type ConstructorApplicationOptions = Partial<CombinedSvelteApplicationOptions>

export interface ExternalTJSContext {
	application: Application
	elementRootUpdate: () => void
	sessionStorage: TJSSessionStorage
}

interface Context {
	'#external': ExternalTJSContext
}

declare module 'svelte' {
	export function getContext<T extends keyof Context, K extends Context[T]>(key: T): K
	export function setContext<T extends keyof Context, K extends Context[T]>(
		key: T,
		context: K
	): void
}

export type TokenOrDoc = TokenDocument | Token

type Entries<T, K extends keyof T = keyof T> = (K extends unknown ? [K, T[K]] : never)[]
