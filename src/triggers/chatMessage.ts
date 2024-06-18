import { AnimationsStorage } from "src/storage"

Hooks.on("createChatMessage", (message: ChatMessagePF2e, _options, _id: ChatMessagePF2e["id"]) => {
    // if (import.meta.env.DEV) console.log(message, _options)
    const { type, options } = message.flags.pf2e.context || {}

    if (!message.token) return;

    const animations = AnimationsStorage.getMatchingAnimations(options)

    for (const animation of animations) {
        if (animation.type !== type) return;

        const test = game.pf2e.Predicate.test(animation.predicate, options)

        if (test) AnimationsStorage.animate(animation.preset, {
            file: animation.file,
            target: message.target?.token,
            token: message.token,
            options: animation.options
        })
    }
})
