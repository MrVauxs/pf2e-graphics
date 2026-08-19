import type { Component } from 'svelte';
import { asClassComponent } from 'svelte/legacy';

/**
 * Adapts a Svelte 5 component so TRL will accept it.
 *
 * `@typhonjs-fvtt/runtime` 0.3.0-next.4 is still written against the Svelte 4 component API in two
 * places that both matter to us:
 *
 * 1. `TJSSvelte.util.isComponent()` duck-types a component by checking for `prototype.$destroy` and
 *    `prototype.$on`. Svelte 5 compiles components to plain functions, whose `prototype` is bare, so
 *    every component we hand to `SvelteApp`, `TJSDialog` or `FVTTSidebarControl` is otherwise rejected
 *    with "not a Svelte component constructor".
 * 2. `SvelteApp` locates the application root via an `elementRoot` get/set pair *on the instance*
 *    (`applicationShellContract`), which a plain function component never defines.
 *
 * `asClassComponent()` solves both: it returns a class extending Svelte's `Svelte4Component`, which
 * carries `$destroy`/`$on`/`$set` on its prototype and, in its constructor, defines instance accessors
 * for each of the mounted component's exports — exactly the shape TRL probes for.
 *
 * Note the compiler's `compatibility.componentApi: 4` option does *not* work here. It only adds a
 * `new.target` branch so `new Component()` returns an instance; the export stays a plain function, so
 * the prototype checks in (1) still fail.
 *
 * Remove this once TRL supports the Svelte 5 component API.
 *
 * @param component The Svelte 5 component to adapt.
 * @returns A Svelte 4 style component constructor. Typed loosely because TRL's own config types still
 * describe the pre-Svelte-5 constructor shape.
 */
/**
 * Adapting the same component twice would hand TRL two different constructors for one component, so
 * results are memoised — dialogs in particular re-adapt their content component on every open.
 */
const cache = new WeakMap<object, unknown>();

export function trlComponent(component: Component<any, any, any>): any {
	let wrapped = cache.get(component);
	if (!wrapped) {
		wrapped = asClassComponent(component as any);
		cache.set(component, wrapped);
	}
	return wrapped;
}

/**
 * Satisfies `TJSSvelte.util.isComponent()` *without* converting the component into a class.
 *
 * `FVTTSidebarControl` differs from `SvelteApp`: it never instantiates the component itself, it hands
 * it to `<svelte:component this={sidebarClass}>` inside TRL's own `FVTTSidebarWrapper.svelte`. That
 * call site uses the plain Svelte 5 signature, so an `asClassComponent()` class fails there with
 * "Class constructors cannot be invoked without 'new'" — but the raw component fails TRL's config
 * validation for the opposite reason.
 *
 * `isComponent()` only checks that the value is a function carrying `prototype.$destroy` and
 * `prototype.$on`, so stubbing those two methods clears validation while leaving the component a
 * plain callable. The stubs are inert: the sidebar is mounted and torn down by Svelte itself, and
 * `<svelte:component>` never constructs via the prototype, so neither is ever invoked.
 *
 * Remove this once TRL supports the Svelte 5 component API.
 *
 * @returns The same component, typed loosely because TRL's config types still describe the
 * pre-Svelte-5 constructor shape.
 */
export function trlDuckTypedComponent(component: Component<any, any, any>): any {
	const proto = (component as unknown as { prototype?: Record<string, unknown> }).prototype;
	if (proto && typeof proto.$destroy !== 'function') {
		proto.$destroy = () => {};
		proto.$on = () => () => {};
	}
	return component;
}
