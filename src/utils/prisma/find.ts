import { Nade, User } from '@prisma/client'

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
    map,
    nadeType,
    serverId
}: {
    query?: string | null
    map?: string | null
    nadeType?: string | null
    serverId: string
}): Promise<{ nades: NadeWithAuthorAndMap[] }> => {
    const nades = await prisma.nade.findMany({
        where: {
            server_id: serverId,
            OR: [
                {
                    title: query ? { contains: query } : undefined
                },
                {
                    description: query ? { contains: query } : null
                }
            ],
            map: map ? { name: map } : undefined,
            nade_type_name: nadeType ? nadeType : undefined
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

// Users
export const getUsersRanking = async (): Promise<{ topUsers: User[] }> => {
    const topUsers = await prisma.user.findMany({
        orderBy: {
            nades: {
                _count: 'desc'
            }
        }
    })

    return { topUsers }
}
