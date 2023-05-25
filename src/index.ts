import { DiscordAPIError, Events } from 'discord.js'

import { client } from './config/client'
import { BOT_TOKEN } from './config/envs'
import './deploy-commands'
import { deleteBotMessages } from './utils/bot/delete-bot-messages'
import { log } from './utils/log'

const sevenMinInMs = 420000

client.login(BOT_TOKEN)

client.once(Events.ClientReady, async c => {
    log('SUCCESS', `Ready! Logged in as ${c.user.tag}.`)

    const channels = client.channels.cache.values()
    setInterval(() => {
        deleteBotMessages({ client, channels }).catch((e: DiscordAPIError) =>
            log('ERROR', e.message)
        )
    }, sevenMinInMs)
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
