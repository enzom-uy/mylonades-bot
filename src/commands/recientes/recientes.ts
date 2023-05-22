import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import { loadingEmbedComponent } from '../../components/loading-embed'
import { selectNadeMenuComponent } from '../../components/select-nade-menu'
import { DiscordComponentConfirmationResponse, Filter } from '../../types/commands/recientes'
import { embedColor } from '../../utils/bot/embeds'
import { log } from '../../utils/log'
import { getLastFiveNades } from '../../utils/prisma/find'

const selectMenuContent = '¿Qué granada quieres ver?'

export const data = new SlashCommandBuilder()
    .setName('recientes')
    .setDescription('Muestra las últimas 5 granadas que se crearon.')

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
    await i.deferReply()

    const { lastFiveNades } = await getLastFiveNades()
    if (lastFiveNades.length === 0) {
        await i.editReply('Todavía no se ha creado ninguna granada.')
        return
    }

    const embedWithNades = new EmbedBuilder()
        .setTitle('Últimas 5 granadas')
        .setAuthor({ name: 'Mylo' })
        .addFields(lastFiveNades.map(nade => ({ name: nade.title, value: nade.video_url })))
        .setTimestamp()

    await i.followUp({ embeds: [embedWithNades] })

    const { row } = selectNadeMenuComponent(lastFiveNades)

    const userResponseSelectMenu = await i.followUp({
        content: selectMenuContent,
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
                    { name: 'Título', value: selectedNade.title, inline: true },
                    { name: 'Mapa', value: selectedNade.map.name, inline: true },
                    { name: 'Tipo', value: selectedNade.nadeTypeName, inline: true },
                    { name: 'Autor', value: selectedNade.author.name, inline: true }
                )
                .setTimestamp()

            await userResponseSelectMenu.delete()
            const nadeData = await i.editReply({
                embeds: [loadingEmbedComponent('Cargando granada...')]
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
