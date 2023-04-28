import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Frequency } from "../utils/request-frequency.enum";

export interface LazyDataTableProps {
  isActive: {
    operator: FilterOperator;
    constraints: {
      value: string;
      matchMode: FilterMatchMode;
    }[];
  };
}

export interface Request {
  createdAt: any;
  frequency: Frequency;
  id: string;
  isAvailable: boolean | undefined;
  name: string | null | undefined;
  statusCode: number | null | undefined;
  url: string;
}

export interface LazyTableState {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: 1 | 0 | -1 | null | undefined;
  filters: Filter[];
}

export interface Filter {
  field: string;
  operator: FilterOperator;
  constraints: FilterConstraint[];
}

export interface FilterConstraint {
  value: string;
  matchMode: FilterMatchMode;
}
