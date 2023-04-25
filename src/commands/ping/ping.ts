import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong.'),
  execute: async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!')
  }
}
