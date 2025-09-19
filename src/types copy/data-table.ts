import { PaginationState } from '@tanstack/react-table'
import { Option } from './form';

type PaginationParams = PaginationState
type SearchParam = {
  search: string
}

export type Filters =
  | {
  type: "min-max";
  id: string;
  label: string;
  defaultValue: [number | undefined, number | undefined];
}
  | {
  type: "select";
  id: string;
  label: string;
  options: Option[];
  defaultValue: string | number | undefined;
}
  | {
  type: "date";
  id: string;
  label: string;
  defaultValue: [string | undefined, string | undefined];
}
  | {
  type: "text" | "number";
  id: string;
  label: string;
  defaultValue: string | number | undefined;
  [key: string]: unknown;
};
export type SortParams = {
  sortBy: `${string}.${'asc' | 'desc'}`
}
export type TableAction = "view" | "edit" | "delete" | "evaluate"
export type ParamState = string | number | boolean | undefined
export type BaseParams = Partial<SearchParam & PaginationParams & SortParams>