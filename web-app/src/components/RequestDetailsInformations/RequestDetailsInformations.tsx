import { useEffect, useState } from "react";
import { GetRequestSettingByIdQuery } from "../../gql/graphql";
import styles from "./RequestDetailsInformations.module.scss";

const RequestDetailsInformations = ({
  existingRequest,
}: {
  existingRequest:
    | GetRequestSettingByIdQuery["getRequestSettingById"]
    | undefined;
}) => {
  const [frequency, setFrequency] = useState("");

  /* TODO : remove this method which is already implemented into request-frequency.enum.ts, just import it ! */
  const formatFrequency = (frequency: number): string => {
    if (frequency >= 2592000) {
      const numMonths = Math.round(frequency / 2592000);
      return `${numMonths} ${numMonths > 1 ? "months" : "month"}`;
    } else if (frequency >= 86400) {
      const numDays = Math.round(frequency / 86400);
      return `${numDays} ${numDays > 1 ? "days" : "day"}`;
    } else if (frequency >= 3600) {
      const numHours = Math.round(frequency / 3600);
      return `${numHours} ${numHours > 1 ? "hrs" : "hr"}`;
    } else if (frequency >= 60) {
      const numMinutes = Math.round(frequency / 60);
      return `${numMinutes} ${numMinutes > 1 ? "mins" : "min"}`;
    } else {
      return `${frequency} ${frequency > 1 ? "secs" : "sec"}`;
    }
  };

  useEffect(() => {
    if (existingRequest)
      setFrequency(formatFrequency(existingRequest?.requestSetting?.frequency));
  }, [existingRequest]);

  return (
    <div className={`${styles.contentContainer}`}>
      <div className="d-flex flex-wrap gap-5 gap-md-3">
        {/* General */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-info-circle"></i> General
          </h2>
          <div className={`${styles.formContent}`}>
            <div>
              <div className={`${styles.label}`}>URL</div>
              <p className={`${styles.value}`}>
                {existingRequest?.requestSetting?.url}
              </p>
              <div className={`${styles.label}`}>Name</div>
              <p className={`${styles.value}`}>
                {existingRequest?.requestSetting?.name === null
                  ? "-"
                  : existingRequest?.requestSetting?.name}
              </p>
              <div className={`${styles.label}`}>State</div>
              <p className={`${styles.value}`}>
                {existingRequest?.requestSetting?.isActive ? (
                  <span>
                    Active
                    <i
                      className={`bi bi-check-circle ms-2 ${styles.checkIcon}`}
                    ></i>
                  </span>
                ) : (
                  <span>
                    Inactive
                    <i className={`bi bi-x-circle ms-2 ${styles.xIcon}`}></i>
                  </span>
                )}
              </p>

              <div className={`${styles.label}`}>Execution frequency</div>
              <p className={`${styles.value} m-0`}>{frequency}</p>
            </div>
          </div>
        </div>

        {/* Last request */}
        <div className={`col ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-clock-history"></i> Last request
          </h2>
          <div className={`${styles.formContent}`}>
            {existingRequest?.requestResult === null ? (
              <div>
                <div>
                  This request has never been executed yet. You can press below
                  button to execute it manually.
                </div>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary} mt-4`}
                >
                  Launch
                </button>
              </div>
            ) : (
              <div>
                <div>Date :</div>
                <div>Availability : </div>
                <div>Status code : </div>
                <div>Duration : </div>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary} mt-4`}
                >
                  Relaunch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        {/* Alerts */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-bell"></i> Alerts
          </h2>
          <div className={`${styles.formContent}`}>
            <div>
              <div className={`${styles.label}`}>
                Email on error 4XX and 5XX
              </div>
              <p className={`${styles.value}`}>
                {existingRequest?.requestSetting?.alerts.length === 0 && (
                  <span>
                    Inactive
                    <i className={`bi bi-x-circle ms-2 ${styles.xIcon}`}></i>
                  </span>
                )}
                {/* TODO : Get all email alerts (type email), check if length equals enum length. If same length => true */}
                {existingRequest?.requestSetting?.alerts.length !== 0 && (
                  <span>
                    Active
                    <i
                      className={`bi bi-check-circle ms-2 ${styles.checkIcon}`}
                    ></i>
                  </span>
                )}
              </p>
              <div className={`${styles.label}`}>
                Push notification on error 4XX and 5XX
              </div>
              <p className={`${styles.value}`}>
                {/* TODO : Get all email alerts (type email), check if length not empty && NOT equals to enum length. Verified = true */}
                {existingRequest?.requestSetting?.alerts.length !== 0 && (
                  <span>
                    Active
                    <i
                      className={`bi bi-check-circle ms-2 ${styles.checkIcon}`}
                    ></i>
                  </span>
                )}
                {/* TODO : Get all email alerts (type email), inactive if length empty && length equals enum length */}
                {existingRequest?.requestSetting?.alerts.length === 0 && (
                  <span>
                    Inactive
                    <i className={`bi bi-x-circle ms-2 ${styles.xIcon}`}></i>
                  </span>
                )}
              </p>
              {/* TODO : do same for push alerts */}
              <div>Specific errors emails :</div>
              <div>Specific errors notifications :</div>
            </div>
          </div>
        </div>

        {/* Headers */}
        <div className={`col ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-card-text"></i> Headers
          </h2>
          <div className={`${styles.formContent}`}>
            {existingRequest?.requestSetting?.headers === null ||
            existingRequest?.requestSetting?.headers === "" ? (
              <div>No headers set</div>
            ) : (
              <div>
                {/* Parse headers to get values and loop to display correct informations */}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        {/* Request deletion */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-exclamation-triangle"></i> Request deletion
          </h2>
          <div className={`${styles.dangerZone}`}>
            <p>
              Once you delete your request, there is no going back. You will
              loose all related alerts. Please be certain.
            </p>
            <button className={`${styles.dangerButton}`}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsInformations;
