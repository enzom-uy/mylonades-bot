import { Nade } from '@prisma/client'
import {
    ActionRow,
    ActionRowBuilder,
    MessageActionRowComponent,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js'

import { NadeWithAuthorAndMap } from '../utils/prisma/find'

export const selectNadeMenuComponent = (
    nades: NadeWithAuthorAndMap[] | Nade[]
): { row: ActionRow<MessageActionRowComponent> } => {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder('Elige la granada...')
        .addOptions(
            nades.map(nade =>
                new StringSelectMenuOptionBuilder().setLabel(nade.title).setValue(nade.title)
            )
        )
    const row = new ActionRowBuilder().addComponents(
        selectMenu
    ) as unknown as ActionRow<MessageActionRowComponent>

    return { row }
}
