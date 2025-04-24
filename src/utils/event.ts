import { EventEmitter } from 'events';
import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandInteraction,
    APIMessageComponentInteraction,
    APIModalSubmitInteraction,
} from 'discord-api-types/v10';

/**
 * Event mapping for the Client class
 * Define the events and their corresponding argument types
 */
export interface CoreEvents {
    requestIsNotValid: [request: Request];
    endPointPing: [request: Request];
    ApplicationCommand: [interaction: APIApplicationCommandInteraction];
    MessageComponent: [interaction: APIMessageComponentInteraction];
    ApplicationCommandAutocomplete: [
        interaction: APIApplicationCommandAutocompleteInteraction,
    ];
    ModalSubmit: [interaction: APIModalSubmitInteraction];
}

/**
 * Event keys for the Client class
 */
export enum CoreEventKeys {
    requestIsNotValid = 'requestIsNotValid',
    endPointPing = 'endPointPing',
    ApplicationCommand = 'ApplicationCommand',
    MessageComponent = 'MessageComponent',
    ApplicationCommandAutocomplete = 'ApplicationCommandAutocomplete',
    ModalSubmit = 'ModalSubmit',
}

export class TypedEventEmitter extends EventEmitter {
    public override on<K extends keyof CoreEvents>(
        event: K,
        listener: (...args: CoreEvents[K]) => void
    ): this {
        return super.on(event, listener);
    }

    public override once<K extends keyof CoreEvents>(
        event: K,
        listener: (...args: CoreEvents[K]) => void
    ): this {
        return super.once(event, listener);
    }

    public override emit<K extends keyof CoreEvents>(
        event: K,
        ...args: CoreEvents[K]
    ): boolean {
        return super.emit(event, ...args);
    }

    public override off<K extends keyof CoreEvents>(
        event: K,
        listener: (...args: CoreEvents[K]) => void
    ): this {
        return super.off(event, listener);
    }

    public override removeAllListeners<K extends keyof CoreEvents>(
        event?: K
    ): this {
        return super.removeAllListeners(event);
    }
}
