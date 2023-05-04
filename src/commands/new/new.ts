import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import fetch from 'node-fetch'
import fs, { rmdir } from 'node:fs'
import path from 'node:path'

interface StringOptions {
  title: string
  description: string
  required: boolean
}

const stringOptions: StringOptions[] = [
  {
    title: 'title',
    description: 'A title for the nade, e.g: "Humo TT a Jungla."',
    required: true
  },
  {
    title: 'description',
    description:
      'A description for the nade, e.g: "Humo jumpthrow desde base TT para tapar jungla en A."',
    required: false
  }
]

export const data = new SlashCommandBuilder().setName('new').setDescription('Upload a new nade.')
data.addAttachmentOption(option =>
  option
    .setName('video')
    .setDescription(
      'Video showing the nade (25mb max for non-nitro users. Use 8mb.video for compressing.).'
    )
    .setRequired(true)
)
stringOptions.forEach(option => {
  data.addStringOption(opt =>
    opt.setName(option.title).setDescription(option.description).setRequired(option.required)
  )
})

export const execute = async (i: ChatInputCommandInteraction): Promise<void> => {
  const path = 'videos'
  const attachment = i.options.getAttachment('video')
  if (attachment) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    const savedAtch = await fetch(attachment.url).then(res =>
      res.body?.pipe(fs.createWriteStream(`./videos/${attachment.name}`))
    )
    console.log(savedAtch)

    await i.reply(attachment ? attachment.url : 'Something went wrong.')

    fs.rmSync(`${path}/${attachment.name}`)
    fs.rmdirSync(path)
  }
}
