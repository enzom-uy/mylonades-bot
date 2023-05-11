import { Nade } from '@prisma/client'
import { User } from 'discord.js'

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
  | { newNade: Nade; message?: undefined; exists?: undefined }
> => {
  const exists = await prisma.nade.findMany({
    where: {
      video_url: videoUrl
    }
  })
  if (exists) {
    const message = 'Ya existe una granada con el mismo link.'
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
    }
  })
  return { newNade }
}
