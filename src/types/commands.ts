import { ChatInputCommandInteraction } from 'discord.js'

export type CommandData = {
    name: string
    spanishName: string
    description: string
    spanishDescription: string
}

export type Data = {
    options: []
    name: string
    name_localizations: undefined
    description: string
    description_localizations: string | undefined
    default_permission: any
    default_member_permissions: any
    dm_permission: any
    nsfw: any
}

export type Execute = (i: ChatInputCommandInteraction) => any

export type Command = {
    data: Data
    execute: Execute
}

export interface MapsFromCache {
    name: string
    value: string
}

export interface NadeTypesFromCache {
    name: string
    value: string
}
