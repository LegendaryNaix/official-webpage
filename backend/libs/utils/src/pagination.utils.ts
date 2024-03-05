/**
 * Offset Based Pagination
 */
export const calculatePaginationOffset = (page: number, limit: number) => {
  return (page - 1) * limit
}
