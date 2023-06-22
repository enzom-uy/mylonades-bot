import { Nade } from '@prisma/client'

import { NadeWithAuthorAndMap } from './find'
import { prisma } from '../../config/database'

interface Args {
    videoUrl: string
    title: string
    description?: string | null
    map: string
    nadeType: string
    userId: string
    serverId: string
}

export const prismaCreateNade = async ({
    description,
    videoUrl,
    title,
    map,
    nadeType,
    userId,
    serverId
}: Args): Promise<
    | { message: string; exists: Nade[]; newNade?: undefined }
    | { newNade: NadeWithAuthorAndMap; message?: undefined; exists?: undefined }
> => {
    const filename = videoUrl.split('/').slice(-1)[0]
    const exists = await prisma.nade.findMany({
        where: {
            video_url: {
                contains: filename
            }
        }
    })
    if (exists.length > 0) {
        const message = 'Ya hay una granada registrada con el mismo nombre de archivo.'
        return { message, exists }
    }
    const newNade = await prisma.nade.create({
        data: {
            title: title,
            description: description ? description : null,
            status: 'PENDING',
            video_url: videoUrl,
            map: {
                connect: {
                    name: map
                }
            },
            nade_type: {
                connect: {
                    name: nadeType
                }
            },
            author: {
                connect: {
                    id: userId
                }
            },
            Server: {
                connect: {
                    id: serverId
                }
            }
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
    return { newNade }
}
