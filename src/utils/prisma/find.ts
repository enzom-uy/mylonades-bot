import { Nade, User } from '@prisma/client'

import { prisma } from '../../config/database'

// Nades
export const getLastFiveNades = async (): Promise<{
    lastFiveNades: (Nade & {
        author: {
            name: string
        }
        map: {
            name: string
        }
    })[]
}> => {
    const lastFiveNades = await prisma.nade.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
        where: {
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

    return { lastFiveNades }
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
