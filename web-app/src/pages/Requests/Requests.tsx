import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery } from "../../gql/graphql";
import styles from "./Requests.module.scss";

const CHECK_IF_NON_PREMIUM_USER_HAS_REACHED_MAX_REQUESTS_COUNT = gql`
  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {
    checkIfNonPremiumUserHasReachedMaxRequestsCount
  }
`;

const Requests = () => {
  const navigate = useNavigate();

  const [checkUserMaxRequestsBeforeNavigate, { data }] =
    useLazyQuery<CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery>(
      CHECK_IF_NON_PREMIUM_USER_HAS_REACHED_MAX_REQUESTS_COUNT,
      {
        onCompleted: (data) => {
          navigate("/request-creation");
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

  const [selectedTab, setSelectedTab] = useState("informations");

  return (
    <>
      <div className={`${styles.contentContainer}`}>
        <div className="d-flex align-items-center justify-content-between">
          <h1 className={`${styles.pageTitle}`}>Requests</h1>
          <button
            className={`${styles.createBtn}`}
            onClick={navigateToRequestCreationPage}
          >
            Create
          </button>
        </div>
        <div className="d-flex gap-4 mt-5">
          <div
            className={`${
              selectedTab === "informations" && styles.selectedTab
            }  ${styles.tabContainer}`}
          >
            <span className={`${styles.tabs} `}>All</span>
          </div>
          <div
            className={`${selectedTab === "premium" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
          >
            <span className={`${styles.tabs} `}>Active</span>
          </div>
          <div
            className={`${selectedTab === "bills" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
          >
            <span className={`${styles.tabs} `}>Inactive</span>
          </div>
        </div>
        <div>{/* Insert table here */}</div>
      </div>
    </>
  );
};

export default Requests;
