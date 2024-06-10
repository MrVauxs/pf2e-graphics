const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class MyHandlebarsApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        tag: "form",
        position: {
            width: 560,
            height: 560,
        },
        actions: {
            myAction: MyHandlebarsApp.myAction
        },
        window: {
            title: "My Application",
            controls: [{
                icon: 'fa-solid fa-triangle-exclamation',
                label: "Log",
                action: "myAction",
                visible: true
            }]
        },
        form: {
            submitOnChange: false,
            closeOnSubmit: false,
            handler: async (event: SubmitEvent | Event, html: HTMLFormElement, form: FormDataExtended) => {
                console.log(event, html, form)
            }
        }
    }

    constructor(options = {}) {
        super(options)
    }

    static PARTS = {
        form: { template: "modules/pf2e-graphics/templates/menu.hbs" },
        footer: {
            template: "templates/generic/form-footer.hbs",
        }
    }

    async _prepareContext(options = {}) {
        return {
            ...super._prepareContext(options),
            buttons: [
                { type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
            ]
        }
    }

    static async myAction() {
        console.log(this)
    }
}
