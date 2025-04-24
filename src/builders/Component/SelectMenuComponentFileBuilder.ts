import {
    APIInteractionResponse,
    APIMessageComponentSelectMenuInteraction,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';

/**
 * Builder for select menu components.
 */
export class SelectMenuComponentFileBuilder {
    constructor(
        private file: {
            customId: string;
            execute: (
                interaction: APIMessageComponentSelectMenuInteraction
            ) => Awaitable<APIInteractionResponse>;
        }
    ) {}

    /**
     * Get the custom ID of the select menu component.
     */
    get customId() {
        return this.file.customId;
    }

    /**
     * Execute the select menu component's handler.
     * @param interaction - The select menu interaction object.
     */
    execute(interaction: APIMessageComponentSelectMenuInteraction) {
        return this.file.execute(interaction);
    }
}
