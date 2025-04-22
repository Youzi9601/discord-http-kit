/*
https://discord.com/developers/docs/interactions/overview#:~:text=const%20nacl%20%3D%20require(%22tweetnacl%22)%3B
*/

import nacl from 'tweetnacl';
import { Interaction } from '../index';

/**
 * Verifies the authenticity of a Discord interaction request
 * 
 * This function validates that the incoming request is legitimately from Discord by checking
 * the request signature against the application's public key using the Ed25519 algorithm.
 * It follows Discord's security verification protocol as documented in their API guidelines.
 * 
 * @param request - The incoming Discord interaction request object
 * @param appPublicKey - Your Discord application's public key (hexadecimal string)
 * @returns A promise resolving to either an object indicating failure, or an object containing
 *          both the validation result and the parsed interaction data if successful
 * @see {@link https://discord.com/developers/docs/interactions/overview#setting-up-an-endpoint}
 */
export async function verifyInteractionRequest(
    request: Request,
    appPublicKey: string
): Promise<
    | { isValid: false }
    | {
          isValid: true;
          interaction: Interaction;
      }
> {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');

    if (!signature || !timestamp) {
        return { isValid: false };
    }

    const rawBody = await request.text();

    const signatureBuffer = Buffer.from(signature, 'hex');
    const publicKeyBuffer = Buffer.from(appPublicKey, 'hex');
    const messageBuffer = Buffer.from(timestamp + rawBody);

    const isValidRequest = nacl.sign.detached.verify(
        messageBuffer,
        signatureBuffer,
        publicKeyBuffer
    );

    if (!isValidRequest) {
        return { isValid: false };
    }

    return {
        interaction: JSON.parse(rawBody) as Interaction,
        isValid: true,
    };
}
