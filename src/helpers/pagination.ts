/**
 * Pagination parameters for queries
 */
export interface IPaginationParams {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Pagination result metadata
 */
export interface IPaginationResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Calculates skip value for MongoDB queries
 * @param page - Current page (1-indexed)
 * @param perPage - Items per page
 * @returns Number of documents to skip
 */
export function calculateSkip(page: number = 1, perPage: number = 20): number {
  return Math.max(0, page - 1) * perPage
}

/**
 * Builds complete pagination metadata
 * @param items - Array of items for current page
 * @param total - Total count of documents
 * @param page - Current page
 * @param perPage - Items per page
 */
export function buildPaginationResult<T>(
  items: T[],
  total: number,
  page: number,
  perPage: number
): IPaginationResult<T> {
  const totalPages = Math.ceil(total / perPage)

  return {
    items,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

/**
 * Validates and normalizes pagination parameters
 * @param params - Raw pagination parameters
 * @returns Normalized safe parameters
 */
export function normalizePaginationParams(params: IPaginationParams) {
  const page = Math.max(1, params.page || 1)
  const perPage = Math.min(100, Math.max(1, params.perPage || 20)) // Max 100 items

  return {
    page,
    perPage,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder || ('asc' as const),
  }
}
