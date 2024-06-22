export class ErrorMsg extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PF2e Graphics Error";

        ui.notifications.error(`PF2e Graphics | ${message}`);
    }
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export const dev = import.meta.env.DEV;

export function devMessage(...args: any) {
    if (dev) console.log(`[%cPF2e Graphics Dev%c]`, "color: yellow", "", ...args);
}