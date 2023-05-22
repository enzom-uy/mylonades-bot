import { AutocompleteInteraction } from 'discord.js'

import { myCache } from '../../config/cache'
import { MapsFromCache, NadeTypesFromCache } from '../../types/commands'

export const handleMapAndNadeTypeAutocomplete = async (
    i: AutocompleteInteraction
): Promise<void> => {
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
