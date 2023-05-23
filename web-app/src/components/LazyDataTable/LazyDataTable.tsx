import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import {
  DataTable,
  DataTableFilterMeta,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
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
import { gql, useQuery } from "@apollo/client";
import {
  GetPageOfRequestSettingWithLastResultQuery,
  GetPageOfRequestSettingWithLastResultQueryVariables,
} from "../../gql/graphql";
import { toast } from "react-toastify";
import { UNABLE_TO_FETCH_REQUESTS_FROM_DATABASE } from "../../utils/info-and-error-messages";
import {
  Filter,
  LazyDataTableProps,
  LazyTableState,
} from "../../models/LazyDataTable.model";

interface Request {
  createdAt: any;
  frequency: Frequency;
  id: string;
  isAvailable: boolean | undefined;
  name: string | null | undefined;
  statusCode: number | null | undefined;
  url: string;
}

const GET_PAGE_OF_REQUEST_SETTING_WITH_LAST_RESULT_FILTERED = gql`
  query GetPageOfRequestSettingWithLastResult(
    $first: Int!
    $rows: Int!
    $page: Int!
    $sortField: String!
    $sortOrder: Int!
    $filters: [Filter!]
  ) {
    getPageOfRequestSettingWithLastResult(
      first: $first
      rows: $rows
      page: $page
      sortField: $sortField
      sortOrder: $sortOrder
      filters: $filters
    ) {
      totalCount
      requestSettingsWithLastResult {
        requestResult {
          getIsAvailable
          statusCode
          createdAt
        }
        requestSetting {
          id
          url
          name
          frequency
        }
      }
    }
  }
`;

const LazyDataTable = (props: { isActive: LazyDataTableProps }) => {
  const getFrequencies = () => {
    const enumFrequencies = Object.values(Frequency).filter(
      (f) => typeof f === "number"
    );
    return enumFrequencies.map((n) => {
      return formatFrequency(+n);
    });
  };

  const [frequencies] = useState(getFrequencies());
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(
    null
  );
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [requests, setRequests] = useState<Request[]>();
  const [tableFilters, setTableFilters] = useState<DataTableFilterMeta>({
    name: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.STARTS_WITH,
        },
      ],
    },
    frequency: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
      ],
    },
    url: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.STARTS_WITH,
        },
      ],
    },
  });
  const [lazyState, setlazyState] = useState<LazyTableState>({
    first: 0,
    rows: 10,
    page: 1,
    sortField: "createdAt",
    sortOrder: 1,
    filters: [],
  });

  getFrequencies();

  const { isActive } = props;

  useEffect(() => {
    if (
      isActive.isActive.constraints[0].value === "true" ||
      isActive.isActive.constraints[0].value === "false"
    ) {
      setlazyState((prevState) => {
        return {
          ...prevState,
          filters: [
            ...prevState.filters.filter(
              (filter) => filter.field !== "isActive"
            ),
            {
              field: "isActive",
              operator: isActive.isActive.operator,
              constraints: isActive.isActive.constraints,
            },
          ],
        };
      });
    } else {
      setlazyState((prevState) => {
        return {
          ...prevState,
          filters: [
            ...prevState.filters.filter(
              (filter) => filter.field !== "isActive"
            ),
          ],
        };
      });
    }
  }, [isActive]);
  const navigate = useNavigate();

  const { refetch, loading } = useQuery<
    GetPageOfRequestSettingWithLastResultQuery,
    GetPageOfRequestSettingWithLastResultQueryVariables
  >(GET_PAGE_OF_REQUEST_SETTING_WITH_LAST_RESULT_FILTERED, {
    variables: {
      first: lazyState.first,
      rows: lazyState.rows,
      page: lazyState.page,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder ? lazyState.sortOrder : 1,
      filters: lazyState.filters,
    },
    onCompleted: (data) => {
      setRequests(
        data?.getPageOfRequestSettingWithLastResult.requestSettingsWithLastResult.map(
          (item) => {
            return {
              createdAt: item.requestResult?.createdAt,
              frequency: item.requestSetting.frequency,
              id: item.requestSetting.id,
              isAvailable: item.requestResult?.getIsAvailable,
              name: item.requestSetting.name,
              statusCode: item.requestResult?.statusCode,
              url: item.requestSetting.url,
            };
          }
        )
      );
      setTotalRecords(data?.getPageOfRequestSettingWithLastResult.totalCount);
    },
    onError: () => {
      toast.error(UNABLE_TO_FETCH_REQUESTS_FROM_DATABASE);
    },
  });

  useEffect(() => {
    refetch({
      first: lazyState.first,
      rows: lazyState.rows,
      page: lazyState.page,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder ? lazyState.sortOrder : 1,
      filters: lazyState.filters,
    });
  }, [lazyState, refetch]);

  const onPage = (event: DataTablePageEvent) => {
    setlazyState({
      ...lazyState,
      first: event.first,
      rows: event.rows,
      page: event.page ? event.page + 1 : 1,
    });
  };

  const onSort = (event: DataTableSortEvent) => {
    setlazyState({
      ...lazyState,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    });
  };

  const onFilter = (event: any) => {
    const newFilters: Filter[] = [];
    for (const field in event.filters) {
      const filterMeta = event.filters[field];
      const operator = filterMeta.operator || FilterOperator.AND;
      const constraints = [];

      for (const constraint of filterMeta.constraints) {
        if (constraint.value !== null) {
          const { value, matchMode } = constraint;
          constraints.push({ value, matchMode });
        }
      }

      if (constraints.length > 0) {
        newFilters.push({ field, operator, constraints });
      }
    }

    setTableFilters(event.filters);

    setlazyState({
      ...lazyState,
      first: 0,
      filters: newFilters,
    });
  };

  const frequenciesFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <Dropdown
        value={selectedFrequency}
        options={frequencies}
        onChange={(e: DropdownChangeEvent) => {
          options.filterCallback(parseTimeString(e.value), options.index);
          setSelectedFrequency(e.value);
        }}
        placeholder="Select One"
        className="p-column-filter"
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
        value={requests}
        lazy
        filterDisplay="menu"
        dataKey="id"
        paginator
        paginatorClassName={`${styles.paginator}`}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        className={`${styles.table}`}
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        onSort={onSort}
        sortField={lazyState.sortField}
        sortOrder={lazyState.sortOrder}
        onFilter={onFilter}
        filters={tableFilters}
        loading={loading}>
        <Column
          filter={false}
          headerClassName={`${styles.header}`}
          bodyClassName={`text-center ${styles.primary}`}
          body={iconBodyTemplate}></Column>
        <Column
          field="url"
          header="URL"
          filter
          maxConstraints={10}
          sortable
          body={urlBodyTemplate}
          headerClassName={`${styles.header}`}
          bodyClassName={`${styles.primary} ${styles.hidden} ${styles.url}`}></Column>
        <Column
          field="name"
          header="Name"
          filter
          maxConstraints={10}
          sortable
          headerClassName={`${styles.header}`}
          body={nameBodyTemplate}
          bodyClassName={`${styles.primary} ${styles.hidden} ${styles.name}`}></Column>
        <Column
          field="frequency"
          header="Frequency"
          filter
          filterElement={frequenciesFilterTemplate}
          filterMatchMode="equals"
          filterMatchModeOptions={[
            { label: "Equals", value: FilterMatchMode.EQUALS },
            { label: "Not equals", value: FilterMatchMode.NOT_EQUALS },
          ]}
          maxConstraints={10}
          headerClassName={`${styles.header}`}
          body={frequencyBodyTemplate}
          bodyClassName={`text-center ${styles.primary}`}></Column>
        <Column
          filter={false}
          field="createdAt"
          header="Last Result"
          headerClassName={`${styles.header}`}
          className={`${styles.createdAt}`}
          body={createdAtBodyTemplate}
          bodyClassName={`text-center ${styles.primary} ${styles.hidden} ${styles.createdAt}`}></Column>
        <Column
          filter={false}
          field="isAvailable"
          header="Availability"
          headerClassName={`${styles.header}`}
          body={isAvailableBodyTemplate}
          bodyClassName="text-center"></Column>
        <Column
          filter={false}
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
