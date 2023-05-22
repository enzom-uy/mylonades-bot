import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js'

import { myCache } from '../../config/cache'
import { MapsFromCache, NadeTypesFromCache } from '../../types/commands'
import { log } from '../../utils/log'
import { getNades } from '../../utils/prisma/find'

export const data = new SlashCommandBuilder()
    .setName('buscar')
    .setDescription('Busca una granada en base a ciertas preferencias.')

data.addStringOption(option =>
    option
        .setName('query')
        .setDescription(
            'Texto relacionado a la granada. Puede ser una parte del título o descripción.'
        )
)
data.addStringOption(o =>
    o.setName('mapa').setDescription('Nombre del mapa.').setAutocomplete(true)
)
data.addStringOption(o =>
    o.setName('tipo').setDescription('Tipo de la granada.').setAutocomplete(true)
)

export const autocomplete = async (i: AutocompleteInteraction): Promise<void> => {
    const focusedOption = i.options.getFocused(true)
    let choices

    if (focusedOption.name === 'mapa') {
        const mapsFromCache = myCache.get('maps') as MapsFromCache[]
        choices = mapsFromCache.map(map => map.name)
    }

    if (focusedOption.name === 'tipo') {
        const nadeTypesFromCache = myCache.get('nadeTypes') as NadeTypesFromCache[]
        choices = nadeTypesFromCache.map(type => type.name)
    }
    const filtered = choices?.filter(choice =>
        choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
    )
    if (filtered) await i.respond(filtered.map(choice => ({ name: choice, value: choice })))
}

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
    await i.deferReply()
    const query = i.options.getString('query')
    const map = i.options.getString('mapa')
    const nadeType = i.options.getString('tipo')

    const { nades } = await getNades({ query, map, nadeType })
    log('INFO', nades)
    const embedWithNades = new EmbedBuilder()
        .setTitle('Granadas encontradas')
        .setAuthor({ name: 'Mylo' })
        .addFields(nades.map(nade => ({ name: nade.title, value: nade.video_url })))
        .setTimestamp()
    await i.followUp({ embeds: [embedWithNades] })

    return
}
