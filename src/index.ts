import { Events, TextChannel } from 'discord.js'

import { client } from './config/client'
import { BOT_TOKEN } from './config/envs'
import './deploy-commands'
import { log } from './utils/log'

export const sevenMinInMs = 420000

client.login(BOT_TOKEN)

client.once(Events.ClientReady, async c => {
    log('SUCCESS', `Ready! Logged in as ${c.user.tag}.`)
})

client.on('messageCreate', async message => {
    const messageAuthorIsBot = client.user?.id === message.author.id

    try {
        if (messageAuthorIsBot && message) {
            setTimeout(async () => {
                const channel = message.channel
                if (channel instanceof TextChannel) {
                    // Get channel messages
                    const fetchedMessages = await channel.messages.fetch()

                    // Check if the message still exists
                    if (fetchedMessages.has(message.id)) {
                        // If the message exists, it can be deleted
                        await message.delete()
                    }
                }
            }, sevenMinInMs)
        }
    } catch (e) {
        log('ERROR', e)
    }
})

client.on(Events.InteractionCreate, async i => {
    if (i.isAutocomplete()) {
        const command = i.client.commands.get(i.commandName)
        if (!command) return

        try {
            await command.autocomplete(i as any)
        } catch (error) {
            log('ERROR', error)
        }
    }
})

client.on(Events.InteractionCreate, async i => {
    if (!i.isChatInputCommand()) return

    const command = i.client.commands.get(i.commandName)

    if (!command) {
        return log('ERROR', `No command mathing ${i.commandName} was found.`)
    }

    try {
        await command.execute(i)
    } catch (error) {
        log('ERROR', error)
        return
    }
})
