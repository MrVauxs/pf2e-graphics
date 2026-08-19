/**
 * Shim for the Svelte 4 private `svelte/internal` module, which Svelte 5 removed. Importing the real
 * thing under Svelte 5 throws immediately, which is fatal for us because
 * `@typhonjs-fvtt/runtime/svelte/util` does exactly that:
 *
 * ```js
 * import { group_outros, transition_out, check_outros } from 'svelte/internal';
 * ```
 *
 * and `#runtime/svelte/application` (SvelteApp / TJSDialog — core to this module) imports it in turn.
 * TRL 0.3.0-next.4 has not moved off Svelte 4 internals yet; see also the app-shell `accessors` note in
 * `view/AnimationDocument/AnimationDocument.svelte`.
 *
 * TRL only touches these three symbols inside `TJSSvelte.util.outroAndDestroy()`, and only on the
 * `instance.$$.fragment.o` branch — a Svelte 4 component shape that cannot occur under Svelte 5. So in
 * practice the import is the only thing that matters and these are never invoked. They are implemented
 * faithfully enough to stay correct if that branch is ever somehow reached: the only lost behaviour is
 * the outro animation, not the teardown itself.
 *
 * Wired up via `resolve.alias` in `vite.config.ts`. Remove both once TRL drops `svelte/internal`.
 */

/** Svelte 4 batched a group of outro transitions; with no transition to run there is nothing to group. */
export function group_outros(): void {}

/** Counterpart to {@link group_outros}. */
export function check_outros(): void {}

/**
 * Svelte 4 ran a fragment's outro transition and then invoked `callback`. Callers rely on that callback
 * firing to continue teardown — TRL resolves its `outroAndDestroy` promise from it — so invoke it
 * synchronously rather than no-opping, which would leave that promise pending forever.
 */
export function transition_out(
	_block: unknown,
	_local: unknown,
	_detach: unknown,
	callback?: () => void,
): void {
	callback?.();
}
