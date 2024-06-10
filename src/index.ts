import { MyHandlebarsApp } from "./app";

Hooks.on("ready", () => {
    ui.notifications.info("PF2e API is ready!");

    new MyHandlebarsApp().render(true)
})