import axios, { AxiosError } from 'axios'
import querystring from 'node:querystring'

import { GFYCAT_CLIENT_ID, GFYCAT_SECRET } from '../config/envs'

const _API_URL = 'https://api.gfycat.com/v1/gfycats'

export const uploadToGfycat = async (_url: string): Promise<any> => {
  const data = {
    client_id: GFYCAT_CLIENT_ID,
    client_secret: GFYCAT_SECRET,
    grant_type: 'client_credentials'
  }
  console.log(querystring.stringify(data))
  const bearerTokenResponse = await axios
    .post('https://api.gfycat.com/v1/oauth/token', {
      client_id: GFYCAT_CLIENT_ID,
      client_secret: GFYCAT_SECRET,
      grant_type: 'client_credentials'
    })
    .then(res => console.log(res.data))
    .catch((err: AxiosError) => {
      if (err.response) {
        console.log('Error data:', err.response)
        console.log('Error status:', err.response.status)
        console.log('Error headers:', err.response.headers)
        console.log('Error Message:', err.message)
      }
    })
  console.log(bearerTokenResponse)
  /* const axiosResponse = await axios */
  /*   .post( */
  /*     API_URL, */
  /*     { */
  /*       fetchUrl: url */
  /*     }, */
  /*     { */
  /*       headers: { */
  /*         Authorization: `Bearer ${GFYCAT_SECRET}` */
  /*       } */
  /*     } */
  /*   ) */
  /*   .then(res => res.data) */
  /* console.log(axiosResponse) */
  return
}
