export class ErrorMsg extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PF2e Graphics Error";

        ui.notifications.error(`PF2e Graphics | ${message}`);
    }
}