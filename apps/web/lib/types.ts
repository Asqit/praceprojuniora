export interface Pagination<T> {
  data: Array<T>
  nextCursor?: number | null
  totalRows?: number;
}
