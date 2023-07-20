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

import { CommandData } from '../../types/commands'
import { log } from '../../utils/log'

const messageTooOldErrorCode = 50034

export const clearCommandData: CommandData = {
    name: 'clear',
    spanishName: 'clear',
    description: 'Deletes x number of messages.',
    spanishDescription: 'Borra x cantidad de mensajes.'
}

export const data = new SlashCommandBuilder()
    .setName(clearCommandData.name)
    .setDescription(clearCommandData.description)
    .setDescriptionLocalizations({
        'es-ES': clearCommandData.spanishDescription
    })
    .addStringOption(o =>
        o
            .setName('quantity')
            .setNameLocalizations({ 'es-ES': 'cantidad' })
            .setDescription('Number of messages to delete.')
            .setDescriptionLocalizations({ 'es-ES': 'Número de mensajes a borrar.' })
            .setRequired(true)
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
                await i.editReply(
                    isSpanish
                        ? 'Solo se pueden eliminar mensajes de los últimos 14 días.'
                        : 'Only messages from the last 14 days can be deleted.'
                )
                return
            }
            log('ERROR', error)
        }
    }
    return
}
