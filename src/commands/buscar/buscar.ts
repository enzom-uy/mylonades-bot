import {
    ActionRow,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    MessageActionRowComponent,
    SlashCommandBuilder
} from 'discord.js'

import { confirmButtonRow } from '../../components/confirm-looking-nades'
import { embedResponseNadeComponent } from '../../components/embed-response-nade'
import { embedWithNadesComponent } from '../../components/embed-with-nades'
import { loadingEmbedComponent } from '../../components/loading-embed'
import { CustomId, handlePaginationArrows } from '../../components/pagination-arrows'
import { SELECT_MENU_CONTENT, selectNadeMenuComponent } from '../../components/select-nade-menu'
import { InteractionFailedError } from '../../errors/errors'
import { DiscordComponentConfirmationResponse, Filter } from '../../types/commands/recientes'
import { handleMapAndNadeTypeAutocomplete } from '../../utils/commands/handle-autocomplete'
import { log } from '../../utils/log'
import { getPaginatedData } from '../../utils/paginate'
import { getNades } from '../../utils/prisma/find'

export const data = new SlashCommandBuilder()
    .setName('buscar')
    .setDescription('Busca una granada en base a ciertas preferencias.')

data.addStringOption(option =>
    option
        .setName('query')
        .setDescription(
            'Texto relacionado a la granada. Puede ser una parte del título o descripción.'
        )
)
data.addStringOption(o =>
    o.setName('mapa').setDescription('Nombre del mapa.').setAutocomplete(true)
)
data.addStringOption(o =>
    o.setName('tipo').setDescription('Tipo de la granada.').setAutocomplete(true)
)

export const autocomplete = async (i: AutocompleteInteraction): Promise<void> => {
    await handleMapAndNadeTypeAutocomplete(i)
}

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
    await i.deferReply()

    const query = i.options.getString('query')
    const map = i.options.getString('mapa')
    const nadeType = i.options.getString('tipo')
    const collectorFilter: Filter = (interaction): boolean => interaction.user.id === i.user.id

    const { nades } = await getNades({ query, map, nadeType })

    let currentPage = 1
    const pageSize = 6
    let { currentNades, endIndex } = getPaginatedData(currentPage, pageSize, nades)

    let shouldContinue = true

    const handleShowNades = async (): Promise<void> => {
        // Create embed with all the nades and show them to the user.
        const showFoundedNadesEmbed = embedWithNadesComponent({
            title: 'Granadas encontradas',
            author: 'Mylo',
            nades: currentNades
        })

        const { paginationArrowsComponent } = handlePaginationArrows({
            currentPage: currentPage,
            endIndex
        })

        const paginationArrows = await i.editReply({
            embeds: [showFoundedNadesEmbed],
            components: [
                paginationArrowsComponent as unknown as ActionRow<MessageActionRowComponent>
            ]
        })

        try {
            const paginationArrowsConfirmation = await paginationArrows.awaitMessageComponent({
                filter: collectorFilter
            })
            if (!paginationArrowsConfirmation) {
                log('ERROR', 'No hubo confirmación.')
                return
            }
            const userClicked = paginationArrowsConfirmation.customId as CustomId

            if (userClicked === 'left' && currentPage <= 1)
                log('INFO', 'El usuario quiso ir a la izquierda pero ya está en la primera página.')
        } catch (e) {
            throw new InteractionFailedError()
        }

        const { row } = selectNadeMenuComponent(currentNades)
        const userResponseSelectMenu = await i.followUp({
            content: SELECT_MENU_CONTENT,
            components: [row]
        })

        try {
            const userSelectConfirmation = userResponseSelectMenu.awaitMessageComponent({
                filter: collectorFilter
            }) as unknown as DiscordComponentConfirmationResponse

            // User chooses a nade from the Select Menu.
            if (userSelectConfirmation.customId === 'select') {
                const selectedNade = currentNades.filter(
                    nade => nade.title === userSelectConfirmation.values[0]
                )[0]

                // Create a new embed with the selected nade info.
                const embedResponse = embedResponseNadeComponent(selectedNade)

                await userResponseSelectMenu.delete()

                const nadeData = await i.editReply({
                    embeds: [loadingEmbedComponent('Cargando granada...')]
                })

                // Answer the user with the previous made embed and the nade video.
                const nadeVideo = await i.followUp({ files: [selectedNade.video_url] })
                await nadeData.edit({ embeds: [embedResponse] })

                const showButton = await i.followUp({
                    content: `¿Quieres volver a ver las granadas?`,
                    components: [confirmButtonRow]
                })

                const buttonConfirmation = (await showButton.awaitMessageComponent({
                    filter: collectorFilter
                })) as unknown as DiscordComponentConfirmationResponse

                if (buttonConfirmation.customId === 'cancel') {
                    shouldContinue = false

                    // Delete all messages cause user doesn't want to continue looking for nades.
                    await nadeData.delete()
                    await nadeVideo.delete()
                    await showButton.delete()
                    return
                }
                // Delete all messages but nade info because is the "root" message.
                // I need it to edit it and start the interaction again.
                await showButton.delete()
                await nadeVideo.delete()
                await userResponseSelectMenu.delete()

                await handleShowNades()
            }
            return
        } catch (e) {
            throw new InteractionFailedError()
        }
    }
    while (shouldContinue) {
        await handleShowNades()
    }

    return
}
