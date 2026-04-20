export interface Pagination<T> {
  data: Array<T>
  page: number
  totalPages: number
  totalRows: number
}
