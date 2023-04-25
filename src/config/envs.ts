import dotenv from 'dotenv'
dotenv.config()

export const BOT_TOKEN = process.env.BOT_TOKEN as string
export const APP_ID = process.env.APP_ID as string
export const GUILD_ID = process.env.GUILD_ID as string
