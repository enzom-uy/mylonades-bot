import {
    ChatInputCommandInteraction,
    Collection,
    DiscordAPIError,
    Message,
    PartialMessage,
    SlashCommandBuilder,
    TextChannel
} from 'discord.js'

import { log } from '../../utils/log'

const messageTooOldErrorCode = 50034

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
            const error = e as DiscordAPIError
            if (error.code === messageTooOldErrorCode) {
                await i.editReply('Solo se pueden eliminar mensajes de los últimos 14 días.')
                return
            }
            log('ERROR', error)
        }
    }
    return
}
