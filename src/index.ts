import {
    APIPingInteraction,
    APIApplicationCommandInteraction,
    APIMessageComponentInteraction,
    APIApplicationCommandAutocompleteInteraction,
    APIModalSubmitInteraction,
    RESTPutAPIApplicationCommandsJSONBody,
    RESTPutAPIApplicationGuildCommandsJSONBody,
    RESTPutAPIApplicationGuildCommandsResult,
    RESTPutAPIApplicationCommandsResult,
} from 'discord-api-types/v10';
import { REST, RESTOptions } from '@discordjs/rest';
import { InvalidKeyError } from './utils/errors';
import { interactionEndpoint } from './endpoint';
import { API } from '@discordjs/core/http-only';
import { TypedEventEmitter } from './utils/event';
export * from './builders/index';

/**
 * Type representing the library version string
 */
type version = `v${string}`;

/**
 * Current version of the library
 */
export const version: version = 'v0.0.1';

/**
 * Union type representing all supported Discord interaction types
 */
export type Interaction =
    | APIPingInteraction
    | APIApplicationCommandInteraction
    | APIMessageComponentInteraction
    | APIApplicationCommandAutocompleteInteraction
    | APIModalSubmitInteraction;

/**
 * Configuration options for the Client class
 * @property appPublicKey - Discord application's public key for interaction verification
 * @property clientId - Discord application client ID
 * @property clientSecret - Discord application client secret
 * @property clientToken - Discord bot token for authentication
 * @property rest - Optional REST configuration options
 */
interface CoreOptions {
    appPublicKey: string;
    clientId: string;
    clientSecret: string;
    clientToken: string;
    rest?: Partial<Omit<RESTOptions, 'version'>>;
}

/**
 * Client class for Discord HTTP interactions
 *
 * Provides functionality for handling Discord interactions and accessing Discord's REST API
 */
export class Client extends TypedEventEmitter implements AsyncDisposable {
    private appPublicKey: string;
    private clientId: string;
    private clientToken: string;
    public readonly version: version = version;
    public REST: REST;
    public API: API;

    /**
     * Creates a new instance of the Core class
     *
     * @param options - Configuration options for Discord integration
     * @throws {InvalidKeyError} If any required keys are missing
     */
    public constructor(options: CoreOptions) {
        super({ captureRejections: true });

        if (typeof options !== 'object') {
            throw new InvalidKeyError('options must be an object');
        }
        if (!options.appPublicKey) {
            throw new InvalidKeyError('appPublicKey is required');
        }
        if (!options.clientId) {
            throw new InvalidKeyError('clientId is required');
        }
        if (!options.clientSecret) {
            throw new InvalidKeyError('clientSecret is required');
        }
        if (!options.clientToken) {
            throw new InvalidKeyError('clientToken is required');
        }
        this.appPublicKey = options.appPublicKey;
        this.clientId = options.clientId;
        this.clientToken = options.clientToken;
        this.REST = new REST(options.rest || {}).setToken(this.clientToken);
        this.API = new API(this.REST);
    }

    /**
     * Processes incoming Discord interaction requests
     *
     * This method handles webhook requests from Discord, verifying their authenticity
     * and producing appropriate responses based on the interaction type.
     *
     * @param req - The incoming HTTP request from Discord
     * @returns A Response object to be returned to Discord, or undefined
     */
    async endpoint(req: Request): Promise<Response | undefined> {
        if (req.method.toUpperCase() === 'POST') {
            return interactionEndpoint(req, this.appPublicKey, this);
        } else {
            return new Response('Method Not Allowed', { status: 405 });
        }
    }

    /**
     * Registers application commands with Discord
     *
     * This method allows you to register or update application commands (slash commands)
     * for your Discord application. You can register commands globally or for a specific guild.
     *
     * @param commands - The commands to register, either as a global or guild-specific command
     * @param guildId - Optional guild ID for guild-specific commands
     */
    async registerCommands(
        commands:
            | RESTPutAPIApplicationCommandsJSONBody
            | RESTPutAPIApplicationGuildCommandsJSONBody,
        guildId?: string
    ): Promise<
        | RESTPutAPIApplicationCommandsResult
        | RESTPutAPIApplicationGuildCommandsResult
    > {
        if (guildId) {
            return this.API.applicationCommands.bulkOverwriteGuildCommands(
                this.clientId,
                guildId,
                commands as RESTPutAPIApplicationGuildCommandsJSONBody
            );
        } else {
            return this.API.applicationCommands.bulkOverwriteGlobalCommands(
                this.clientId,
                commands as RESTPutAPIApplicationCommandsJSONBody
            );
        }
    }

    /**
     * Destroys the client instance
     * @returns {void} Nothing
     */
    destroy(): void {
        this.REST.clearHashSweeper();
        this.REST.clearHandlerSweeper();
    }

    /**
     * Asynchronously disposes of the client instance
     * @returns {Promise<void>} A promise that resolves when the client is disposed
     */
    public async [Symbol.asyncDispose](): Promise<void> {
        await this.destroy();
    }
}

export default Client;
