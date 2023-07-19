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
const cancelButton = new ButtonBuilder()

buttonWithCustomIdValidation<ConfirmButtonsCustomIdOptions>({
    style: ButtonStyle.Primary,
    customId: 'confirm',
    button: confirmButton,
    emoji: '✅'
})

buttonWithCustomIdValidation<ConfirmButtonsCustomIdOptions>({
    style: ButtonStyle.Secondary,
    customId: 'cancel',
    button: cancelButton,
    emoji: '❌'
})

export const confirmButtonRow = new ActionRowBuilder().addComponents(
    confirmButton,
    cancelButton
) as unknown as ActionRow<MessageActionRowComponent>
