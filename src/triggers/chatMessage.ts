if (import.meta.hot) {
    // Prevents reloads
    import.meta.hot.accept()
    // Disposes the previous hook
    import.meta.hot.dispose(() => {
        Hooks.off("createChatMessage", chatMessageHook)
    })
}

let chatMessageHook = Hooks.on("createChatMessage", (message: ChatMessagePF2e, _options, _id: ChatMessagePF2e["id"]) => {
    const { type, options } = message.flags.pf2e.context || {}
    if (!message.token) return;

    const animationTree = window.pf2eGraphics.AnimCore.getMatchingAnimationTrees(options)
    const sequence = new Sequence({ inModuleName: "pf2e-graphics" })
    const missed = message.flags.pf2e.context?.outcome?.includes("ailure")

    for (const branch of Object.keys(animationTree)) {
        const matchingAnimations = animationTree[branch];
        let validAnimations = matchingAnimations.filter((a) => a.type === type).filter((animation) => game.pf2e.Predicate.test(animation.predicate, options))

        if (validAnimations.filter((a) => !a.default).length > 0) validAnimations = validAnimations.filter((a) => !a.default)

        validAnimations.forEach((animation) => {
            if (!message.token) return; // Typescript is dumb.
            window.pf2eGraphics.AnimCore.animate(animation.preset, {
                sequence,
                file: animation.file,
                target: message.target?.token,
                source: message.token,
                options: { ...animation.options, missed }
            })
        })
    }


    sequence.play()
})