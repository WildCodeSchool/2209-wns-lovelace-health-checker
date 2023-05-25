import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CheckUrlLaunchedManuallyQuery,
  DeleteRequestMutation,
  DeleteRequestMutationVariables,
  GetRequestSettingByIdQuery,
} from "../../gql/graphql";
import { AlertType } from "../../utils/alert-types.enum";
import { formatDateString } from "../../utils/date";
import {
  getSpecificErrorsByType,
  getSpecificErrorsCodes,
  HTTP_ERROR_STATUS_CODES,
} from "../../utils/http-error-status-codes.enum";
import { formatFrequency } from "../../utils/request-frequency.enum";
import styles from "./RequestDetailsInformations.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { REQUESTS_ROUTE } from "../../routes";
import {
  REQUEST_DOESNT_EXIST,
  SERVER_IS_KO_ERROR_MESSAGE,
} from "../../utils/info-and-error-messages";
import { UNAUTHORIZED } from "../../utils/info-and-error-messages";

export const CHECK_URL_LAUNCHED_MANUALLY = gql`
  query CheckUrlLaunchedManually($checkUrlLaunchedManuallyId: String!) {
    checkUrlLaunchedManually(id: $checkUrlLaunchedManuallyId) {
      id
      createdAt
      url
      getIsAvailable
      statusCode
      duration
      headers
    }
  }
`;

export const DELETE_REQUEST = gql`
  mutation DeleteRequest($requestId: String!) {
    deleteRequestSetting(requestId: $requestId)
  }
`;

