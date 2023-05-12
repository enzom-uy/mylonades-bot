import { Channel, Client, TextChannel } from 'discord.js'

import { log } from '../log'

export const deleteBotMessages = async ({
  channels,
  client
}: {
  channels: IterableIterator<Channel>
  client: Client<boolean>
}): Promise<void> => {
  for (const channel of channels) {
    if (channel instanceof TextChannel) {
      const messages = await channel.messages.fetch()
      const botMessages = messages.filter(m => m.author.id === client.user?.id)
      return await channel
        .bulkDelete(botMessages)
        .then(() =>
          log('SUCCESS', `Deleted ${botMessages.size} messages in channel ${channel.name}`)
        )
        .catch(e => log('ERROR', e))
    }
  }
}
