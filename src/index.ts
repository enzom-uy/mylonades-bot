import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'

import { BOT_TOKEN } from './config/envs'

const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({ intents: [Guilds, MessageContent, GuildMessages, GuildMembers] })

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}.`)
})

client.login(BOT_TOKEN)

client.commands = new Collection()

const commandsPaths = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPaths).filter(file => file.endsWith('.js' || '.ts'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPaths, file)
  const command = require(filePath)

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    )
  }
}
