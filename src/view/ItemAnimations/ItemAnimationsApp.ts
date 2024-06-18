import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import BasicAppShell from './ItemAnimationsShell.svelte';
import type { CombinedSvelteApplicationOptions, ConstructorApplicationOptions } from 'src/extensions';

type ItemAnimationsOptions = {
    data: {
        item: ItemPF2e | null;
    }
}

export default class ItemAnimationsApp extends SvelteApplication {
    constructor(options: ConstructorApplicationOptions & ItemAnimationsOptions) {
        super(options);

        if (options.data) {
            foundry.utils.mergeObject(this.options, { svelte: { props: options.data } })
        }
    }

    static override get defaultOptions(): CombinedSvelteApplicationOptions {
        return foundry.utils.mergeObject(super.defaultOptions, {
            ...super.defaultOptions,
            title: 'pf2e-graphics.modifyItem',  // Automatically localized from `lang/en.json`.
            width: 300,
            classes: ['pf2e-g'],

            svelte: {
                class: BasicAppShell,
                target: document.body,
                intro: true,
                props: {
                    item: null,
                }
            }
        });
    }
}