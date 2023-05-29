import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageActionRowComponent
} from 'discord.js'

const confirmButton = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('Continuar')
    .setStyle(ButtonStyle.Primary)

const cancelButton = new ButtonBuilder()
    .setCustomId('cancel')
    .setLabel('Cancelar')
    .setStyle(ButtonStyle.Secondary)
export const confirmButtonRow = new ActionRowBuilder().addComponents(
    confirmButton,
    cancelButton
) as unknown as ActionRow<MessageActionRowComponent>
