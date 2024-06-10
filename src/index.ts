Hooks.on("ready", () => {
    ui.notifications.info("PF2e API is ready!");

    setTimeout(() => {
        new Sequence()
            .effect()
                .file("jb2a.antilife_shell.blue_no_circle")
                .atLocation(game.scenes.active.tokens.placeables[0])
            .play()
    }, 5000)
})