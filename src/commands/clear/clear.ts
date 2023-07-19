import {
    ChatInputCommandInteraction,
    Collection,
    DiscordAPIError,
    LocaleString,
    Message,
    PartialMessage,
    SlashCommandBuilder,
    TextChannel
} from 'discord.js'

import { log } from '../../utils/log'

const messageTooOldErrorCode = 50034

export const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes x number of messages.')
    .setDescriptionLocalizations({
        'es-ES': 'Borra x cantidad de mensajes'
    })
    .addStringOption(o =>
        o.setName('quantity').setNameLocalizations({'es-ES': 'cantidad'}).setDescription('Number of messages to delete.').setDescriptionLocalizations({'es-ES': 'Número de mensajes a borrar.'}).setRequired(true)
    )

export const execute = async (
    i: ChatInputCommandInteraction
): Promise<Collection<string, PartialMessage | Message<boolean> | undefined> | undefined> => {
    await i.deferReply()
    const locale: LocaleString = i.locale
    const isSpanish = locale === 'es-ES'
    const messagesToDelete = i.options.getString('quantity')
    const channel = i.channel
    if (channel instanceof TextChannel) {
        try {
            const messages = await channel.messages.fetch({ limit: Number(messagesToDelete) })
            // Has to be greater than 1 because the "/clear" command messages counts as a message
            if (messages.size > 1) await channel.bulkDelete(Number(messagesToDelete))
        } catch (e) {
            const error = e as DiscordAPIError
            if (error.code === messageTooOldErrorCode) {
                await i.editReply(isSpanish ? 'Solo se pueden eliminar mensajes de los últimos 14 días.' : 'Only messages from the last 14 days can be deleted.')
                return
            }
            log('ERROR', error)
        }
    }
    return
}
