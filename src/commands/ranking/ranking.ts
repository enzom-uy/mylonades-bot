import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import { embedColor } from '../../utils/bot/embeds'
import { getUsersRanking } from '../../utils/prisma/find'

export const data = new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Muestra el ranking de usuarios con más granadas creadas.')

export const execute = async (i: ChatInputCommandInteraction): Promise<any> => {
    await i.deferReply()
    const { topUsers } = await getUsersRanking()
    const onlyTopFive = topUsers.slice(0, 5)
    const isUserInTopFive = onlyTopFive.filter(user => user.discord_tag === i.user.tag)
    const userIsNotInTopFive = isUserInTopFive.length === 0

    const rankedNames = onlyTopFive.map((name, index) => `${index + 1}. ${name.name}`)

    const embed = new EmbedBuilder()
        .setTitle('Ranking de usuarios')
        .setColor(embedColor)
        .setDescription('Usuarios que más granadas han aportado a Mylo.')
        .addFields(rankedNames.map((name, _index) => ({ name: ' ', value: name })))
        .setTimestamp()

    if (userIsNotInTopFive) {
        const userPositionInRanking = topUsers.findIndex(user => user.discord_tag === i.user.tag)
        embed.addFields({ name: '\u200B', value: '\u200B' })
        embed.addFields({ name: 'Tu posición', value: `${userPositionInRanking}`, inline: true })
    }

    await i.followUp({
        embeds: [embed]
    })
    return
}
