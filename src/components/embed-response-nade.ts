/* eslint-disable import/order */
import { EmbedBuilder } from 'discord.js'
import { embedColor } from '../utils/bot/embeds'
import { NadeWithAuthorAndMap } from '../utils/prisma/find'
import { log } from '../utils/log'

export const embedResponseNadeComponent = (nade: NadeWithAuthorAndMap): EmbedBuilder => {
    log('INFO', nade)
    return new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(nade.title)
        .addFields(
            { name: 'Título', value: nade.title, inline: true },
            { name: 'Mapa', value: nade.map.name, inline: true },
            { name: 'Tipo', value: nade.nade_type_name, inline: true },
            { name: 'Autor', value: nade.author.name, inline: true }
        )
}
