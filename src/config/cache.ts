import NodeCache from 'node-cache'

import { prisma } from './database'
import { log } from '../utils/log'

export const myCache = new NodeCache()

let maps: { name: string; value: string }[] = []

export const loadMapsFromDb = async (): Promise<void> => {
  const mapsFromDb = await prisma.map.findMany()
  log('LOG', maps)
  if (mapsFromDb.length > 0) {
    mapsFromDb.map(map => maps.push({ name: map.name, value: map.name }))
    log('SUCCESS', 'Loaded maps.')
    return
  } else {
    log('ERROR', 'Something went wrong while trying to retrieve all maps.')
    throw new Error()
  }
}

export { maps }
