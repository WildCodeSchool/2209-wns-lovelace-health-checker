import {
  DataTable,
  DataTableFilterMeta,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import styles from "./RequestResultsTable.module.scss";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { useEffect, useState } from "react";
import { Filter, LazyTableState } from "../../models/LazyDataTable.model";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import {
  GetPageOfRequestResultQuery,
  GetPageOfRequestResultQueryVariables,
} from "../../gql/graphql";
import { toast } from "react-toastify";
import { UNABLE_TO_FETCH_REQUESTS_FROM_DATABASE } from "../../utils/info-and-error-messages";
import { formatDateString } from "../../utils/date";
import { FilterMatchMode, FilterOperator } from "primereact/api";

interface RequestResult {
  createdAt: any;
  duration: number;
  isAvailable: boolean | undefined;
  id: string;
  statusCode: number | null | undefined;
}

const GET_PAGE_OF_REQUEST_RESULT_FILTERED = gql`
  query getPageOfRequestResult(
    $first: Int!
    $rows: Int!
    $page: Int!
    $sortField: String!
    $sortOrder: Int!
    $settingId: String!
    $filters: [Filter!]
  ) {
    getPageOfRequestResult(
      first: $first
      rows: $rows
      page: $page
      sortField: $sortField
      sortOrder: $sortOrder
      settingId: $settingId
      filters: $filters
    ) {
      totalCount
      requestResults {
        createdAt
        duration
        getIsAvailable
        id
        statusCode
      }
    }
  }
`;

const RequestResultsTable = () => {
  const [requestResults, setRequestResults] = useState<RequestResult[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [lazyState, setlazyState] = useState<LazyTableState>({
    first: 0,
    rows: 10,
    page: 1,
    sortField: "createdAt",
    sortOrder: -1,
    filters: [],
  });

  const [tableFilters, setTableFilters] = useState<DataTableFilterMeta>({
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.DATE_IS,
        },
      ],
    },
    statusCode: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
      ],
    },
    duration: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
      ],
    },
  });

  const { requestId } = useParams();

  const { refetch, loading } = useQuery<
    GetPageOfRequestResultQuery,
    GetPageOfRequestResultQueryVariables
  >(GET_PAGE_OF_REQUEST_RESULT_FILTERED, {
    variables: {
      first: lazyState.first,
      rows: lazyState.rows,
      page: lazyState.page,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder ? lazyState.sortOrder : 1,
      settingId: requestId ? requestId : "",
      filters: lazyState.filters,
    },
    onCompleted: (data) => {
      const { getPageOfRequestResult } = data;
      const { requestResults } = getPageOfRequestResult;

      const formattedResults = requestResults.map((result: any) => ({
        createdAt: result.createdAt,
        duration: result.duration,
        id: result.id,
        isAvailable: result.getIsAvailable,
        statusCode: result.statusCode,
      }));

      setRequestResults(formattedResults);
      setTotalRecords(getPageOfRequestResult.totalCount);
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

  const createdAtBodyTemplate = (requestResult: RequestResult) => {
    if (!requestResult.createdAt) {
      return "-";
    }
    return formatDateString(requestResult.createdAt);
  };

  const isAvailableBodyTemplate = (requestResult: RequestResult) => {
    if (requestResult.isAvailable === true) {
      return <i className={`bi bi-check-circle ${styles.available}`}></i>;
    }
    if (requestResult.isAvailable === false) {
      return <i className={`bi bi-x-circle ${styles.notAvailable}`}></i>;
    } else return "-";
  };

  const durationBodyTemplate = (requestResult: RequestResult) => {
    if (!requestResult.duration) {
      return "-";
    }
    return <span>{requestResult.duration} ms</span>;
  };

  const statusCodeBodyTemplate = (requestResult: RequestResult) => {
    if (!requestResult.statusCode) {
      return "-";
    }

    return <span>{requestResult.statusCode}</span>;
  };

  const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e: CalendarChangeEvent) =>
          options.filterCallback(e.value, options.index)
        }
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
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

  return (
    <>
      <div className={`${styles.tableContainer}`}>
        <DataTable
          value={requestResults}
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
            filter
            filterElement={dateFilterTemplate}
            filterMatchModeOptions={[
              { label: "Date is", value: FilterMatchMode.DATE_IS },
              { label: "Date is not", value: FilterMatchMode.DATE_IS_NOT },
              { label: "Date is before", value: FilterMatchMode.DATE_BEFORE },
              { label: "Date is after", value: FilterMatchMode.DATE_AFTER },
            ]}
            sortable
            field="createdAt"
            header="Date"
            headerClassName={`${styles.header}`}
            className={`${styles.createdAt}`}
            body={createdAtBodyTemplate}
            bodyClassName={`text-center ${styles.primary} ${styles.hidden} ${styles.createdAt}`}></Column>
          <Column
            filter
            filterMatchModeOptions={[
              { label: "Equals", value: FilterMatchMode.EQUALS },
              { label: "Not equals", value: FilterMatchMode.NOT_EQUALS },
              { label: "Greater than", value: FilterMatchMode.GREATER_THAN },
              {
                label: "Greater than or equal to",
                value: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
              },
              { label: "Less than", value: FilterMatchMode.LESS_THAN },
              {
                label: "Less than or equal to",
                value: FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
              },
            ]}
            sortable
            field="duration"
            header="Duration"
            headerClassName={`${styles.header}`}
            className={`${styles.duration}`}
            body={durationBodyTemplate}
            bodyClassName={`text-center ${styles.primary} ${styles.hidden} ${styles.duration}`}></Column>
          <Column
            filter={false}
            field="getIsAvailable"
            header="Availability"
            dataType="boolean"
            headerClassName={`${styles.header}`}
            className={`${styles.isAvailable}`}
            body={isAvailableBodyTemplate}
            bodyClassName="text-center"></Column>
          <Column
            filter
            filterMatchModeOptions={[
              { label: "Equals", value: FilterMatchMode.EQUALS },
              { label: "Not equals", value: FilterMatchMode.NOT_EQUALS },
              { label: "Greater than", value: FilterMatchMode.GREATER_THAN },
              {
                label: "Greater than or equal to",
                value: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
              },
              { label: "Less than", value: FilterMatchMode.LESS_THAN },
              {
                label: "Less than or equal to",
                value: FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
              },
            ]}
            sortable
            field="statusCode"
            header="Status"
            className={`${styles.statusCode}`}
            body={statusCodeBodyTemplate}
            headerClassName={`${styles.header}`}
            bodyClassName={`text-center ${styles.primary}`}></Column>
        </DataTable>
      </div>
    </>
  );
};

export default RequestResultsTable;