const RequestDetailsInformations = ({
  existingRequest,
  refetch,
}: {
  existingRequest:
    | GetRequestSettingByIdQuery["getRequestSettingById"]
    | undefined;
  refetch: any;
}) => {
  const [frequency, setFrequency] = useState("");
  const [emailAlerts, setEmailAlerts] = useState<any[]>([]);
  const [pushAlerts, setPushAlerts] = useState<any[]>([]);
  const [specificEmailAlerts, setSpecificEmailAlerts] = useState<number[]>([]);
  const [specificPushAlerts, setSpecificPushAlerts] = useState<number[]>([]);
  const [parsedHeaders, setParsedHeaders] = useState<any[]>();

  const navigate = useNavigate();
  let { requestId } = useParams();

  useEffect(() => {
    if (existingRequest) {
      refetch();
      setFrequency(formatFrequency(existingRequest?.requestSetting?.frequency));
    }

    if (existingRequest?.requestSetting.alerts.length) {
      setEmailAlerts(
        getSpecificErrorsByType(
          AlertType.EMAIL,
          existingRequest?.requestSetting.alerts
        )
      );
      setPushAlerts(
        getSpecificErrorsByType(
          AlertType.PUSH,
          existingRequest?.requestSetting.alerts
        )
      );
    }
    if (existingRequest?.requestSetting.headers)
      setParsedHeaders(
        JSON.parse(existingRequest.requestSetting.headers as string)
      );
  }, [existingRequest]);

  useEffect(() => {
    setSpecificEmailAlerts(getSpecificErrorsCodes(emailAlerts));
  }, [emailAlerts]);

  useEffect(() => {
    setSpecificPushAlerts(getSpecificErrorsCodes(pushAlerts));
  }, [pushAlerts]);

  const [checkUrlManually, { loading }] =
    useLazyQuery<CheckUrlLaunchedManuallyQuery>(CHECK_URL_LAUNCHED_MANUALLY, {
      variables: {
        checkUrlLaunchedManuallyId: existingRequest?.requestSetting.id!,
      },
      fetchPolicy: "no-cache",
      onCompleted: () => {
        toast.success("Your request has been executed successfully !", {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 1,
        });
        refetch();
      },
    });

  const [deleteRequest] = useMutation<
    DeleteRequestMutation,
    DeleteRequestMutationVariables
  >(DELETE_REQUEST, {
    variables: { requestId: requestId!! },
    onCompleted: () => {
      toast.success("Request deleted successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "deletedRequest",
      });
      navigate(REQUESTS_ROUTE);
    },
    onError: (error) => {
      switch (error.message) {
        case REQUEST_DOESNT_EXIST:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 2,
          });
          break;
        case UNAUTHORIZED:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 3,
          });
          break;
        default:
          toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 4,
          });
      }
    },
  });

  return (
    <>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className={`modal-header ${styles.modalHeader}`}>
              <h1
                className={`m-0 ${styles.modalTitle}`}
                id="staticBackdropLabel"
              >
                Deletion confirmation
              </h1>
            </div>
            <div className="modal-body py-4">
              Once you delete your request, there is no going back. You will
              loose all related history and alerts. Please be certain.
            </div>
            <div className="modal-footer">
              <button
                className={`${styles.btnModal} ${styles.btnSecondary}`}
                type="button"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                className={`${styles.btnModal} ${styles.btnPrimary}`}
                onClick={() => {
                  deleteRequest();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.contentContainer}`}>
        <div className="d-flex flex-wrap gap-5 gap-md-3">
          {/* General */}
          <div className={`col-12 col-md-6 ${styles.formContainer}`}>
            <h2 className={`${styles.header} mt-md-3`}>
              <i className="bi bi-info-circle"></i> General
            </h2>
            <div className={`${styles.formContent} text-break`}>
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
              <div className="position-relative">
                {loading && (
                  <div
                    className={`${styles.loaderBackground} position-absolute d-flex align-items-center justify-content-center w-100 h-100`}
                  >
                    <div className={styles.loader}></div>
                  </div>
                )}

                {existingRequest?.requestResult === null ? (
                  <div>
                    This request has never been executed yet. You can press
                    below button to execute it manually.
                  </div>
                ) : (
                  <div>
                    <div className={`${styles.label}`}>Date</div>
                    <p className={`${styles.value}`}>
                      {formatDateString(
                        existingRequest?.requestResult?.createdAt
                      )}
                    </p>
                    <div className={`${styles.label}`}>Availability</div>
                    <p className={`${styles.value}`}>
                      {existingRequest?.requestResult?.getIsAvailable ===
                        false && (
                        <span>
                          Not available
                          <i
                            className={`bi bi-x-circle ${styles.xIcon} ms-2`}
                          ></i>
                        </span>
                      )}
                      {existingRequest?.requestResult?.getIsAvailable ===
                        true && (
                        <span>
                          Available
                          <i
                            className={`bi bi-check-circle ${styles.checkIcon} ms-2`}
                          ></i>
                        </span>
                      )}
                    </p>
                    <div className={`${styles.label}`}>Status code</div>
                    <p className={`${styles.value}`}>
                      {existingRequest?.requestResult?.statusCode === null
                        ? "Not reachable"
                        : existingRequest?.requestResult?.statusCode}
                    </p>
                    <div className={`${styles.label}`}>Duration</div>
                    <p className={`${styles.value} m-0`}>
                      {existingRequest?.requestResult?.duration === null
                        ? "-"
                        : `${existingRequest?.requestResult?.duration} ms`}
                    </p>
                  </div>
                )}
              </div>
              <button
                disabled={loading}
                type="button"
                onClick={() => {
                  checkUrlManually();
                }}
                className={`${styles.btn} ${styles.btnSecondary} mt-4 ${
                  loading && styles.btnDisabled
                }`}
              >
                {existingRequest?.requestResult === null
                  ? "Launch"
                  : "Relaunch"}
              </button>
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
                {/* Email */}
                <div className={`${styles.label}`}>
                  Email on error 4XX and 5XX
                </div>
                <p className={`${styles.value}`}>
                  {(emailAlerts.length === 0 ||
                    emailAlerts.length !== HTTP_ERROR_STATUS_CODES.length) && (
                    <span>
                      Inactive
                      <i className={`bi bi-x-circle ms-2 ${styles.xIcon}`}></i>
                    </span>
                  )}
                  {emailAlerts.length === HTTP_ERROR_STATUS_CODES.length && (
                    <span>
                      Active
                      <i
                        className={`bi bi-check-circle ms-2 ${styles.checkIcon}`}
                      ></i>
                    </span>
                  )}
                </p>
                <div className={`${styles.label}`}>
                  Specific errors emails
                  <i
                    className={`${styles.premiumIcon} ms-2 bi bi-star-fill`}
                  ></i>
                </div>
                <p className={`${styles.value} m-0`}>
                  {emailAlerts.length !== 0 &&
                    emailAlerts.length !== HTTP_ERROR_STATUS_CODES.length && (
                      <span>
                        Active
                        <i
                          className={`bi bi-check-circle ms-2 ${styles.checkIcon}`}
                        ></i>
                      </span>
                    )}
                  {(emailAlerts.length === HTTP_ERROR_STATUS_CODES.length ||
                    emailAlerts.length === 0) && (
                    <span>
                      Inactive
                      <i className={`bi bi-x-circle ms-2 ${styles.xIcon}`}></i>
                    </span>
                  )}
                </p>
                <p className="m-0">
                  {specificEmailAlerts.length > 0 &&
                    specificEmailAlerts.join(", ")}
                </p>

                {/* <hr /> */}

                {/* Push */}
                {/* <div className={`${styles.label}`}>
                  Push notification on error 4XX and 5XX
                </div>
                <p className={`${styles.value}`}>
                  {(pushAlerts.length === 0 ||
                    pushAlerts.length !== HTTP_ERROR_STATUS_CODES.length) && (
                    <span>
                      Inactive
                      <i className={`bi bi-x-circle ms-2 ${styles.xIcon}`}></i>
                    </span>
                  )}
                  {pushAlerts.length === HTTP_ERROR_STATUS_CODES.length && (
                    <span>
                      Active
                      <i
                        className={`bi bi-check-circle ms-2 ${styles.checkIcon}`}
                      ></i>
                    </span>
                  )}
                </p>
                <div className={`${styles.label}`}>
                  Specific errors notifications
                  <i
                    className={`${styles.premiumIcon} ms-2 bi bi-star-fill`}
                  ></i>
                </div>
                <p className={`${styles.value} m-0`}>
                  {pushAlerts.length !== 0 &&
                    pushAlerts.length !== HTTP_ERROR_STATUS_CODES.length && (
                      <span>
                        Active
                        <i
                          className={`bi bi-check-circle ms-2 ${styles.checkIcon}`}
                        ></i>
                      </span>
                    )}
                  {(pushAlerts.length === HTTP_ERROR_STATUS_CODES.length ||
                    pushAlerts.length === 0) && (
                    <span>
                      Inactive
                      <i className={`bi bi-x-circle ms-2 ${styles.xIcon}`}></i>
                    </span>
                  )}
                </p>
                <p className="m-0">
                  {specificPushAlerts.length > 0 &&
                    specificPushAlerts.join(", ")}
                </p> */}
              </div>
            </div>
          </div>

          {/* Headers */}
          <div className={`col ${styles.formContainer} text-break`}>
            <h2 className={`${styles.header} mt-md-3`}>
              <i className="bi bi-card-text"></i> Headers
            </h2>
            <div className={`${styles.formContent}`}>
              {(existingRequest?.requestSetting?.headers === null ||
                existingRequest?.requestSetting?.headers === "") && (
                <div>No headers set</div>
              )}
              <div className="d-flex flex-column gap-3">
                {parsedHeaders?.map((header, index) => (
                  <div key={index}>
                    <div className={`${styles.label}`}>{header.property}</div>
                    <p className={`${styles.value} m-0`}>{header.value}</p>
                  </div>
                ))}
              </div>
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
                loose all related history and alerts. Please be certain.
              </p>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                className={`${styles.dangerButton}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetailsInformations;
