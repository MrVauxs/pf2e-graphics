import { devMessage } from 'src/utils'

const createMeasuredTemplateHook = Hooks.on('createMeasuredTemplate', (template: MeasuredTemplateDocumentPF2e, _options, _id: ChatMessagePF2e['id']) => {
	const { actor, item, message, flags: { pf2e: { origin } } } = template
	const trigger = 'place-template' as const
	const source = message?.token ?? canvas.tokens.getDocuments().find(x => x.actor?.id === actor?.id)
	const additionalOptions = {}

	const deliverable = {
		rollOptions: [...(origin?.rollOptions ?? []), ...(source?.actor?.getRollOptions() ?? [])],
		trigger,
		targets: [template],
		source,
		item,
		...additionalOptions,
	}

	devMessage('Template Hook Data', deliverable)
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
