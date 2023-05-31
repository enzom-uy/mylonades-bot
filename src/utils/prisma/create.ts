import { Nade } from '@prisma/client'
import { User } from 'discord.js'

import { NadeWithAuthorAndMap } from './find'
import { prisma } from '../../config/database'

interface Args {
    videoUrl: string
    title: string
    description?: string | null
    user: User
    map: string
    nadeType: string
}

export const prismaCreateNade = async ({
    description,
    videoUrl,
    user,
    title,
    map,
    nadeType
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
            author: {
                connectOrCreate: {
                    where: {
                        discord_tag: user.tag
                    },
                    create: {
                        discord_tag: user.tag,
                        name: user.username
                    }
                }
            },
            video_url: videoUrl,
            map: {
                connect: {
                    name: map
                }
            },
            nadeType: {
                connect: {
                    name: nadeType
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
