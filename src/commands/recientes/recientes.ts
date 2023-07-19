import { ChatInputCommandInteraction, EmbedBuilder, LocaleString, SlashCommandBuilder } from 'discord.js'

import { loadingEmbedComponent } from '../../components/loading-embed'
import { selectNadeMenuComponent } from '../../components/select-nade-menu'
import { DiscordComponentConfirmationResponse, Filter } from '../../types/commands/recientes'
import { embedColor } from '../../utils/bot/embeds'
import { log } from '../../utils/log'
import { getLastFiveNades } from '../../utils/prisma/find'

export const data = new SlashCommandBuilder()
    .setName('recents')
    .setNameLocalizations({'es-ES': 'recientes'})
    .setDescription('Show the last 5 nades created.')
    .setDescriptionLocalizations({'es-ES': 'Muestra las últimas 5 granadas que se crearon.'})

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
    await i.deferReply()
    const locale: LocaleString = i.locale
    const isSpanish = locale === 'es-ES'

    const { lastFiveNades } = await getLastFiveNades({ serverId: i.guildId as string })
    if (lastFiveNades.length <= 0) {
        await i.editReply(isSpanish ? 'Todavía no se ha creado ninguna granada.' : 'No nade was uploaded yet.')
        return
    }

    const embedWithNades = new EmbedBuilder()
        .setTitle(isSpanish ? 'Últimas 5 granadas' : 'Last 5 nades')
        .setAuthor({ name: 'Mylo' })
        .addFields(lastFiveNades.map(nade => ({ name: nade.title, value: nade.video_url })))
        .setTimestamp()

    await i.followUp({ embeds: [embedWithNades] })

    const { row } = selectNadeMenuComponent(lastFiveNades, locale)

    const userResponseSelectMenu = await i.followUp({
        content: isSpanish ? '¿Qué granada quieres ver?' : 'What nade do you want to see?',
        components: [row]
    })

    const collectorFilter: Filter = (interaction: any): boolean => interaction.user.id === i.user.id

    try {
        const confirmation = (await userResponseSelectMenu.awaitMessageComponent({
            filter: collectorFilter
        })) as unknown as DiscordComponentConfirmationResponse

        if (confirmation.customId === 'select') {
            const selectedNade = lastFiveNades.filter(
                nade => nade.title === confirmation.values[0]
            )[0]

            const embedResponse = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(selectedNade.title)
                .addFields(
                    { name: isSpanish ? 'Título' : 'Title', value: selectedNade.title, inline: true },
                    { name: isSpanish ? 'Mapa' : 'Map', value: selectedNade.map.name, inline: true },
                    { name: isSpanish ? 'Tipo' : 'Type', value: selectedNade.nade_type_name, inline: true },
                    { name: isSpanish ? 'Autor' : 'Author', value: selectedNade.author.name, inline: true }
                )
                .setTimestamp()

            await userResponseSelectMenu.delete()
            const nadeData = await i.editReply({
                embeds: [loadingEmbedComponent(isSpanish ? 'Cargando granada...' : 'Loading nade...')]
            })
            await i
                .followUp({ files: [selectedNade.video_url] })
                .then(() => nadeData.edit({ embeds: [embedResponse] }))
        }
        return
    } catch (e) {
        log('ERROR', e)
    }
    return
}
