import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

const options = [
  {
    title: 'Title',
    description: 'A title for the nade, e.g: "Humo TT a Jungla."'
  }
]

export const data = new SlashCommandBuilder()
  .setName('new')
  .setDescription('Upload a new nade.')
  .addStringOption(option =>
    option
      .setName('Title')
      .setDescription('A title for the nade, e.g: "Humo TT a Jungla."')
      .setRequired(true)
  )

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
  return
}
