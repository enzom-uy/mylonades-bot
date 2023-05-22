export const getPaginatedData = <T>(pageNumber: number, pageSize: number, data: T[]): T[] => {
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
}
