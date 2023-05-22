import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

const leftArrowButton = new ButtonBuilder()
    .setCustomId('left')
    .setEmoji('⬅️')
    .setStyle(ButtonStyle.Secondary)
const rightArrowButton = new ButtonBuilder()
    .setCustomId('right')
    .setEmoji('➡️')
    .setStyle(ButtonStyle.Secondary)

export const paginationArrowsComponent = (): ActionRowBuilder => {
    return new ActionRowBuilder().addComponents(leftArrowButton, rightArrowButton)
}
