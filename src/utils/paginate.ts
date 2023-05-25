export const getPaginatedData = <T>(
    pageNumber: number,
    pageSize: number,
    data: T[]
): { currentNades: T[]; endIndex: number } => {
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentNades = data.slice(startIndex, endIndex)
    return { currentNades, endIndex }
}
