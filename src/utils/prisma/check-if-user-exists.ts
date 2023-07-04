import { User } from '@prisma/client'

import { prisma } from '../../config/database'

export const checkIfUserExist = async ({ userId }: { userId: string }): Promise<User | null> => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })
    return user
}
