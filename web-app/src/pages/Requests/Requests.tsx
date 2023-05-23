import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery } from "../../gql/graphql";
import { REQUEST_CREATION_ROUTE } from "../../routes";
import styles from "./Requests.module.scss";
import LazyDataTable from "../../components/LazyDataTable/LazyDataTable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { LazyDataTableProps } from "../../models/LazyDataTable.model";

const CHECK_IF_NON_PREMIUM_USER_HAS_REACHED_MAX_REQUESTS_COUNT = gql`
  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {
    checkIfNonPremiumUserHasReachedMaxRequestsCount
  }
`;

const Requests = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<LazyDataTableProps>({
    isActive: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: "",
          matchMode: FilterMatchMode.EQUALS,
        },
      ],
    },
  });

  const [checkUserMaxRequestsBeforeNavigate] =
    useLazyQuery<CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery>(
      CHECK_IF_NON_PREMIUM_USER_HAS_REACHED_MAX_REQUESTS_COUNT,
      {
        onCompleted: (data) => {
          navigate(REQUEST_CREATION_ROUTE);
        },
        onError: (error) => {
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 1,
          });
        },
      }
    );

  const navigateToRequestCreationPage = () => {
    checkUserMaxRequestsBeforeNavigate();
  };

  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <>
      <div className={`${styles.contentContainer}`}>
        <div className="d-flex align-items-center justify-content-between">
          <h1 className={`${styles.pageTitle}`}>Requests</h1>
          <button
            className={`${styles.createBtn}`}
            onClick={navigateToRequestCreationPage}>
            Create
          </button>
        </div>
        <div className={`d-flex gap-5 mt-5 ${styles.scrollbar}`}>
          <div
            className={`${selectedTab === "all" && styles.selectedTab}  ${
              styles.tabContainer
            }`}>
            <span
              className={`${styles.tabs} `}
              onClick={() => {
                setIsActive({
                  isActive: {
                    operator: FilterOperator.AND,
                    constraints: [
                      {
                        value: "",
                        matchMode: FilterMatchMode.EQUALS,
                      },
                    ],
                  },
                });

                setSelectedTab("all");
              }}>
              All
            </span>
          </div>
          <div
            className={`${selectedTab === "active" && styles.selectedTab}  ${
              styles.tabContainer
            }`}>
            <span
              className={`${styles.tabs}`}
              onClick={() => {
                setIsActive({
                  isActive: {
                    operator: FilterOperator.AND,
                    constraints: [
                      {
                        value: "true",
                        matchMode: FilterMatchMode.EQUALS,
                      },
                    ],
                  },
                });

                setSelectedTab("active");
              }}>
              Active
            </span>
          </div>
          <div
            className={`${selectedTab === "inactive" && styles.selectedTab}  ${
              styles.tabContainer
            }`}>
            <span
              className={`${styles.tabs} `}
              onClick={() => {
                setIsActive({
                  isActive: {
                    operator: FilterOperator.AND,
                    constraints: [
                      {
                        value: "false",
                        matchMode: FilterMatchMode.EQUALS,
                      },
                    ],
                  },
                });
                setSelectedTab("inactive");
              }}>
              Inactive
            </span>
          </div>
        </div>
        <div className={`${styles.tableContainer}`}>
          <LazyDataTable isActive={isActive} />
        </div>
      </div>
    </>
  );
};

export default Requests;
