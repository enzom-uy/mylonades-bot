import { Nade } from '@prisma/client'

import { prisma } from '../../config/database'

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
