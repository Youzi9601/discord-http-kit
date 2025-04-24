import {
    APIInteractionResponse,
    APIModalSubmitInteraction,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';

/**
 * Builder for modal submit components.
 */
export class ModalSubmitComponentFileBuilder {
    constructor(
        private file: {
            customId: string;
            execute: (
                interaction: APIModalSubmitInteraction
            ) => Awaitable<APIInteractionResponse>;
        }
    ) {}

    /**
     * Get the custom ID of the modal submit component.
     */
    get customId() {
        return this.file.customId;
    }

    /**
     * Execute the modal submit component's handler.
     * @param interaction - The modal submit interaction object.
     */
    execute(interaction: APIModalSubmitInteraction) {
        return this.file.execute(interaction);
    }
}
