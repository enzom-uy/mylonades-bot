import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentEmojiResolvable } from 'discord.js'

export type PaginationCustomIdOptions = 'left' | 'right' | 'confirmPage'

export const buttonWithCustomIdValidation = <T extends string>({
    button,
    customId,
    emoji,
    style,
    disabled
}: {
    button: ButtonBuilder
    customId: T
    emoji?: ComponentEmojiResolvable
    style: ButtonStyle
    disabled?: boolean
}): ButtonBuilder => {
    button
        .setCustomId(customId)
        .setStyle(style)
        .setDisabled(disabled ? disabled : false)
    if (emoji) {
        button.setEmoji(emoji)
    }
    return button
}

export const handlePaginationArrows = ({
    currentPage,
    endIndex
}: {
    currentPage: number
    endIndex: number
}): { paginationArrowsComponent: ActionRowBuilder } => {
    const leftArrowButton = new ButtonBuilder()
    buttonWithCustomIdValidation({
        button: leftArrowButton,
        customId: 'left',
        emoji: '⬅️',
        style: ButtonStyle.Secondary,
        disabled: currentPage <= 1 && true
    })
    const rightArrowButton = new ButtonBuilder()
    buttonWithCustomIdValidation({
        button: rightArrowButton,
        customId: 'right',
        emoji: '➡️',
        style: ButtonStyle.Secondary,
        disabled: currentPage === endIndex && true
    })
    const confirmPageButton = new ButtonBuilder()
    buttonWithCustomIdValidation({
        button: confirmPageButton,
        customId: 'confirmPage',
        emoji: '✅',
        style: ButtonStyle.Primary
    })

    const paginationArrowsComponent = new ActionRowBuilder().addComponents(
        leftArrowButton,
        rightArrowButton,
        confirmPageButton
    )

    return { paginationArrowsComponent }
}
