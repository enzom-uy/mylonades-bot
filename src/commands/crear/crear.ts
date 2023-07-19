import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    LocaleString,
    Message,
    SlashCommandBuilder
} from 'discord.js'

import { embedResponseNadeComponent } from '../../components/embed-response-nade'
import { loadingEmbedComponent } from '../../components/loading-embed'
import { prisma } from '../../config/database'
import { validateInputs } from '../../schemas/commands/crear'
import { StringOptions } from '../../types/commands/crear'
import { handleMapAndNadeTypeAutocomplete } from '../../utils/commands/handle-autocomplete'
import { compareRequired } from '../../utils/commands/sort-required-first'
import { WEBSITE_URL } from '../../utils/constants'
import { checkIfUserExist } from '../../utils/prisma/check-if-user-exists'
import { prismaCreateNade } from '../../utils/prisma/create'

const stringOptions: StringOptions[] = [
    {
        title: 'title',
        'spanish-title': 'título',
        description: 'Nade title.',
        'spanish-description': 'Título de la granada, por ejemplo: "Humo de TT a Jungla".',
        required: true
    },
    {
        title: 'description',
        'spanish-title': 'descripción',
        description:
            'Description of the nade. e.g: "Jumpthrow from T Spawn that covers all Jungle on A Site."',
        'spanish-description':
            'Descripción de la granada, por ejemplo: "Humo jumpthrow desde base TT para tapar jungla en A."',
        required: false
    }
]

const optionsRequiredFirst = stringOptions.sort(compareRequired)
export const data = new SlashCommandBuilder()
    .setName('create')
    .setNameLocalizations({ 'es-ES': 'crear' })
    .setDescription('Creates a new nade.')
    .setDescriptionLocalizations({ 'es-ES': 'Crea una nueva granada.' })
data.addAttachmentOption(o =>
    o
        .setName('video')
        .setDescription(`Nade video (Discord's file size limit).`)
        .setDescriptionLocalizations({
            'es-ES': 'Video de la granada (dentro del límite de peso de Discord).'
        })
        .setRequired(true)
)
data.addStringOption(o =>
    o
        .setName('map')
        .setNameLocalizations({
            'es-ES': 'mapa'
        })
        .setDescription('Map name.')
        .setDescriptionLocalizations({ 'es-ES': 'Nombre del mapa.' })
        .setAutocomplete(true)
        .setRequired(true)
)
data.addStringOption(o =>
    o
        .setName('type')
        .setNameLocalizations({ 'es-ES': 'tipo' })
        .setDescription('Nade type.')
        .setDescriptionLocalizations({ 'es-ES': 'Tipo de la granada.' })
        .setAutocomplete(true)
        .setRequired(true)
)
optionsRequiredFirst.forEach(option => {
    data.addStringOption(opt =>
        opt
            .setName(option.title)
            .setNameLocalizations({ 'es-ES': option['spanish-title'] })
            .setDescription(option.description)
            .setDescriptionLocalizations({ 'es-ES': option['spanish-description'] })
            .setRequired(option.required)
            .setAutocomplete(option.autocomplete ? true : false)
    )
})

export const autocomplete = async (i: AutocompleteInteraction): Promise<void> => {
    await handleMapAndNadeTypeAutocomplete(i)
}

export const execute = async (
    i: ChatInputCommandInteraction
): Promise<Message<boolean> | undefined> => {
    await i.deferReply()
    const locale: LocaleString = i.locale
    const isSpanish = locale === 'es-ES'
    const userExists = await checkIfUserExist({ userId: i.user.id })
    console.log(userExists)
    if (!userExists) {
        await i.editReply({
            content: isSpanish
                ? `Parece que no has iniciado sesión en la página. ${WEBSITE_URL}`
                : `It looks that you haven't logged in to the site yet. ${WEBSITE_URL}`
        })
        return
    }
    const title = i.options.getString('title')
    const description = i.options.getString('description')
    const nadeType = i.options.getString('type') as string
    const map = i.options.getString('map') as string
    const attachment = i.options.getAttachment('video')

    if (!attachment?.contentType?.startsWith('video/')) {
        await i.editReply({
            content: isSpanish
                ? 'El archivo adjuntado no es un video. No se subió ninguna granada.'
                : 'The attached file is not a video. No grenade was uploaded.'
        })
        return
    }
    const serverExists = await prisma.server.findFirst({
        where: {
            id: i.guildId as string
        }
    })

    if (!serverExists) {
        await i.editReply(
            isSpanish
                ? `El servidor no existe. Créalo por medio de la página ${WEBSITE_URL}`
                : `The server does not exist. Create it using the page ${WEBSITE_URL}`
        )
        return
    }
    console.log(serverExists)

    const { success, errorMessage } = validateInputs({
        título: title as string,
        descripción: description,
        videoUrl: attachment.proxyURL
    })

    if (success === false) {
        await i.editReply(String(errorMessage))
        return
    }

    const { newNade, message, exists } = await prismaCreateNade({
        description: description && description,
        title: title as string,
        videoUrl: attachment?.proxyURL,
        map,
        nadeType,
        userId: i.user.id,
        serverId: i.guildId as string
    })

    if (exists && exists.length > 0) {
        await i.editReply({
            content: message,
            files: [exists[0].video_url]
        })
        return
    }
    if (newNade) {
        const successMessage = await i.editReply({
            content: isSpanish
                ? `Se ha subido una nueva nade a tu servidor:`
                : `A new nade was uploaded to your server:`,
            embeds: [loadingEmbedComponent(isSpanish ? 'Cargando granada...' : 'Loading nade...')]
        })
        await i.followUp({
            files: [attachment?.proxyURL]
        })
        await successMessage.edit({
            embeds: [embedResponseNadeComponent(newNade)]
        })
    }
    if (!newNade && !exists) {
        await i.editReply(
            isSpanish
                ? 'Ocurrió un error intentando subir la granada. Por favor inténtelo nuevamente.'
                : 'An error happened while trying to upload the nade. Please try again.'
        )
    }
    return
}
