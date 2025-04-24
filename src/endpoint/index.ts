import { InteractionResponseType, InteractionType } from '@discordjs/core';
import { EndpointResponseError } from '../utils/errors';
import { verifyInteractionRequest } from '../utils/verifyReq';
import type { Client } from '../index';
import { CoreEventKeys } from '../utils/event';

/**
 * Endpoint function for handling Discord interaction requests
 *
 * This function verifies the signature of interaction requests from Discord to ensure they are legitimate.
 * If signature verification fails, it returns a response with a 401 status code.
 *
 * @param req - The interaction request object sent by Discord
 * @param appPublicKey - Discord application's public key, used for verifying the request signature
 * @param client - The client instance used to emit events
 * @returns {Promise<Response|undefined>} Response after handling the interaction request. Returns 401 error response if signature is invalid
 * @todo This function is not fully implemented yet. It currently only handles the ping interaction type.
 */
async function interactionEndpoint(
    req: Request,
    appPublicKey: string,
    client: Client
): Promise<Response | undefined> {
    try {
        const verifyRes = await verifyInteractionRequest(req, appPublicKey);

        if (!verifyRes.isValid) {
            client.emit(CoreEventKeys.requestIsNotValid, req);
            return new Response('Invalid request signature', { status: 401 });
        }

        const { interaction } = verifyRes;

        switch (interaction.type) {
            /**
             * Responds to Discord's ping interaction with a pong response
             * Used by Discord to validate that the endpoint is properly configured
             */
            case InteractionType.Ping:
                client.emit(CoreEventKeys.endPointPing, req);
                return Response.json({
                    type: InteractionResponseType.Pong,
                });
            /**
             * Handles application commands (slash commands)
             * Additional command handling logic would be implemented here
             */
            case InteractionType.ApplicationCommand:
                client.emit(CoreEventKeys.ApplicationCommand, interaction);
                break;
            /**
             * Handles message component interactions (buttons, select menus)
             */
            case InteractionType.MessageComponent:
                client.emit(CoreEventKeys.MessageComponent, interaction);
                break;
            /**
             * Handles autocomplete interactions for command options
             */
            case InteractionType.ApplicationCommandAutocomplete:
                client.emit(
                    CoreEventKeys.ApplicationCommandAutocomplete,
                    interaction
                );
                break;
            /**
             * Handles modal submit interactions
             */
            case InteractionType.ModalSubmit:
                client.emit(CoreEventKeys.ModalSubmit, interaction);
                break;
            default:
                break;
        }
        throw new EndpointResponseError('Unknown interaction type');
    } catch (error) {
        if (error instanceof EndpointResponseError) {
            return new Response(error.message, { status: 400 });
        } else {
            console.error('Unexpected error:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }
}

export { interactionEndpoint };
