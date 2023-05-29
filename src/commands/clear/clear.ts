import {
    ChatInputCommandInteraction,
    Collection,
    Message,
    PartialMessage,
    SlashCommandBuilder,
    TextChannel
} from 'discord.js'

import { log } from '../../utils/log'

export const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Borra x cantidad de mensajes.')
    .addStringOption(o =>
        o.setName('cantidad').setDescription('Cantidad de mensajes a borrar.').setRequired(true)
    )

export const execute = async (
    i: ChatInputCommandInteraction
): Promise<Collection<string, PartialMessage | Message<boolean> | undefined> | undefined> => {
    await i.deferReply()
    const messagesToDelete = i.options.getString('cantidad')
    const channel = i.channel
    if (channel instanceof TextChannel) {
        try {
            const messages = await channel.messages.fetch({ limit: Number(messagesToDelete) })
            // Has to be greater than 1 because the "/clear" command messages counts as a message
            if (messages.size > 1) await channel.bulkDelete(Number(messagesToDelete))
        } catch (e) {
            log('ERROR', e)
        }
    }
    return
}
