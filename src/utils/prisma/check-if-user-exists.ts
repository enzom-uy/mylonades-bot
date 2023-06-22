import { User } from '@prisma/client'

import { prisma } from '../../config/database'

export const checkIfuserExists = async ({
    userId
}: {
    userId: string
}): Promise<User | undefined> => {
    const user = await prisma.user.findFirst({
        where: {
            accounts: {
                every: {
                    providerAccountId: userId
                }
            }
        }
    })
    if (!user) return undefined
    return user
}
