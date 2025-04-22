/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ContextMenuCommandBuilder as DiscordContextMenuCommandBuilder,
    SlashCommandBuilder,
} from '@discordjs/builders';
import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandAutocompleteResponse,
    APIChatInputApplicationCommandInteraction,
    APIContextMenuInteraction,
    APIInteractionResponse,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';
import { ChatInputFileBuilder } from './ChatInputFileBuilder';
import { ContextMenuFileBuilder } from './ContextMenuFileBuilder';

/**
 * Export ChatInputFileBuilder as ChatInputCommandBuilder
 */
export { ChatInputFileBuilder as ChatInputCommandBuilder } from './ChatInputFileBuilder';

/**
 * Export ContextMenuFileBuilder as ContextMenuCommandBuilder
 */
export { ContextMenuFileBuilder as ContextMenuCommandBuilder } from './ContextMenuFileBuilder';

/**
 * Type for command builders (slash or context menu).
 */
export type CommandBuilder = ChatInputFileBuilder | ContextMenuFileBuilder;

/**
 * Factory function for creating a ChatInputFileBuilder.
 * @param file - Chat input command definition.
 */
export function commandFileBuilder(file: {
    register:
        | RESTPostAPIChatInputApplicationCommandsJSONBody
        | SlashCommandBuilder;
    execute: (
        interaction: APIChatInputApplicationCommandInteraction
    ) => Awaitable<APIInteractionResponse>;
    autocomplete?: (
        interaction: APIApplicationCommandAutocompleteInteraction
    ) => Awaitable<APIApplicationCommandAutocompleteResponse>;
}): ChatInputFileBuilder;

/**
 * Factory function for creating a ContextMenuFileBuilder.
 * @param file - Context menu command definition.
 */
export function commandFileBuilder(file: {
    register:
        | RESTPostAPIContextMenuApplicationCommandsJSONBody
        | DiscordContextMenuCommandBuilder;
    execute: (
        interaction: APIContextMenuInteraction
    ) => Awaitable<APIInteractionResponse>;
}): ContextMenuFileBuilder;

/**
 * Implementation of commandFileBuilder factory function.
 * Returns a ChatInputFileBuilder or ContextMenuFileBuilder based on input.
 */
export function commandFileBuilder(
    file:
        | {
              register:
                  | RESTPostAPIChatInputApplicationCommandsJSONBody
                  | SlashCommandBuilder;
              execute: (
                  interaction: APIChatInputApplicationCommandInteraction
              ) => Awaitable<APIInteractionResponse>;
              autocomplete?: (
                  interaction: APIApplicationCommandAutocompleteInteraction
              ) => Awaitable<APIApplicationCommandAutocompleteResponse>;
          }
        | {
              register:
                  | RESTPostAPIContextMenuApplicationCommandsJSONBody
                  | DiscordContextMenuCommandBuilder;
              execute: (
                  interaction: APIContextMenuInteraction
              ) => Awaitable<APIInteractionResponse>;
          }
): ChatInputFileBuilder | ContextMenuFileBuilder {
    const isChatInput = (
        register: any
    ): register is
        | RESTPostAPIChatInputApplicationCommandsJSONBody
        | SlashCommandBuilder => {
        if (register instanceof SlashCommandBuilder) {
            return true;
        }
        if (typeof register === 'object' && 'type' in register) {
            return register.type === undefined || register.type === 1;
        }
        return false;
    };

    if (isChatInput(file.register)) {
        return new ChatInputFileBuilder(file as any);
    } else {
        return new ContextMenuFileBuilder(file as any);
    }
}

/**
 * Command class for wrapping command builders.
 * @deprecated Use createCommand function instead.
 */
export class Command<
    T extends 'chatInput' | 'contextMenu' = 'chatInput' | 'contextMenu',
> {
    private builder: CommandBuilder;

    constructor(
        file: T extends 'chatInput'
            ? {
                  register:
                      | RESTPostAPIChatInputApplicationCommandsJSONBody
                      | SlashCommandBuilder;
                  execute: (
                      interaction: APIChatInputApplicationCommandInteraction
                  ) => Awaitable<APIInteractionResponse>;
                  autocomplete?: (
                      interaction: APIApplicationCommandAutocompleteInteraction
                  ) => Awaitable<APIApplicationCommandAutocompleteResponse>;
              }
            : never
    );
    constructor(
        file: T extends 'contextMenu'
            ? {
                  register:
                      | RESTPostAPIContextMenuApplicationCommandsJSONBody
                      | DiscordContextMenuCommandBuilder;
                  execute: (
                      interaction: APIContextMenuInteraction
                  ) => Awaitable<APIInteractionResponse>;
              }
            : never
    );
    constructor(file: any) {
        this.builder = commandFileBuilder(file);
    }

    /**
     * Get command registration data.
     */
    get register() {
        return this.builder.register;
    }

    /**
     * Execute the command handler.
     */
    execute(interaction: Parameters<CommandBuilder['execute']>[0]) {
        return this.builder.execute(interaction as any);
    }

    /**
     * Execute autocomplete handler if available.
     */
    autocomplete(
        interaction: APIApplicationCommandAutocompleteInteraction
    ): Awaitable<APIApplicationCommandAutocompleteResponse> | undefined {
        if (
            'autocomplete' in this.builder &&
            typeof this.builder.autocomplete === 'function'
        ) {
            return this.builder.autocomplete(interaction);
        }
        return undefined;
    }

    /**
     * Check if this is a chat input command.
     */
    isChatInput(): this is Command<Extract<T, 'chatInput'>> {
        return this.builder instanceof ChatInputFileBuilder;
    }

    /**
     * Check if this is a context menu command.
     */
    isContextMenu(): this is Command<Extract<T, 'contextMenu'>> {
        return this.builder instanceof ContextMenuFileBuilder;
    }
}
