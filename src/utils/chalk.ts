import chalk from 'chalk'

export type MessageTypes = 'ERROR' | 'INFO' | 'LOG' | 'WARNING' | 'SUCCESS'

export const chalkInfo = (text?: string): string => {
  return chalk.bgBlue(`  ${text ? text : 'INFO'}  `)
}

export const chalkHt = (type: MessageTypes, text?: string): string => {
  switch (type) {
    case 'ERROR':
      return chalk.bgRed(`  ${text ? text : 'ERROR'}  `)
    case 'INFO':
      return chalk.bgCyan(`  ${text ? text : 'INFO'}  `)
    case 'LOG':
      return chalk.bgMagenta(`  ${text ? text : 'LOG'}  `)
    case 'WARNING':
      return chalk.bgYellow(`  ${text ? text : 'WARNING'}  `)
    case 'SUCCESS':
      return chalk.bgGreen(`  ${text ? text : 'SUCCESS'}  `)
  }
}
