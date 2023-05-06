import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
/* import fetch from 'node-fetch' */
/* import fs from 'node:fs' */

import { log } from '../../utils/log'

interface StringOptions {
  title: string
  description: string
  required: boolean
}

const stringOptions: StringOptions[] = [
  {
    title: 'title',
    description: 'A title for the nade, e.g: "Humo TT a Jungla."',
    required: true
  },
  {
    title: 'description',
    description:
      'A description for the nade, e.g: "Humo jumpthrow desde base TT para tapar jungla en A."',
    required: false
  }
]

export const data = new SlashCommandBuilder().setName('new').setDescription('Upload a new nade.')
stringOptions.forEach(option => {
  data.addStringOption(opt =>
    opt.setName(option.title).setDescription(option.description).setRequired(option.required)
  )
})

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {}
