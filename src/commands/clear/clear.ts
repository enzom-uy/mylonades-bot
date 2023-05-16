import {
    ChatInputCommandInteraction,
    Collection,
    Message,
    PartialMessage,
    SlashCommandBuilder,
    TextChannel
} from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Borra x cantidad de mensajes.')
    .addStringOption(o =>
        o.setName('cantidad').setDescription('Cantidad de mensajes a borrar.').setRequired(true)
    )

export const execute = async (
    i: ChatInputCommandInteraction
): Promise<Collection<string, PartialMessage | Message<boolean> | undefined> | undefined> => {
    await i.deferReply()
    const messagesToDelete = i.options.getString('cantidad')
    const channel = i.channel
    if (channel instanceof TextChannel) {
        return await channel.bulkDelete(Number(messagesToDelete))
    }
}
