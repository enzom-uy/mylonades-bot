import { ChatInputCommandInteraction, Collection, REST, Routes } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'

import { client } from './config/client'
import { APP_ID, BOT_TOKEN } from './config/envs'

type Command = {
  data: {
    options: []
    name: string
    name_localizations: undefined
    description: string
    description_localizations: string | undefined
    default_permission: any
    default_member_permissions: any
    dm_permission: any
    nsfw: any
  }
  execute: (i: ChatInputCommandInteraction) => any
}

const commands: Command[] = []

client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandsFolder = fs.readdirSync(foldersPath)

for (const folder of commandsFolder) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON())
      client.commands.set(command.data.name, command)
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      )
    }
  }
}

const rest = new REST().setToken(BOT_TOKEN)

;(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(Routes.applicationCommands(APP_ID), {
      body: commands
    })

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
