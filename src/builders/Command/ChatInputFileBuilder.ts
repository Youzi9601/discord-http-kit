import { SlashCommandBuilder } from '@discordjs/builders';
import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandAutocompleteResponse,
    APIChatInputApplicationCommandInteraction,
    APIInteractionResponse,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';
import { AbstractFileBuilder } from './AbstractFileBuilder';

export class ChatInputFileBuilder extends AbstractFileBuilder<
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    APIChatInputApplicationCommandInteraction
> {
    autocomplete?: (
        interaction: APIApplicationCommandAutocompleteInteraction
    ) => Awaitable<APIApplicationCommandAutocompleteResponse>;

    constructor(file: {
        register:
            | RESTPostAPIChatInputApplicationCommandsJSONBody
            | SlashCommandBuilder;
        execute: (
            interaction: APIChatInputApplicationCommandInteraction
        ) => Awaitable<APIInteractionResponse>;
        autocomplete?: (
            interaction: APIApplicationCommandAutocompleteInteraction
        ) => Awaitable<APIApplicationCommandAutocompleteResponse>;
    }) {
        super({
            register:
                file.register instanceof SlashCommandBuilder
                    ? file.register.toJSON()
                    : file.register,
            execute: file.execute,
        });

        if (file.autocomplete) {
            this.autocomplete = file.autocomplete;
        }
    }

    // /**
    //  * 處理自動完成請求
    //  * @param interaction 自動完成互動
    //  * @returns 自動完成回應或 undefined (如果沒有設置自動完成處理函數)
    //  */
    // private handleAutocomplete(
    //     interaction: APIApplicationCommandAutocompleteInteraction
    // ): Awaitable<APIApplicationCommandAutocompleteResponse> | undefined {
    //     if (this.autocomplete) {
    //         return this.autocomplete(interaction);
    //     }
    //     return undefined;
    // }
}
