import { Client, GatewayIntentBits } from 'discord.js'
const { Guilds, GuildMessages } = GatewayIntentBits

export const client = new Client({ intents: [Guilds, GuildMessages] })
