/**
 * Error class representing issues with the endpoint response
 * Thrown when the interaction endpoint encounters problems processing the request
 */
export class EndpointResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EndpointResponseError';
  }
}

/**
 * Error class representing invalid or missing authentication keys
 * Thrown when required configuration keys are missing or invalid
 */
export class InvalidKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidKeyError';
  }
}