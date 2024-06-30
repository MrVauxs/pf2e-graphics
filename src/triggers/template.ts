import { devMessage } from 'src/utils'

const createMeasuredTemplateHook = Hooks.on('createMeasuredTemplate', (template: MeasuredTemplateDocumentPF2e, _options, _id: ChatMessagePF2e['id']) => {
    const { actor: _actor, item, flags: { pf2e: { origin } } } = template
    const { rollOptions = [], messageId = '' } = origin || {}
    const type = 'place-template' as const
    const source = game.messages.get(messageId)?.token
    const additionalOptions = {}

    const deliverable = { rollOptions, type, item, template, source, additionalOptions }

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
