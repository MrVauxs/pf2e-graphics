import "./presets.ts"
import { AnimCore, type AnimationDataObject, type ReferenceObject } from './AnimCore.ts';

declare global {
    interface Window {
        pf2eGraphics: pf2eGraphics
    }
    type pf2eGraphics = {
        modules: Record<string, Record<string, string | ReferenceObject | AnimationDataObject[]>>
        AnimCore: typeof AnimCore
    }
}

Hooks.on("ready", async () => {
    for (const mod of game.modules) {
        if (!mod.active) continue;
        const animations: string | undefined = mod.flags?.["pf2e-graphics"] as unknown as string
        if (!animations) continue;
        window.pf2eGraphics.modules[mod.id] = await (await fetch(animations)).json()
    }
});

window.pf2eGraphics ??= {
    modules: {},
    AnimCore,
}

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
