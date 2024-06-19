import { AnimationsStorage } from "src/storage"

Hooks.on("createChatMessage", (message: ChatMessagePF2e, _options, _id: ChatMessagePF2e["id"]) => {
    const { type, options } = message.flags.pf2e.context || {}

    if (!message.token) return;

    const animations = AnimationsStorage.getMatchingAnimations(options)
    const sequence = new Sequence({ inModuleName: "pf2e-graphics" })

    for (const animation of animations) {
        if (animation.type !== type) return;

        const test = game.pf2e.Predicate.test(animation.predicate, options)
        const missed = message.flags.pf2e.context?.outcome?.includes("ailure")

        if (test) AnimationsStorage.animate(animation.preset, {
            sequence,
            file: animation.file,
            target: message.target?.token,
            source: message.token,
            options: { ...animation.options, missed }
        })
    }

    sequence.play()
})
