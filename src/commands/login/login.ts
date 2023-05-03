import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { prisma } from '../../config/database'

export const data = new SlashCommandBuilder()
  .setName('login')
  .setDescription('Authenticate to the bot with your Discord account.')

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
  const userWithTag = i.user.tag

  if (userWithTag) {
    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        discord_tag: userWithTag
      }
    })

    if (userAlreadyExists) return

    const userCreated = await prisma.user.create({
      data: {
        name: i.user.username,
        discord_tag: userWithTag
      }
    })

    if (userCreated) {
      await i.reply('You are now registered in the database.')
      return
    } else {
      await i.reply('Something went wrong. Please try again or contact the bot author.')
    }
  }
}
