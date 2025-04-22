import { Awaitable } from '@discordjs/util';
export * from './Command/index';
export * from './Component/index';

export class FileBuilder<
    RegisterType = unknown,
    InteractionType = unknown,
    ResponseType = unknown,
> {
    constructor(file: {
        register: RegisterType;
        execute: (interaction: InteractionType) => Awaitable<ResponseType>;
    }) {
        this.register = file.register;
        this.execute = file.execute;
    }
    register: RegisterType;
    execute: (interaction: InteractionType) => Awaitable<ResponseType>;
}
