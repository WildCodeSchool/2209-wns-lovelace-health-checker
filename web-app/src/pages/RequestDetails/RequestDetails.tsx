import { useState } from "react";
import RequestCreation from "../RequestCreation/RequestCreation";

import styles from "./RequestDetails.module.scss";

const RequestDetails = ({ role }: { role: string | undefined }) => {
  const [selectedTab, setSelectedTab] = useState("informations");

  return (
    <>
      <div className={`${styles.contentContainer}`}>
        <div className="d-flex align-items-center justify-content-between">
          <h1 className={`${styles.pageTitle}`}>Request details</h1>
        </div>
        <div className={`${styles.slider} gap-4 mt-5`}>
          {/* Informations */}
          <div
            className={`${
              selectedTab === "informations" && styles.selectedTab
            }  ${styles.tabContainer}`}
            onClick={() => setSelectedTab("informations")}
          >
            <span className={`${styles.tabs} `}>Informations</span>
          </div>
          {/* Settings */}
          <div
            className={`${selectedTab === "settings" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
            onClick={() => setSelectedTab("settings")}
          >
            <span className={`${styles.tabs} `}>Settings</span>
          </div>
          {/* History */}
          <div
            className={`${selectedTab === "history" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
            onClick={() => setSelectedTab("history")}
          >
            <span className={`${styles.tabs} `}>History</span>
          </div>
          {/* Graph */}
          <div
            className={`${selectedTab === "graph" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
            onClick={() => setSelectedTab("graph")}
          >
            <span className={`${styles.tabs} `}>Graph</span>
          </div>
        </div>
      </div>
      {selectedTab === "informations" && <div>informations</div>}
      {selectedTab === "settings" && <RequestCreation role={role} />}
      {selectedTab === "history" && <div>history</div>}
      {selectedTab === "graph" && <div>graph</div>}
    </>
  );
};

export default RequestDetails;
