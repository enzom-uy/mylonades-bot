import { APIApplicationCommandOptionChoice, ChatInputCommandInteraction } from 'discord.js'

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

export interface MapsFromCache extends APIApplicationCommandOptionChoice {
  name: string
  value: string
}
