/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    LocaleString,
    MessageActionRowComponent,
    SlashCommandBuilder
} from 'discord.js'

import { sevenMinInMs } from '../..'
import { buttonWithCustomIdValidation } from '../../components/pagination-arrows'
import { prisma } from '../../config/database'
import { CommandData } from '../../types/commands'
import { DiscordComponentConfirmationResponse, Filter } from '../../types/commands/recientes'
import { embedColor } from '../../utils/bot/embeds'
import { WEBSITE_URL } from '../../utils/constants'

export const connectCommandData: CommandData = {
    name: 'connect',
    spanishName: 'conectar',
    description: 'Connects your server with the Database.',
    spanishDescription: 'Conecta tu servidor a la Base de Datos.'
}

export const data = new SlashCommandBuilder()
    .setName(connectCommandData.name)
    .setNameLocalizations({ 'es-ES': connectCommandData.spanishName })
    .setDescription(connectCommandData.description)
    .setDescriptionLocalizations({ 'es-ES': connectCommandData.spanishDescription })

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
    await i.deferReply({ ephemeral: true })
    const locale: LocaleString = i.locale
    const isSpanish = locale === 'es-ES'
    const guildId = i.guild?.id
    const userId = i.user.id
    const guildOwnerId = i.guild?.ownerId
    const userIsOwner = userId === guildOwnerId
    if (!userIsOwner) {
        await i.reply({
            ephemeral: true,
            content: isSpanish
                ? 'Tienes que ser dueño del servidor.'
                : 'You have to own the server.'
        })
        return
    }
    const collectorFilter: Filter = (interaction): boolean => interaction.user.id === i.user.id

    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(
            isSpanish
                ? 'Conectar el servidor a la Base de Datos'
                : 'Connect server with the Database.'
        ).setDescription(`
        1. ${
            isSpanish
                ? 'Corrobora que hayas iniciado sesión aunque sea una vez en la plataforma: '
                : 'Verify that you have logged in at least once to the platform: '
        }${WEBSITE_URL}/\n2. ${
        isSpanish
            ? 'Si ya iniciaste sesión, presiona el botón Ya inicié sesión'
            : 'If you already logged in, press the Already logged in button'
    }\n3. ${isSpanish ? 'Listo 🙂' : 'Done 🙂'}`)

    const continueButton = new ButtonBuilder()

    const button = buttonWithCustomIdValidation<'continue'>({
        button: continueButton,
        customId: 'continue',
        label: isSpanish ? 'Ya inicié sesión' : 'Already logged in',
        style: ButtonStyle.Success
    })
    const continueButtonRow = new ActionRowBuilder().addComponents(
        button
    ) as unknown as ActionRow<MessageActionRowComponent>

    const connectEmbed = await i.editReply({ embeds: [embed], components: [continueButtonRow] })

    setTimeout(() => {
        if (connectEmbed) connectEmbed.delete()
    }, sevenMinInMs)

    const continueButtonConfirmation = (await connectEmbed.awaitMessageComponent({
        filter: collectorFilter
    })) as unknown as DiscordComponentConfirmationResponse

    const continueCustomId = continueButtonConfirmation.customId as 'continue'

    if (continueCustomId === 'continue') {
        const alreadyExists = await prisma.server.findFirst({
            where: {
                id: guildId
            }
        })
        if (alreadyExists) {
            await i.editReply({
                content: isSpanish
                    ? 'El servidor ya fue conectado.'
                    : 'Server has been connected already.',
                components: [],
                embeds: []
            })
            return
        }
        const userFromDb = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if (!userFromDb) {
            await i.editReply({
                embeds: [],
                components: [],
                content: isSpanish ? 'No iniciaste sesión.' : 'You have not logged in.'
            })
            return
        }
        const connectedServer = await prisma.server.create({
            data: {
                id: guildId!,
                name: i.guild!.name,
                members: {
                    connect: {
                        id: userId
                    }
                },
                admins: {
                    connect: {
                        id: userId
                    }
                },
                owner: {
                    connect: {
                        id: userId
                    }
                },
                server_icon: i.guild!.icon
                    ? `https://cdn.discordapp.com/icons/${guildId}/${i.guild!.icon}.png`
                    : undefined
            }
        })

        if (!connectedServer) {
            await i.editReply({
                content: isSpanish
                    ? 'Ha ocurrido un error al intentar conectar el servidor. Inténtalo nuevamente.'
                    : 'An error ocurred when tried to connect the server. Try again.',
                embeds: [],
                components: []
            })
            return
        }
        await i.editReply({
            content: isSpanish
                ? `El servidor ha sido conectado: ${WEBSITE_URL}/server/${guildId}`
                : `Server has been connected: ${WEBSITE_URL}/server/${guildId}`,
            embeds: [],
            components: []
        })
        return
    }
}
