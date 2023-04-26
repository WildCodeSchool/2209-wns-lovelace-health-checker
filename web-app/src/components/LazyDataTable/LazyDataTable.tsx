import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";

import styles from "./LazyDataTable.module.scss";
import { useNavigate } from "react-router-dom";
import {
  formatFrequency,
  Frequency,
  parseTimeString,
} from "../../utils/request-frequency.enum";
import { formatDateString } from "../../utils/date";
import { REQUESTS_ROUTE } from "../../routes";

interface DataTableProps {
  requests: Request[];
  loading: boolean;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  totalCount: number | undefined;
  refetch: (variables: any) => void;
}

interface Request {
  createdAt: string;
  frequency: Frequency;
  id: string;
  isAvailable: boolean;
  name: string | undefined;
  statusCode: number;
  url: string;
}

const LazyDataTable = (pageOfRequestSettingWithLastResult: DataTableProps) => {
  const getFrequencies = () => {
    const enumFrequencies = Object.values(Frequency).filter(
      (f) => typeof f === "number"
    );
    return enumFrequencies.map((n) => {
      return formatFrequency(+n);
    });
  };

  const [filters, setFilters] = useState<any>({});
  const [frequencies] = useState(getFrequencies());
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(
    null
  );

  getFrequencies();
  console.log(pageOfRequestSettingWithLastResult);

  const navigate = useNavigate();

  const initFilters = () => {
    setFilters({
      url: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      frequency: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
  };

  useEffect(() => {
    initFilters();
  }, []);

  const frequenciesFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <Dropdown
        value={selectedFrequency}
        options={frequencies}
        onChange={(e: DropdownChangeEvent) => {
          console.log(parseTimeString(e.value));
          options.filterCallback(parseTimeString(e.value), options.index);
          setSelectedFrequency(e.value);
        }}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  const nameBodyTemplate = (request: Request) => {
    if (!request.name) {
      return "-";
    }
    return <span title={request.name}>{request.name}</span>;
  };

  const createdAtBodyTemplate = (request: Request) => {
    if (!request.createdAt) {
      return "-";
    }
    return formatDateString(request.createdAt);
  };

  const isAvailableBodyTemplate = (request: Request) => {
    if (request.isAvailable === true) {
      return <i className={`bi bi-check-circle ${styles.available}`}></i>;
    }
    if (request.isAvailable === false) {
      return <i className={`bi bi-x-circle ${styles.notAvailable}`}></i>;
    } else return "-";
  };

  const frequencyBodyTemplate = (request: Request) => {
    if (!request.frequency) {
      return "-";
    }
    return formatFrequency(request.frequency);
  };

  const statusCodeBodyTemplate = (request: Request) => {
    if (!request.statusCode) {
      return "-";
    }
    return request.statusCode;
  };

  const urlBodyTemplate = (request: Request) => {
    if (!request.url) {
      return "-";
    }
    return <span title={request.url}>{request.url}</span>;
  };

  const iconBodyTemplate = (request: Request) => {
    return (
      <i
        className={`bi bi-gear ${styles.actions}`}
        onClick={() => navigate(`${REQUESTS_ROUTE}/${request.id}`)}></i>
    );
  };

  return (
    <>
      <DataTable
        value={pageOfRequestSettingWithLastResult.requests}
        loading={pageOfRequestSettingWithLastResult.loading}
        filterDisplay="menu"
        dataKey="id"
        lazy
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        totalRecords={pageOfRequestSettingWithLastResult.totalCount}
        // paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        // currentPageReportTemplate="{first} to {last} of {totalRecords}"
        onPage={(e: any) => {
          console.log(e);
          pageOfRequestSettingWithLastResult.setPageNumber(
            e.page ? e.page + 1 : 1
          );
          pageOfRequestSettingWithLastResult.refetch({
            pageNumber: pageOfRequestSettingWithLastResult.pageNumber,
          });
        }}
        className={`${styles.table}`}
        filters={filters}>
        <Column
          headerClassName={`${styles.header}`}
          bodyClassName={`text-center ${styles.primary}`}
          body={iconBodyTemplate}></Column>
        <Column
          field="url"
          header="URL"
          filter
          body={urlBodyTemplate}
          headerClassName={`${styles.header}`}
          bodyClassName={`${styles.primary} ${styles.hidden} ${styles.url}`}></Column>
        <Column
          field="name"
          header="Name"
          filter
          headerClassName={`${styles.header}`}
          body={nameBodyTemplate}
          bodyClassName={`${styles.primary} ${styles.hidden} ${styles.name}`}></Column>
        <Column
          field="frequency"
          header="Frequency"
          filter
          filterElement={frequenciesFilterTemplate}
          headerClassName={`${styles.header}`}
          body={frequencyBodyTemplate}
          bodyClassName={`text-center ${styles.primary}`}></Column>
        <Column
          field="createdAt"
          header="Last Result"
          headerClassName={`${styles.header}`}
          className={`${styles.createdAt}`}
          body={createdAtBodyTemplate}
          bodyClassName={`text-center ${styles.primary} ${styles.hidden} ${styles.createdAt}`}></Column>
        <Column
          field="isAvailable"
          header="Availability"
          headerClassName={`${styles.header}`}
          body={isAvailableBodyTemplate}
          bodyClassName="text-center"></Column>
        <Column
          field="statusCode"
          header="Status"
          body={statusCodeBodyTemplate}
          headerClassName={`${styles.header}`}
          bodyClassName={`text-center ${styles.primary}`}></Column>
      </DataTable>
    </>
  );
};

export default LazyDataTable;
