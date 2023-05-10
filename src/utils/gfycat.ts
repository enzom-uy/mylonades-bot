export const formatGfycatUrl = (url: string): string => {
  const splittedString = url.split('/')
  const id = splittedString.slice(-1)
  return id[0]
}
