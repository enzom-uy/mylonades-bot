import { chalkHt, MessageTypes } from './chalk'

export const log = (level: MessageTypes, ...params: any): void => {
  switch (level) {
    case 'ERROR':
      console.error(chalkHt('ERROR'), ...params)
      break
    case 'INFO':
      console.info(chalkHt('INFO'), ...params)
      break
    case 'WARNING':
      console.warn(chalkHt('WARNING'), ...params)
      break
    case 'SUCCESS':
      console.warn(chalkHt('SUCCESS'), ...params)
      break
    default:
      console.log(chalkHt('LOG'), ...params)
      break
  }
}
