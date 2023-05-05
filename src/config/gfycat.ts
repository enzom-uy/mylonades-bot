import { prisma } from './database'
import { log } from '../utils/log'
import { requestBearerToken } from '../utils/request-gfycat-bearer-token'

const getExpirationDate = (expiresInSeconds: bigint): string => {
  const now = new Date()
  const expirationDate = new Date(now.getTime() + Number(expiresInSeconds) * 1000)
  return expirationDate.toISOString().slice(0, 19).replace('T', ' ')
}

const generateAndStoreBearerToken = async (): Promise<void> => {
  const bearerAlreadyExists = await prisma.accessToken.findMany()

  // TODO: Check for expiration date and refresh it if needed.
  if (bearerAlreadyExists.length > 1) {
    log('WARNING', 'There was more than 1 access token. Deleting all of them.')
    await prisma.accessToken.deleteMany()
    return
  }
  if (bearerAlreadyExists.length === 1) {
    log('INFO', 'A Bearer Token already exists. Skipping it creation.')
    log('LOG', 'Checking expiration date...')

    const expirationDate = bearerAlreadyExists.map(token => new Date(Number(token.expiration)))[0]
    const currentDate = new Date()
    log('LOG', 'Current date:', currentDate)
    log('LOG', 'Expiration date:', expirationDate)

    if (currentDate > expirationDate) {
      log('INFO', 'The Bearer Token has expired. Requesting a refresh token...')
    } else {
      log('INFO', 'The Bearer Token is still valid.')
      return
    }

    log(
      'LOG',
      bearerAlreadyExists.map(token => token)
    )
    return
  }

  const bearerTokenResponse = await requestBearerToken()
  if (!bearerTokenResponse)
    return log('ERROR', 'Something went wrong while trying to request a Bearer Token from Gfycat.')

  const uploadedToken = await prisma.accessToken.create({
    data: {
      token: bearerTokenResponse.access_token,
      expiration: Date.parse(getExpirationDate(BigInt(bearerTokenResponse.expires_in)))
    }
  })

  if (!uploadedToken)
    return log('ERROR', 'An error ocurred while trying to upload the Bearer Token to the database.')

  log('INFO', 'A Bearer Token was uploaded to the database:', uploadedToken)
}

generateAndStoreBearerToken()
