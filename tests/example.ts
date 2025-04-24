import { Client, Interaction } from './../src/index';
const client = new Client({
    appPublicKey: 'appPublicKey',
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    clientToken: 'clientToken',
});

client.on('ApplicationCommand', (interaction) => {
    console.log('Received interaction:', interaction);
});

client.on('ping', (isValid, res) => {
    console.log(`Ping is valid: ${isValid}`);
    console.log(`Response:`, res);
});

client.on('MessageComponent',_=>{})