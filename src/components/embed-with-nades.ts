import { Nade } from '@prisma/client'
import { EmbedBuilder } from 'discord.js'

import { NadeWithAuthorAndMap } from '../utils/prisma/find'

export const embedWithNadesComponent = ({
    title,
    author,
    nades
}: {
    title: string
    author: string
    nades: NadeWithAuthorAndMap[] | Nade[]
}): EmbedBuilder => {
    return new EmbedBuilder()
        .setTitle(title)
        .setAuthor({ name: author })
        .addFields(nades.map(nade => ({ name: nade.title, value: nade.video_url })))
        .setTimestamp()
}
