import NodeCache from 'node-cache'

import { prisma } from './database'
import { log } from '../utils/log'

export const myCache = new NodeCache()
export const loadMapsFromDb = async (): Promise<void> => {
  const mapsFromDb = await prisma.map.findMany()
  if (mapsFromDb.length > 0) {
    myCache.set(
      'maps',
      mapsFromDb.map(map => ({ name: map.name, value: map.name }))
    )
    log('LOG', myCache.get('maps'))
    log('SUCCESS', 'Loaded maps.')
    return
  } else {
    log('ERROR', 'Something went wrong while trying to retrieve all maps.')
    throw new Error()
  }
}
