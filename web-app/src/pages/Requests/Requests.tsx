import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import DataTableComponent from "../../components/DataTable/DataTableComponent";

import {
  CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery,
  GetPageOfRequestSettingWithLastResultQuery,
  GetPageOfRequestSettingWithLastResultQueryVariables,
} from "../../gql/graphql";
import { REQUEST_CREATION_ROUTE } from "../../routes";
import styles from "./Requests.module.scss";

const CHECK_IF_NON_PREMIUM_USER_HAS_REACHED_MAX_REQUESTS_COUNT = gql`
  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {
    checkIfNonPremiumUserHasReachedMaxRequestsCount
  }
`;

const GET_PAGE_OF_REQUEST_SETTING_WITH_LAST_RESULT = gql`
  query GetPageOfRequestSettingWithLastResult($pageNumber: Int!) {
    getPageOfRequestSettingWithLastResult(pageNumber: $pageNumber) {
      totalCount
      nextPageNumber
      requestSettingsWithLastResult {
        requestSetting {
          id
          name
          url
          frequency
        }
        requestResult {
          getIsAvailable
          statusCode
          createdAt
        }
      }
    }
  }
`;

const Requests = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [formattedData, setFormattedData] = useState<any>([]);
  const navigate = useNavigate();

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

  const { data, loading, refetch } = useQuery<
    GetPageOfRequestSettingWithLastResultQuery,
    GetPageOfRequestSettingWithLastResultQueryVariables
  >(GET_PAGE_OF_REQUEST_SETTING_WITH_LAST_RESULT, {
    variables: {
      pageNumber: pageNumber,
    },
    fetchPolicy: "cache-and-network",
  });

  if (!loading) console.log(data);

  const navigateToRequestCreationPage = () => {
    checkUserMaxRequestsBeforeNavigate();
  };

  useEffect(() => {
    setFormattedData(
      data?.getPageOfRequestSettingWithLastResult.requestSettingsWithLastResult.map(
        (item) => {
          return {
            ...item.requestSetting,
            isAvailable: item.requestResult?.getIsAvailable,
            statusCode: item.requestResult?.statusCode,
            createdAt: item.requestResult?.createdAt,
          };
        }
      )
    );
  }, [data]);

  const [selectedTab] = useState("informations");

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
        <div className="d-flex gap-5 mt-5">
          <div
            className={`${
              selectedTab === "informations" && styles.selectedTab
            }  ${styles.tabContainer}`}>
            <span className={`${styles.tabs} `}>All</span>
          </div>
          <div
            className={`${selectedTab === "premium" && styles.selectedTab}  ${
              styles.tabContainer
            }`}>
            <span className={`${styles.tabs} `}>Active</span>
          </div>
          <div
            className={`${selectedTab === "bills" && styles.selectedTab}  ${
              styles.tabContainer
            }`}>
            <span className={`${styles.tabs} `}>Inactive</span>
          </div>
        </div>
        <div className={`${styles.tableContainer}`}>
          {/* <RequestsTable
            requests={data}
            loading={loading}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          /> */}
          <DataTableComponent
            requests={formattedData}
            loading={loading}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalCount={data?.getPageOfRequestSettingWithLastResult.totalCount}
            refetch={refetch}
          />
        </div>
      </div>
    </>
  );
};

export default Requests;
