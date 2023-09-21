import { Pagination } from "./Pagination";

export class DataWithPagination<T> {
  data: T[] = [];
  pagination = new Pagination();
  seo: { [key: string]: string } = {};
}
