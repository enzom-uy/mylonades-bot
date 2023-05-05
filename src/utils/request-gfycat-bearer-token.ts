import axios, { AxiosError } from 'axios'

import { log } from './log'
import { GFYCAT_CLIENT_ID, GFYCAT_SECRET } from '../config/envs'
import { AxiosGfycatRequestToken } from '../types/axios'

const data = {
  client_id: GFYCAT_CLIENT_ID,
  client_secret: GFYCAT_SECRET,
  grant_type: 'client_credentials'
}

const URL = 'https://api.gfycat.com/v1/oauth/token'
export const requestBearerToken = async (): Promise<void | AxiosGfycatRequestToken> => {
  log('INFO', 'Requesting Bearer Token to Gfycat API...')
  const response = await axios
    .post(URL, data)
    .then(res => {
      log('SUCCESS', 'Bearer Token requested succesfully.')
      return res.data as AxiosGfycatRequestToken
    })
    .catch((err: AxiosError) => {
      if (err.response) {
        log('ERROR', 'Error data:', err.response)
        log('ERROR', 'Error status:', err.response.status)
        log('ERROR', 'Error headers:', err.response.headers)
        log('ERROR', 'Error Message:', err.message)
      }
    })
  return response
}
