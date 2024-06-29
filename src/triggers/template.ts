import { devMessage } from 'src/utils'
import { findAndAnimate } from '.'

const createMeasuredTemplateHook = Hooks.on('createMeasuredTemplate', (template: MeasuredTemplateDocumentPF2e, _options, _id: ChatMessagePF2e['id']) => {
    const { actor: _actor, item, flags: { pf2e: { origin } } } = template
    const { rollOptions = [], messageId = '' } = origin || {}
    const type = 'template'
    const source = game.messages.get(messageId)?.token
    const additionalOptions = {}

    const deliverable = { rollOptions, type, item, targets: [template], source, additionalOptions }

    devMessage('Template Hook Data', deliverable)
    findAndAnimate<'template'>(deliverable)
})

if (import.meta.hot) {
    // Prevents reloads
    import.meta.hot.accept()
    // Disposes the previous hook
    import.meta.hot.dispose(() => {
        Hooks.off('createMeasuredTemplate', createMeasuredTemplateHook)
    })
}
