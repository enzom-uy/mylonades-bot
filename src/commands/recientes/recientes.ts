import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { prisma } from '../../config/database'

export const data = new SlashCommandBuilder()
  .setName('recientes')
  .setDescription('Muestra las últimas 5 granadas que se crearon.')

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
  await i.deferReply()

  const lastFiveNades = await prisma.nade.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    where: {
      status: 'APPROVED'
    }
  })

  if (lastFiveNades.length === 0) {
    await i.editReply('Todavía no se ha creado ninguna granada.')
    return
  }

  await i.editReply({
    content: 'Aquí están las últimas 5 granadas.',
    files: [lastFiveNades[0].video_url]
  })
  return
}
