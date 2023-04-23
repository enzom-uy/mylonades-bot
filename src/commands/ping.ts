import { Interaction, SlashCommandBuilder } from 'discord.js'

export const pingPongCmd = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong.'),
  execute: async function execute(interaction: any) {
    await interaction.reply('Pong!')
  }
}
