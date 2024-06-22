import type { AnimationDataObject } from "src/storage/AnimCore"
import { findAndAnimate } from ".";
import { devMessage } from "src/utils";

if (import.meta.hot) {
    // Prevents reloads
    import.meta.hot.accept()
    // Disposes the previous hook
    import.meta.hot.dispose(() => {
        Hooks.off("createChatMessage", chatMessageHook);
        Hooks.off("updateChatMessage", targetHelper);
    })
}

let chatMessageHook = Hooks.on("createChatMessage", (message: ChatMessagePF2e, _options, _id: ChatMessagePF2e["id"]) => {
    let rollOptions = message.flags.pf2e.context?.options ?? []
    let type = message.flags.pf2e.context?.type as AnimationDataObject["type"] | undefined
    if (!message.token) return;

    if (!type) {
        if ("appliedDamage" in message.flags.pf2e) { type = "damage-taken" }
        else { console.log("PF2e Animations | No message type found. Aborting."); return }
    }

    const missed = message.flags.pf2e.context?.outcome?.includes("ailure") ?? false
    const additionalOptions = { missed }
    // @ts-ignore - Too lazy to properly define custom modules flags
    const toolbelt = message.flags?.["pf2e-toolbelt"]?.targetHelper?.targets?.map((t) => fromUuidSync(t)) as (TokenDocumentPF2e | null)[] | undefined

    const targets = type === "saving-throw" ? [message.token] : (toolbelt ?? (message.target?.token ? [message.target?.token] : [...game.user.targets]))

    devMessage("Chat Message Hook", { rollOptions, type, message, targets, toolbelt });
    findAndAnimate({ rollOptions, type, additionalOptions, targets, source: message.token, item: message.item })
})

let targetHelper = Hooks.on("updateChatMessage", (message: ChatMessagePF2e, { flags }: { flags: ChatMessageFlagsPF2e }) => {
    if (!flags) return;
    if ("pf2e-toolbelt" in flags) {
        // @ts-ignore - Too lazy to properly define custom modules flags
        for (const targetId of Object.keys(flags["pf2e-toolbelt"]?.targetHelper?.saves || {})) {
            // @ts-ignore
            const roll = flags["pf2e-toolbelt"]?.targetHelper?.saves[targetId]
            const target = canvas.tokens.get(targetId)
            roll.roll = JSON.parse(roll.roll)

            devMessage("Target Helper saving throw update", { roll, target });

            if (!target) return;
            if (!message.token) return;

            let rollOptions = message.flags.pf2e.context?.options ?? []
            let type = roll.roll.options.type;
            const additionalOptions = { outcome: roll?.success }

            findAndAnimate({ rollOptions, type, additionalOptions, targets: [target], source: message.token, item: message.item })
        }
    }
})