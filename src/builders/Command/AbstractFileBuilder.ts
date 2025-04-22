import { FileBuilder } from '..';
import {
    APIInteractionResponse,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';

export abstract class AbstractFileBuilder<
    RegisterType,
    InteractionType,
    ResponseType = APIInteractionResponse
> extends FileBuilder<RegisterType, InteractionType, ResponseType> {
    override register: RegisterType;
    override execute: (interaction: InteractionType) => Awaitable<ResponseType>;

    constructor(file: {
        register: RegisterType;
        execute: (interaction: InteractionType) => Awaitable<ResponseType>;
    }) {
        super(file);
        this.register = file.register;
        this.execute = file.execute;
    }
}
