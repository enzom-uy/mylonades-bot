import {
    APIEmbedField,
    ChatInputCommandInteraction,
    EmbedBuilder,
    LocaleString,
    SlashCommandBuilder
} from 'discord.js'

import { sevenMinInMs } from '../..'
import { type CommandData } from '../../types/commands'
import { embedColor } from '../../utils/bot/embeds'
import { clearCommandData } from '../clear/clear'
import { connectCommandData } from '../connect/connect'
import { createCommandData } from '../create/create'
import { recentCommandData } from '../recent/recent'
import { searchCommandData } from '../search/search'

export const data = new SlashCommandBuilder()
    .setName('help')
    .setNameLocalizations({ 'es-ES': 'ayuda' })
    .setDescription('Show all the available commands and descriptions.')
    .setDescriptionLocalizations({
        'es-ES': 'Muestra todos los comandos disponibles y sus descripciones.'
    })

const commandsData: CommandData[] = [
    connectCommandData,
    searchCommandData,
    clearCommandData,
    recentCommandData,
    createCommandData
]

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
    const locale: LocaleString = i.locale
    const isSpanish = locale === 'es-ES'
    const fields: APIEmbedField[] = commandsData.map(cmd => ({
        name: `/${isSpanish ? cmd.spanishName : cmd.name}`,
        value: isSpanish ? cmd.spanishDescription : cmd.description
    }))

    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(isSpanish ? 'Todos los comandos.' : 'All commands.')
        .addFields(fields)

    await i.reply({ ephemeral: true, embeds: [embed] }).then(msg =>
        setTimeout(() => {
            msg.delete()
        }, sevenMinInMs)
    )
    return
}
