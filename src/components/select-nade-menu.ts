import { Nade } from '@prisma/client'
import {
    ActionRow,
    ActionRowBuilder,
    LocaleString,
    MessageActionRowComponent,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js'

import { NadeWithAuthorAndMap } from '../utils/prisma/find'


export const selectNadeMenuComponent = (
    nades: NadeWithAuthorAndMap[] | Nade[],
    locale: LocaleString
): { row: ActionRow<MessageActionRowComponent> } => {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder(locale === 'es-ES' ? '¿Qué granada quieres ver?' : 'What nade do you want to see?')
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
