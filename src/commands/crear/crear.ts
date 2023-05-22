import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder
} from 'discord.js'

import { validateInputs } from '../../schemas/commands/crear'
import { StringOptions } from '../../types/commands/crear'
import { handleMapAndNadeTypeAutocomplete } from '../../utils/commands/handle-autocomplete'
import { compareRequired } from '../../utils/commands/sort-required-first'
import { prismaCreateNade } from '../../utils/prisma/create'

const stringOptions: StringOptions[] = [
    {
        title: 'título',
        description: 'Título de la granada, por ejemplo: "Humo de TT a Jungla".',
        required: true
    },
    {
        title: 'descripción',
        description:
            'Descripción de la granada, por ejemplo: "Humo jumpthrow desde base TT para tapar jungla en A."',
        required: false
    }
]

const optionsRequiredFirst = stringOptions.sort(compareRequired)
export const data = new SlashCommandBuilder()
    .setName('crear')
    .setDescription('Crea una nueva granada.')
data.addAttachmentOption(o =>
    o.setName('video').setDescription('Video de la granada.').setRequired(true)
)
data.addStringOption(o =>
    o.setName('mapa').setDescription('Nombre del mapa.').setAutocomplete(true).setRequired(true)
)
data.addStringOption(o =>
    o.setName('tipo').setDescription('Tipo de la granada.').setAutocomplete(true).setRequired(true)
)
optionsRequiredFirst.forEach(option => {
    data.addStringOption(opt =>
        opt
            .setName(option.title)
            .setDescription(option.description)
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
    const title = i.options.getString('título')
    const description = i.options.getString('descripción')
    const nadeType = i.options.getString('tipo') as string
    const map = i.options.getString('mapa') as string
    const attachment = i.options.getAttachment('video')

    const { success, errorMessage } = validateInputs({
        título: title as string,
        descripción: description,
        videoUrl: attachment?.proxyURL as string
    })

    if (success === false && errorMessage && errorMessage.length > 0) {
        await i.editReply(String(errorMessage))
    }
    if (success) {
        const { newNade, message, exists } = await prismaCreateNade({
            user: i.user,
            description: description && description,
            title: title as string,
            videoUrl: attachment?.proxyURL as string,
            map,
            nadeType
        })
        if (exists && exists.length > 0) {
            await i.editReply({
                content: message,
                files: [exists[0].video_url]
            })
            return
        }
        if (newNade) {
            await i.editReply({
                content: `Se ha subido una nueva nade a Mylo Nades:`,
                files: [attachment?.proxyURL as string]
            })
        }
        if (!newNade && !exists) {
            await i.editReply(
                'Ocurrió un error intentando subir la granada. Por favor inténtelo nuevamente.'
            )
        }
    }
    return
}
