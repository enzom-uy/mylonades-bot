import axios from 'axios'

import { GetGfyInfoResponse } from '../../types/commands/new'
import { log } from '../log'

export const getGfycat = async (id: string): Promise<GetGfyInfoResponse> => {
  const axiosResponse: GetGfyInfoResponse = await axios
    .get(`https://api.gfycat.com/v1/gfycats/${id}`)
    .then(res => {
      return res.data
    })
    .catch(e => log('ERROR', e))
  log('SUCCESS', axiosResponse.gfyItem)
  return axiosResponse
}
