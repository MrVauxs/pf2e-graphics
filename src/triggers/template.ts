import { devMessage } from 'src/utils'

const createMeasuredTemplateHook = Hooks.on('createMeasuredTemplate', (template: MeasuredTemplateDocumentPF2e, _options, _id: ChatMessagePF2e['id']) => {
	const { actor, item, message, flags: { pf2e: { origin } } } = template

	const deliverable = {
		rollOptions: [...(origin?.rollOptions ?? []), ...(message?.actor?.getRollOptions() ?? [])],
		trigger: 'place-template' as const,
		targets: [template],
		source: message?.token,
		actor,
		item,
	}

	devMessage('Template Hook Data', deliverable, _options)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
})

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('createMeasuredTemplate', createMeasuredTemplateHook)
	})
}
