import { ContextMenuCommandBuilder } from '@discordjs/builders';
import {
    APIContextMenuInteraction,
    APIInteractionResponse,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';
import { AbstractFileBuilder } from './AbstractFileBuilder';

export class ContextMenuFileBuilder extends AbstractFileBuilder<
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    APIContextMenuInteraction
> {
    constructor(file: {
        register:
            | RESTPostAPIContextMenuApplicationCommandsJSONBody
            | ContextMenuCommandBuilder;
        execute: (
            interaction: APIContextMenuInteraction
        ) => Awaitable<APIInteractionResponse>;
    }) {
        super({
            register:
                file.register instanceof ContextMenuCommandBuilder
                    ? file.register.toJSON()
                    : file.register,
            execute: file.execute,
        });
    }
}
