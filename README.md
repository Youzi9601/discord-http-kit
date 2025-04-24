# discord-http-kit

A lightweight HTTP-based Discord bot framework built with @discordjs/core and discord-api-types for self, designed to simplify the development process by streamlining command creation and API integration.

## Get Start

### Example Usage

```typescript
import { Client, commandFileBuilder } from 'discord-http-kit';

// * Configures the Client class for Discord
const core = new Client({
    clientId: '123456789012345678',
    clientSecret: 'your_client_secret',
    clientToken: 'your_client_token',
    appPublicKey: 'your_app_public_key',
});

// * Handles Discord interactions
app.post('/discord-interaction-endpoint', function (req) {
    core.endpoint(req);
});

// * Creates a command file for the help command
export const help = commandFileBuilder({
    register: {
        name: 'help',
        description: 'Get help with the bot',
    },
    execute: async (interaction) => {
        return {
            type: 4,
            data: {
                content: 'Here is some help information.',
            },
        };
    },
});
```

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
