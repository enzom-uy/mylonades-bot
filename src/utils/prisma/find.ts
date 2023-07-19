import { Nade } from '@prisma/client'

import { prisma } from '../../config/database'
import { log } from '../log'

// Nades

export interface NadeWithAuthorAndMap extends Nade {
    author: {
        name: string
    }
    map: {
        name: string
    }
}

export const getLastFiveNades = async ({
    serverId
}: {
    serverId: string
}): Promise<{ lastFiveNades: NadeWithAuthorAndMap[] }> => {
    const lastFiveNades = await prisma.nade.findMany({
        orderBy: {
            created_at: 'desc'
        },
        take: 5,
        where: {
            status: 'APPROVED',
            server_id: serverId
        },
        include: {
            map: {
                select: {
                    name: true
                }
            },
            author: {
                select: {
                    name: true
                }
            }
        }
    })
    log('INFO', lastFiveNades)
    return { lastFiveNades }
}

export const getNades = async ({
    query,
    serverId
}: {
    query?: string | null
    serverId: string
}): Promise<{ nades: NadeWithAuthorAndMap[] }> => {
    const nades = await prisma.nade.findMany({
        where: {
            server_id: serverId,
            OR: query ? [
                {
                    title: query ? { contains: query } : undefined
                },
                {
                    description: query ? { contains: query } : null
                },
                {
                    author: {
                        name: query ? { contains: query } : undefined
                    }
                },
                {
                    map_name: query ? { contains: query } : undefined
                },
                {
                    nade_type_name: query ? { contains: query } : undefined
                }
            ] : undefined,
            status: 'APPROVED'
        },
        include: {
            author: {
                select: {
                    name: true
                }
            },
            map: {
                select: {
                    name: true
                }
            }
        }
    })

    return { nades }
}
