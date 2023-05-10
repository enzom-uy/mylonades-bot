import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js'

import { myCache } from '../../config/cache'
import { validateInputs } from '../../schemas/commands/new'
import { MapsFromCache } from '../../types/commands'
import { StringOptions } from '../../types/commands/new'
import { getGfycat } from '../../utils/axios/get-gfycat'
import { compareRequired } from '../../utils/commands/sort-required-first'
import { formatGfycatUrl } from '../../utils/gfycat'
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
  },
  {
    title: 'gfycat_url',
    description: 'Link de Gfycat asociado a la granada.',
    required: true
  }
]

const optionsRequiredFirst = stringOptions.sort(compareRequired)
export const data = new SlashCommandBuilder().setName('new').setDescription('Upload a new nade.')
data.addStringOption(o =>
  o.setName('map').setDescription('Nombre del mapa.').setAutocomplete(true).setRequired(true)
)
optionsRequiredFirst.forEach(option => {
  data.addStringOption(opt =>
    opt.setName(option.title).setDescription(option.description).setRequired(option.required)
  )
})

export const autocomplete = async (i: AutocompleteInteraction): Promise<void> => {
  const focused = i.options.getFocused()
  const mapsFromCache = myCache.get('maps') as MapsFromCache[]
  const choices = mapsFromCache.map(map => map.name)
  const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focused.toLowerCase()))
  await i.respond(filtered.map(choice => ({ name: choice, value: choice })))
}

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
  await i.deferReply()
  const title = i.options.getString('título')
  const description = i.options.getString('descripción')
  const gfycatUrl = i.options.getString('gfycat_url') as string
  const gfycatUrlId = formatGfycatUrl(gfycatUrl)

  const { success, errorMessage } = validateInputs({
    título: title as string,
    descripción: description,
    gfycat_url: gfycatUrl
  })

  if (success === false && errorMessage && errorMessage.length > 0) {
    await i.editReply(String(errorMessage))
    return
  }
  if (success) {
    const axiosResponse = await getGfycat(gfycatUrlId)
    const newNade = await prismaCreateNade({
      userDiscordTag: i.user.tag,
      description: description && description,
      title: title as string,
      videoUrl: axiosResponse.gfyItem.mp4Url
    })
    if (newNade) {
      await i.editReply({
        content: `Se ha subido una nueva nade a Mylo Nades:`,
        files: [axiosResponse.gfyItem.mp4Url]
      })
    } else {
      await i.editReply('Ha ocurrido un error al intentar subir la granada. Inténtalo de nuevo.')
    }
  }
  return
}
