import { Nade } from '@prisma/client'

import { prisma } from '../../config/database'

interface Args {
  videoUrl: string
  title: string
  description?: string | null
  userDiscordTag: string
  map: string
  nadeType: string
}

export const prismaCreateNade = async ({
  description,
  videoUrl,
  userDiscordTag,
  title,
  map,
  nadeType
}: Args): Promise<Nade> => {
  const newNade = await prisma.nade.create({
    data: {
      title: title,
      description: description ? description : null,
      status: 'PENDING',
      author: {
        connect: {
          discord_tag: userDiscordTag
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
  return newNade
}
