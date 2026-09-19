export interface PageResult<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}
