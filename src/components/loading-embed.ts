import { EmbedBuilder } from 'discord.js'

import { embedColor } from '../utils/bot/embeds'

export const loadingEmbedComponent = (text: string): EmbedBuilder => {
    return new EmbedBuilder().setColor(embedColor).setTitle(text)
}
