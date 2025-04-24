/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events';
import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandInteraction,
    APIMessageComponentInteraction,
    APIModalSubmitInteraction,
} from 'discord-api-types/v10';

export class TypedEventEmitter<
    Events extends keyof CoreEvents,
> extends EventEmitter {
    // on 方法多載
    override on<K extends keyof Events>(
        event: K extends string ? K : never,
        listener: (...args: Events[K]) => void
    ): this;
    override on(
        event: string | symbol,
        listener: (...args: any[]) => void
    ): this {
        return super.on(event, listener);
    }

    // once 方法多載
    override once<K extends keyof Events>(
        event: K extends string ? K : never,
        listener: (...args: Events[K]) => void
    ): this;
    override once(
        event: string | symbol,
        listener: (...args: any[]) => void
    ): this {
        return super.once(event, listener);
    }

    // emit 方法多載
    override emit<K extends keyof Events>(
        event: K extends string ? K : never,
        ...args: Events[K]
    ): boolean;
    override emit(event: string | symbol, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    // off 方法多載 (新增)
    override off<K extends keyof Events>(
        event: K extends string ? K : never,
        listener: (...args: Events[K]) => void
    ): this;
    override off(
        event: string | symbol,
        listener: (...args: any[]) => void
    ): this {
        return super.off(event, listener);
    }

    // removeAllListeners 方法多載 (新增)
    override removeAllListeners<K extends keyof Events>(
        event?: K extends string ? K : never
    ): this;
    override removeAllListeners(event?: string | symbol): this {
        return super.removeAllListeners(event);
    }
}

/**
 * Event mapping for the Client class
 * Define the events and their corresponding argument types
 */
export interface CoreEvents {
    ping: [isVaild: boolean, response: Response];
    ApplicationCommand: [interaction: APIApplicationCommandInteraction];
    MessageComponent: [interaction: APIMessageComponentInteraction];
    ApplicationCommandAutocomplete: [
        interaction: APIApplicationCommandAutocompleteInteraction,
    ];
    ModalSubmit: [interaction: APIModalSubmitInteraction];
}
