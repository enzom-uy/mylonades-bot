import axios, { AxiosError } from 'axios'

import { GFYCAT_CLIENT_ID, GFYCAT_SECRET } from '../config/envs'
import { AxiosGfycatRequestToken } from '../types/axios'

const data = {
  client_id: GFYCAT_CLIENT_ID,
  client_secret: GFYCAT_SECRET,
  grant_type: 'client_credentials'
}
export const requestBearerTokenResponse = async (): Promise<void | AxiosGfycatRequestToken> => {
  const response = await axios
    .post('https://api.gfycat.com/v1/oauth/token', data)
    .then(res => res.data as AxiosGfycatRequestToken)
    .catch((err: AxiosError) => {
      if (err.response) {
        console.log('Error data:', err.response)
        console.log('Error status:', err.response.status)
        console.log('Error headers:', err.response.headers)
        console.log('Error Message:', err.message)
      }
    })
  return response
}
