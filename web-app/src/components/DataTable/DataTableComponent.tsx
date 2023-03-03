import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";

import styles from "./DataTableComponent.module.scss";
import { formatFrequency, Frequency } from "../../utils/request-frequency.enum";
import { formatDateString } from "../../utils/date";

interface DataTableProps {
  requests: Request[];
  loading: boolean;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
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

const DataTableComponent = (
  pageOfRequestSettingWithLastResult: DataTableProps
) => {
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

  const initFilters = () => {
    setFilters({
      url: {
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      name: {
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      frequency: {
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
          console.log(e.value);
          options.filterCallback(e.value, options.index);
          setSelectedFrequency(e.value);
        }}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  // const frequencyItemTemplate = (option: string) => {
  //   return <Tag value={option} />;
  // };

  const nameBodyTemplate = (request: Request) => {
    if (!request.name) {
      return "-";
    }
    return request.name;
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

  return (
    <>
      <DataTable
        value={pageOfRequestSettingWithLastResult.requests}
        loading={pageOfRequestSettingWithLastResult.loading}
        dataKey="id"
        className={`${styles.table}`}
        filters={filters}
      >
        <Column
          field="url"
          header="URL"
          filter
          headerClassName={`${styles.header}`}
          bodyClassName={`${styles.primary} ${styles.hidden} ${styles.url} `}
        ></Column>
        <Column
          field="name"
          header="Name"
          filter
          headerClassName={`${styles.header}`}
          body={nameBodyTemplate}
          bodyClassName={`${styles.primary} ${styles.hidden} ${styles.name}`}
        ></Column>
        <Column
          field="frequency"
          header="Frequency"
          filter
          filterMenuStyle={{ width: "14rem" }}
          filterElement={frequenciesFilterTemplate}
          style={{ minWidth: "12rem" }}
          headerClassName={`${styles.header}`}
          body={frequencyBodyTemplate}
          bodyClassName={`text-center ${styles.primary}`}
        ></Column>
        <Column
          field="createdAt"
          header="Last Result"
          headerClassName={`${styles.header}`}
          className={`${styles.createdAt}`}
          body={createdAtBodyTemplate}
          bodyClassName={`text-center ${styles.primary} ${styles.hidden} ${styles.createdAt}`}
        ></Column>
        <Column
          field="isAvailable"
          header="Availability"
          headerClassName={`${styles.header}`}
          body={isAvailableBodyTemplate}
          bodyClassName="text-center"
        ></Column>
        <Column
          field="statusCode"
          header="Status"
          headerClassName={`${styles.header}`}
          bodyClassName={`text-center ${styles.primary}`}
        ></Column>
      </DataTable>
    </>
  );
};

export default DataTableComponent;
