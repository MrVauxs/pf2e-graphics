import "./presets.ts"
import { AnimCore } from './AnimCore.ts';

window.pf2eGraphics ??= {
    modules: {},
    AnimCore,
}

Hooks.on("ready", async () => {
    for (const mod of game.modules) {
        if (!mod.active) continue;
        const animations: string | undefined = mod.flags?.["pf2e-graphics"] as unknown as string
        if (!animations) continue;
        window.pf2eGraphics.modules[mod.id] = await (await fetch(animations)).json()
    }
});

if (import.meta.hot) {
    import.meta.hot.on('updateAnims', (data) => {
        window.pf2eGraphics.modules["pf2e-graphics"] = JSON.parse(data)
        ui.notifications.info("Animations updated!");
    })

    import.meta.hot.accept('./AnimationStorage.ts', (newModule) => {
        if (newModule) {
            window.pf2eGraphics.AnimCore = newModule?.AnimCore;
            ui.notifications.info("AnimCore updated!");
        }
    })
}
