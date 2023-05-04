import dotenv from 'dotenv'
dotenv.config()

export const BOT_TOKEN = process.env.BOT_TOKEN as string
export const APP_ID = process.env.APP_ID as string
export const GUILD_ID = process.env.GUILD_ID as string
export const GFYCAT_SECRET = process.env.GFYCAT_SECRET as string
export const GFYCAT_CLIENT_ID = process.env.GFYCAT_CLIENT_ID as string
