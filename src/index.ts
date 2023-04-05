import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { interactionCreateListener } from './discord/listeners/InteractionCreateListener';
import { readyListener } from './discord/listeners/ReadyListener';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on('interactionCreate', interactionCreateListener);
client.on('ready', readyListener);

async function main() {
  client.login(process.env.DISCORD_TOKEN);
}

main().catch((e) => {
  throw e;
});
