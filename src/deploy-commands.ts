import { Collection, REST, Routes } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'

import { loadMapsFromDb } from './config/cache'
import { client } from './config/client'
import { APP_ID, BOT_TOKEN } from './config/envs'
import { Command } from './types/commands'
import { log } from './utils/log'
;(async () => {
    await loadMapsFromDb()
})()

const commands: Command[] = []
const rest = new REST().setToken(BOT_TOKEN)

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
            log(
                'WARNING',
                `The command at ${filePath} is missing a required "data" or "execute" property.`
            )
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
    try {
        log('INFO', `Started refreshing ${commands.length} application (/) commands.`)

        // The put method is used to fully refresh all commands in the guild with the current set
        const data: any = await rest.put(Routes.applicationCommands(APP_ID), {
            body: commands
        })

        log('SUCCESS', `Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        log('ERROR', error)
    }
})()

/* rest */
/*   .delete(Routes.applicationGuildCommand(APP_ID, GUILD_ID, '1100512417596854432')) */
/*   .then(() => log('SUCCESS', 'Successfully deleted application command "/ping".')) */
/*   .catch(e => log('ERROR', e)) */
