import { devMessage } from 'src/utils'

const createMeasuredTemplateHook = Hooks.on('createMeasuredTemplate', (template: MeasuredTemplateDocumentPF2e, _options, _id: ChatMessagePF2e['id']) => {
    const { actor: _actor, item, flags: { pf2e } } = template
    const { messageId = '', origin } = pf2e
    const { rollOptions = [] } = origin || {}
    const trigger = 'place-template' as const
    const source = game.messages.get(messageId)?.token
    const additionalOptions = {}

    const deliverable = {
        rollOptions,
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
