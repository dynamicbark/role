import { Client } from 'discord.js';

export async function readyListener(clientObject: Client<true>): Promise<void> {
  console.log(`Logged in as ${clientObject.user.tag}.`);
}
