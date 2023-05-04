import { requestBearerTokenResponse } from './request-gfycat-bearer-token'

const API_URL = 'https://api.gfycat.com/v1/gfycats'

export const uploadToGfycat = async (_url: string): Promise<any> => {
  const bearer = await requestBearerTokenResponse()
  if (!bearer) {
    return console.error('An error ocurred while requesting for a Bearer Token to Gfycat.')
  }
  return
}
