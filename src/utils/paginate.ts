export const getPaginatedData = <T>({
    pageNumber,
    pageSize,
    data
}: {
    pageNumber: number
    pageSize: number
    data: T[]
}): { currentNades: T[]; endIndex: number; totalPages: number } => {
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentNades = data.slice(startIndex, endIndex)
    const totalPages = Math.ceil(data.length / pageSize)
    return { currentNades, endIndex, totalPages }
}
