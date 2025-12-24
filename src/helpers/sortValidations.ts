/**
 * Creates a type-safe sort validator for MongoDB queries.
 * @param allowedFields - Array of field names allowed for sorting
 * @returns Type guard function and the allowed fields type
 */
export function createSortValidator<T extends readonly string[]>(allowedFields: T) {
  type AllowedField = T[number]

  const isAllowedField = (field: string): field is AllowedField => {
    return allowedFields.includes(field as AllowedField)
  }

  return {
    allowedFields,
    isAllowedField,
  }
}

/**
 * Builds MongoDB sort criteria with validation.
 * @param sortBy - Field to sort by (will be validated)
 * @param sortOrder - Sort direction
 * @param isAllowedField - Type guard function
 * @param defaultField - Fallback field if sortBy is invalid
 */
export function buildSortCriteria<T extends string>(
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc',
  isAllowedField: (field: string) => field is T,
  defaultField: T
): Record<string, 1 | -1> {
  const validSortField = sortBy && isAllowedField(sortBy) ? sortBy : defaultField
  const sortDirection: 1 | -1 = sortOrder === 'desc' ? -1 : 1
  return { [validSortField]: sortDirection }
}
