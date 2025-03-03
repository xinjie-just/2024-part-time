export interface IBaseResponse<T> {
  code: number | string;
  msg?: string;
  message?: string;
  errorMsg?: string;
  data: T;
}
