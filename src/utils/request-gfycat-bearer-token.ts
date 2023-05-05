import axios, { AxiosError } from 'axios'

import { GFYCAT_CLIENT_ID, GFYCAT_SECRET } from '../config/envs'
import { AxiosGfycatRequestToken } from '../types/axios'

const data = {
  client_id: GFYCAT_CLIENT_ID,
  client_secret: GFYCAT_SECRET,
  grant_type: 'client_credentials'
}

const URL = 'https://api.gfycat.com/v1/oauth/token'
export const requestBearerToken = async (): Promise<void | AxiosGfycatRequestToken> => {
  console.log('Requesting Bearer Token to Gfycat API...')
  const response = await axios
    .post(URL, data)
    .then(res => {
      console.log('Bearer Token requested succesfully.')
      return res.data as AxiosGfycatRequestToken
    })
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
