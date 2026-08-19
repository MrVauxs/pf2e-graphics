import type { ChatMessagePF2e } from 'foundry-pf2e';
import { mount, unmount } from 'svelte';
import { ErrorMsg, info } from '../../utils';
import CrosshairPicker from './CrosshairPicker.svelte';
import TourNag from './TourNag.svelte';

function assignSvelteComponent(element: HTMLElement, message: ChatMessagePF2e, component: string) {
	const moduleFlags = message.flags['pf2e-graphics'];
	if (!moduleFlags) return;
	if (moduleFlags._svelteComponent) return;

	if (component === 'CrosshairPicker') {
		moduleFlags._svelteComponent = mount(CrosshairPicker, {
			target: element,
			props: { message },
		});
	} else if (component === 'TourNag') {
		moduleFlags._svelteComponent = mount(TourNag, { target: element, props: { message } });
	} else {
		throw ErrorMsg.send('pf2e-graphics.load.error.badMessageFlags', {
			flags: Object.keys(moduleFlags).join(', '),
		});
	}
}

const ready = Hooks.once('ready', () => {
	for (const message of game.messages) {
		if (!message.flags['pf2e-graphics']) continue;

		const component = message.getFlag('pf2e-graphics', 'component') as string | undefined;
		if (!component) continue;

		const el: HTMLElement | null = document.querySelector(
			`.message[data-message-id="${message.id}"] .message-content`,
		);
		if (el) assignSvelteComponent(el, message, component);
	}

	ui.chat.scrollBottom();
});

/**
 * Used by chat message demo to manually attach a Svelte component, CrosshairPicker, to a chat message.
 *
 * Note: You must manually destroy this Svelte component in an associated `preDeleteChatMessage` like the one provided
 * below. The reason being is that you are manually / conditionally creating a Svelte component that is not monitored /
 * controlled by TRL itself, so you must also manually destroy this component when the chat message is deleted.
 */
const init = Hooks.once('init', () => {
	Hooks.on('renderChatMessageHTML', (message: ChatMessagePF2e, html: HTMLElement) => {
		const component = message.getFlag('pf2e-graphics', 'component') as string | undefined;
		if (!component) return;

		const el = html.querySelector<HTMLElement>(`.message-content`);
		if (el) assignSvelteComponent(el, message, component);
	});
});

/**
 * Clean up the mounted Svelte component when the chat message is deleted.
 */
const preDelete = Hooks.on('preDeleteChatMessage', (message) => {
	if (!message.flags['pf2e-graphics']) return;

	const svelteComponent = message.flags['pf2e-graphics']._svelteComponent;
	if (svelteComponent) {
		// Manually destroy Svelte component when the chat message document is being deleted.
		unmount(svelteComponent);
	}
});

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept((newModule) => {
		if (newModule) info('pf2e-graphics.load.notify.componentUpdated', { component: 'view/ChatMessage' });
	});
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('preDeleteChatMessage', preDelete);
		Hooks.off('init', init);
		Hooks.off('ready', ready);
	});
}
