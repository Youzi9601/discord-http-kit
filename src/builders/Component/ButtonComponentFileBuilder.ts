import {
    APIInteractionResponse,
    APIMessageComponentButtonInteraction,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';

/**
 * Builder for button components.
 */
export class ButtonComponentFileBuilder {
    constructor(
        private file: {
            customId: string;
            execute: (
                interaction: APIMessageComponentButtonInteraction
            ) => Awaitable<APIInteractionResponse>;
        }
    ) {}

    /**
     * Get the custom ID of the button component.
     */
    get customId() {
        return this.file.customId;
    }

    /**
     * Execute the button component's handler.
     * @param interaction - The button interaction object.
     */
    execute(interaction: APIMessageComponentButtonInteraction) {
        return this.file.execute(interaction);
    }
}
