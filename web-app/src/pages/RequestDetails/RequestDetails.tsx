import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RequestDetailsInformations from "../../components/RequestDetailsInformations/RequestDetailsInformations";
import {
  GetRequestSettingByIdQuery,
  GetRequestSettingByIdQueryVariables,
} from "../../gql/graphql";
import { REQUESTS_ROUTE } from "../../routes";
import {
  REQUEST_DOESNT_EXIST,
  SERVER_IS_KO_ERROR_MESSAGE,
} from "../../utils/error-messages";
import RequestCreation from "../RequestCreation/RequestCreation";

import styles from "./RequestDetails.module.scss";

export const GET_REQUEST_SETTING_BY_ID = gql`
  query GetRequestSettingById($id: String!) {
    getRequestSettingById(id: $id) {
      requestSetting {
        id
        createdAt
        url
        name
        isActive
        frequency
        headers
        alerts {
          httpStatusCode
          type
        }
      }
      requestResult {
        id
        createdAt
        statusCode
        duration
        getIsAvailable
      }
    }
  }
`;

const RequestDetails = ({ role }: { role: string | undefined }) => {
  const [selectedTab, setSelectedTab] = useState("informations");
  const navigate = useNavigate();

  let { requestId } = useParams();

  const { data, refetch } = useQuery<
    GetRequestSettingByIdQuery,
    GetRequestSettingByIdQueryVariables
  >(GET_REQUEST_SETTING_BY_ID, {
    variables: { id: requestId! },
    onError: (error) => {
      if (error.message.includes("invalid input syntax for type uuid"))
        toast.error(REQUEST_DOESNT_EXIST, {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: "RDE",
        });
      else {
        switch (error.message) {
          case REQUEST_DOESNT_EXIST:
            toast.error(error.message, {
              position: toast.POSITION.BOTTOM_RIGHT,
              toastId: 1,
            });
            break;
          default:
            toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
              position: toast.POSITION.BOTTOM_RIGHT,
              toastId: 2,
            });
        }
      }
      navigate(REQUESTS_ROUTE);
    },
  });

  return (
    <>
      <div className={`${styles.contentContainer}`}>
        <div className="d-flex align-items-center">
          <i
            onClick={() => navigate(REQUESTS_ROUTE)}
            title="Go back to request list"
            className={`${styles.previousIcon} bi bi-arrow-left me-3`}
          ></i>
          <h1 className={`${styles.pageTitle}`}>Request details</h1>
        </div>
        <div className={`${styles.slider} gap-4 mt-5`}>
          {/* Informations */}
          <div
            className={`${
              selectedTab === "informations" && styles.selectedTab
            }  ${styles.tabContainer}`}
            onClick={() => {
              setSelectedTab("informations");
              refetch();
            }}
          >
            <span className={`${styles.tabs} `}>Informations</span>
          </div>
          {/* Settings */}
          <div
            className={`${selectedTab === "settings" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
            onClick={() => {
              setSelectedTab("settings");
              refetch();
            }}
          >
            <span className={`${styles.tabs} `}>Settings</span>
          </div>
          {/* History */}
          <div
            className={`${selectedTab === "history" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
            onClick={() => {
              setSelectedTab("history");
              refetch();
            }}
          >
            <span className={`${styles.tabs} `}>History</span>
          </div>
          {/* Graph */}
          <div
            className={`${selectedTab === "graph" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
            onClick={() => {
              setSelectedTab("graph");
              refetch();
            }}
          >
            <span className={`${styles.tabs} `}>Graph</span>
          </div>
        </div>
      </div>
      {selectedTab === "informations" && (
        <RequestDetailsInformations
          {...{ refetch }}
          existingRequest={data?.getRequestSettingById}
        />
      )}
      {selectedTab === "settings" && (
        <RequestCreation
          role={role}
          existingRequest={data?.getRequestSettingById}
        />
      )}
      {selectedTab === "history" && <div>history</div>}
      {selectedTab === "graph" && <div>graph</div>}
    </>
  );
};

export default RequestDetails;
