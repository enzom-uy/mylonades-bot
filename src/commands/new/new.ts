import axios from 'axios'
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { formatGfycatUrl } from '../../utils/gfycat'
import { log } from '../../utils/log'

interface StringOptions {
  title: string
  description: string
  required: boolean
}

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

const compareRequired = (a: StringOptions, b: StringOptions): 1 | -1 | 0 => {
  if (a.required && !b.required) {
    return -1
  } else if (!a.required && b.required) {
    return 1
  } else {
    return 0
  }
}

const optionsRequiredFirst = stringOptions.sort(compareRequired)

export const data = new SlashCommandBuilder().setName('new').setDescription('Upload a new nade.')
optionsRequiredFirst.forEach(option => {
  data.addStringOption(opt =>
    opt.setName(option.title).setDescription(option.description).setRequired(option.required)
  )
})

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
  await i.deferReply()
  const titulo = i.options.getString('título')
  const descripcion = i.options.getString('descripción')
  const gfycatUrl = i.options.getString('gfycat_url') as string
  const gfycatUrlId = formatGfycatUrl(gfycatUrl)

  const axiosResponse = await axios
    .get(`https://api.gfycat.com/v1/gfycats/${gfycatUrlId}`)
    .then(res => res.data)
    .catch(e => log('ERROR', e))
  log('LOG', axiosResponse)

  await i.editReply(`${titulo}, ${descripcion}, ${gfycatUrl}`)
}
