export interface IPaginationOptions {
  page?: string
  perPage?: string
}
export interface IPaginationResult<T> {
  items: T[]
  total: number
}
