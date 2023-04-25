import { Client, GatewayIntentBits } from 'discord.js'
const { Guilds } = GatewayIntentBits

export const client = new Client({ intents: [Guilds] })
