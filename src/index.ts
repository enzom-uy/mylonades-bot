import { Events } from 'discord.js'

import { client } from './config/client'
import { BOT_TOKEN } from './config/envs'
import './deploy-commands'
import './config/gfycat'
import { log } from './utils/log'

client.login(BOT_TOKEN)

client.once(Events.ClientReady, c => {
  log('SUCCESS', `Ready! Logged in as ${c.user.tag}.`)
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
    if (i.replied || i.deferred) {
      await i.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
      return
    } else {
      await i.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
      return
    }
  }
})
