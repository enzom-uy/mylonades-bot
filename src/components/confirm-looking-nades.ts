import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageActionRowComponent
} from 'discord.js'

import { buttonWithCustomIdValidation } from './pagination-arrows'

export type ConfirmButtonsCustomIdOptions = 'cancel' | 'confirm'

const confirmButton = new ButtonBuilder()

buttonWithCustomIdValidation<ConfirmButtonsCustomIdOptions>({
    style: ButtonStyle.Primary,
    customId: 'confirm',
    button: confirmButton
})
const cancelButton = new ButtonBuilder()

buttonWithCustomIdValidation<ConfirmButtonsCustomIdOptions>({
    style: ButtonStyle.Secondary,
    customId: 'cancel',
    button: cancelButton
})
export const confirmButtonRow = new ActionRowBuilder().addComponents(
    confirmButton,
    cancelButton
) as unknown as ActionRow<MessageActionRowComponent>
