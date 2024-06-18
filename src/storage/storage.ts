import animations from "../animations.json"

export class AnimationsStorage {
    static get(key: string | undefined) {
        if (!key) {
            console.warn("Item has no sourceId!")
            return undefined
        }
        return foundry.utils.getProperty(animations, key)
    }
}
