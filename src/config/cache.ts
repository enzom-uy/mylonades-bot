import NodeCache from 'node-cache'

import { prisma } from './database'
import { log } from '../utils/log'

export const myCache = new NodeCache()
export const loadMapsFromDb = async (): Promise<void> => {
    const mapsFromDb = await prisma.map.findMany()
    const nadeTypesFromDb = await prisma.nadeType.findMany()
    if (mapsFromDb.length > 0 && nadeTypesFromDb.length > 0) {
        myCache.set(
            'maps',
            mapsFromDb.map(map => ({ name: map.name, value: map.name }))
        )
        myCache.set(
            'nadeTypes',
            nadeTypesFromDb.map(type => ({ name: type.name, value: type.name }))
        )
        log('SUCCESS', 'Loaded maps.')

        return
    } else {
        log('ERROR', 'Something went wrong while trying to retrieve maps and nade types data.')
        throw new Error()
    }
}
