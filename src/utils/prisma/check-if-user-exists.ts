import { User } from '@prisma/client'

import { prisma } from '../../config/database'

export const checkIfUserExist = async ({
    userId
}: {
    userId: string
}): Promise<User | undefined> => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })
    if (!user) return undefined
    return user
}
