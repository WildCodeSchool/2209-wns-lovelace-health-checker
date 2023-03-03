import { useEffect, useState } from "react";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";
import styles from "./RequestCreation.module.scss";
import Select from "react-select";
import {
  getSpecificErrorsByType,
  HTTP_ERROR_STATUS_CODES,
  retrieveExistingSpecificErrors,
} from "../../utils/http-error-status-codes.enum";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import {
  CreateRequestSettingMutation,
  CreateRequestSettingMutationVariables,
  GetRequestSettingByIdQuery,
  UpdateRequestSettingMutation,
  UpdateRequestSettingMutationVariables,
} from "../../gql/graphql";

import { Frequency } from "../../utils/request-frequency.enum";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { URL_REG_EXP } from "../../utils/regular-expressions";
import {
  ALERTS_ONLY_FOR_PREMIUM_USERS,
  ARGUMENT_VALIDATION_ERROR,
  FORM_CONTAINS_ERRORS,
  FREQUENCY_ONLY_FOR_PREMIUM_USERS,
  INCORRECT_HEADER_FORMAT,
  NAME_ALREADY_EXISTS,
  REQUEST_DOESNT_EXIST,
  SERVER_IS_KO_ERROR_MESSAGE,
  UNAUTHORIZED,
  URL_ALREADY_EXISTS,
} from "../../utils/error-messages";
import {
  NAME_MAX_LENGTH,
  NAME_MAX_LENGTH_ERROR_MESSAGE,
  NAME_MIN_LENGTH,
  NAME_MIN_LENGTH_ERROR_MESSAGE,
  NAME_PLACEHOLDER,
  URL_HEADER_ERROR_MESSAGE,
  URL_IS_REQUIRED_ERROR_MESSAGE,
  URL_PATTERN_ERROR_MESSAGE,
  URL_PLACEHOLDER,
} from "../../utils/form-validations";
import { REQUESTS_ROUTE } from "../../routes";
import { AlertType } from "../../utils/alert-types.enum";

export const CREATE_REQUEST = gql`
  mutation CreateRequestSetting(
    $url: String!
    $frequency: Float!
    $isActive: Boolean!
    $allErrorsEnabledEmail: Boolean!
    $allErrorsEnabledPush: Boolean!
    $name: String
    $headers: String
    $customEmailErrors: [Float!]
    $customPushErrors: [Float!]
  ) {
    create(
      url: $url
      frequency: $frequency
      isActive: $isActive
      allErrorsEnabledEmail: $allErrorsEnabledEmail
      allErrorsEnabledPush: $allErrorsEnabledPush
      name: $name
      headers: $headers
      customEmailErrors: $customEmailErrors
      customPushErrors: $customPushErrors
    ) {
      id
      url
      name
      frequency
      isActive
      headers
      alerts {
        type
        httpStatusCode
      }
    }
  }
`;

export const UPDATE_REQUEST = gql`
  mutation UpdateRequestSetting(
    $updateRequestSettingId: String!
    $url: String!
    $frequency: Float!
    $name: String
    $headers: String
    $isActive: Boolean!
    $allErrorsEnabledEmail: Boolean!
    $allErrorsEnabledPush: Boolean!
    $customEmailErrors: [Float!]
    $customPushErrors: [Float!]
  ) {
    updateRequestSetting(
      id: $updateRequestSettingId
      url: $url
      frequency: $frequency
      name: $name
      headers: $headers
      isActive: $isActive
      allErrorsEnabledEmail: $allErrorsEnabledEmail
      allErrorsEnabledPush: $allErrorsEnabledPush
      customEmailErrors: $customEmailErrors
      customPushErrors: $customPushErrors
    ) {
      id
      url
      name
      isActive
      createdAt
      updatedAt
      frequency
      headers
      alerts {
        id
        httpStatusCode
        type
      }
    }
  }
`;

type RequestCreationInputs = {
  url: string;
  name: string | undefined | null;
  isActive: boolean;
  frequency: number;
  allErrorsEnabledEmail: boolean;
  allErrorsEnabledPush: boolean;
  customEmailErrors: number[];
  customPushErrors: number[];
  headers: { property: string; value: string }[];
};

enum AlertChoices {
  ALL = "all",
  SPECIFIC = "specific",
}

const RequestCreation = ({
  role,
  existingRequest,
  setRequestDetailsTab,
}: {
  role: string | undefined;
  existingRequest?:
    | GetRequestSettingByIdQuery["getRequestSettingById"]
    | undefined;
  setRequestDetailsTab?: (tab: string) => void;
}) => {
  const [isActive, setIsActive] = useState(true);
  const [frequency, setFrequency] = useState(Frequency.ONE_HOUR);
  const [emailAlerts, setEmailAlerts] = useState<any[] | string>([]);
  const [pushAlerts, setPushAlerts] = useState<any[] | string>([]);

  const [emailSpecificErrors, setEmailSpecificErrors] = useState<number[]>([]);
  const [emailSpecificErrorsInputValue, setEmailSpecificErrorsInputValue] =
    useState(null);

  const [pushSpecificErrors, setPushSpecificErrors] = useState<number[]>([]);
  const [pushSpecificErrorsInputValue, setPushSpecificErrorsInputValue] =
    useState(null);

  const onEmailSpecificErrorChange = (selectedErrors: any) => {
    setEmailSpecificErrorsInputValue(selectedErrors);
    setEmailSpecificErrors(selectedErrors);
  };

  const clearMultiSelectAndEmptyEmailErrorValues = () => {
    setEmailSpecificErrorsInputValue(null);
    setEmailSpecificErrors([]);
    setEmailSpecificErrorRadioIsChecked(false);
  };

  const clearMultiSelectAndEmptyPushErrorValues = () => {
    setPushSpecificErrorsInputValue(null);
    setPushSpecificErrors([]);
    setPushSpecificErrorRadioIsChecked(false);
  };

  const onPushSpecificErrorChange = (selectedErrors: any) => {
    setPushSpecificErrors(selectedErrors);
    setPushSpecificErrorsInputValue(selectedErrors);
  };

  const [
    emailSpecificErrorRadioIsChecked,
    setEmailSpecificErrorRadioIsChecked,
  ] = useState(false);

  const [pushSpecificErrorRadioIsChecked, setPushSpecificErrorRadioIsChecked] =
    useState(false);

  useEffect(() => {
    if (emailSpecificErrors.length) {
      setEmailSpecificErrorRadioIsChecked(true);
    }
  }, [emailSpecificErrors, emailSpecificErrorRadioIsChecked]);

  useEffect(() => {
    if (pushSpecificErrors.length) {
      setPushSpecificErrorRadioIsChecked(true);
    }
  }, [pushSpecificErrors, pushSpecificErrorRadioIsChecked]);

  useEffect(() => {
    if (existingRequest) {
      setIsActive(existingRequest?.requestSetting?.isActive);
      setFrequency(existingRequest?.requestSetting?.frequency);
      setExistingRequestErrors(existingRequest?.requestSetting?.alerts);
    }
  }, [existingRequest]);

  const setExistingRequestErrors = (requestAlerts: any[]) => {
    let emailAlerts = getSpecificErrorsByType(AlertType.EMAIL, requestAlerts);
    let pushAlerts = getSpecificErrorsByType(AlertType.PUSH, requestAlerts);

    setCorrectStateForError(AlertType.EMAIL, emailAlerts);
    setCorrectStateForError(AlertType.PUSH, pushAlerts);
  };

  const setCorrectStateForError = (type: AlertType, alerts: any[]) => {
    const typeIsEmail = type === AlertType.EMAIL;

    // Case with no selected errors
    if (alerts.length === HTTP_ERROR_STATUS_CODES.length) {
      if (typeIsEmail) setEmailAlerts(AlertChoices.ALL);
      else setPushAlerts(AlertChoices.ALL);
    }
    // Case with all selected errors
    else if (!alerts.length) {
      if (typeIsEmail) setEmailAlerts([]);
      else setPushAlerts([]);
    }
    // Case with specific errors
    else {
      if (typeIsEmail) setEmailAlerts(AlertChoices.SPECIFIC);
      else setPushAlerts(AlertChoices.SPECIFIC);
      let existingSpecificErrors = retrieveExistingSpecificErrors(alerts);
      // Simulate OnChange trigger and set existing specific errors
      if (typeIsEmail) onEmailSpecificErrorChange(existingSpecificErrors);
      else onPushSpecificErrorChange(existingSpecificErrors);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RequestCreationInputs>({
    defaultValues: {
      url: existingRequest ? existingRequest?.requestSetting?.url : "",
      name: existingRequest ? existingRequest?.requestSetting?.name : "",
      headers:
        existingRequest?.requestSetting?.headers &&
        existingRequest?.requestSetting?.headers?.length
          ? JSON.parse(existingRequest?.requestSetting?.headers)
          : [],
    },
    criteriaMode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "headers",
  });

  const navigate = useNavigate();

  const [create] = useMutation<
    CreateRequestSettingMutation,
    CreateRequestSettingMutationVariables
  >(CREATE_REQUEST, {
    onCompleted: () => {
      toast.success("Request created successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: 100,
      });
      navigate(REQUESTS_ROUTE);
    },
    onError: (error) => {
      switch (error.message) {
        case URL_ALREADY_EXISTS:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 2,
          });
          break;
        case NAME_ALREADY_EXISTS:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 3,
          });
          break;
        case ARGUMENT_VALIDATION_ERROR:
          toast.error(FORM_CONTAINS_ERRORS, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 4,
          });
          break;
        case FREQUENCY_ONLY_FOR_PREMIUM_USERS:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 5,
          });
          break;
        case ALERTS_ONLY_FOR_PREMIUM_USERS:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 6,
          });
          break;
        case INCORRECT_HEADER_FORMAT:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 7,
          });
          break;
        default:
          toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 8,
          });
      }
    },
  });

  const [update] = useMutation<
    UpdateRequestSettingMutation,
    UpdateRequestSettingMutationVariables
  >(UPDATE_REQUEST, {
    onCompleted: () => {
      toast.success("Request updated successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: 101,
      });
      if (setRequestDetailsTab) setRequestDetailsTab("informations");
      navigate(`${REQUESTS_ROUTE}/${existingRequest?.requestSetting.id}`);
    },
    onError: (error) => {
      switch (error.message) {
        case URL_ALREADY_EXISTS:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 2,
          });
          break;
        case NAME_ALREADY_EXISTS:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 3,
          });
          break;
        case ARGUMENT_VALIDATION_ERROR:
          toast.error(FORM_CONTAINS_ERRORS, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 4,
          });
          break;
        case FREQUENCY_ONLY_FOR_PREMIUM_USERS:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 5,
          });
          break;
        case ALERTS_ONLY_FOR_PREMIUM_USERS:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 6,
          });
          break;
        case INCORRECT_HEADER_FORMAT:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 7,
          });
          break;
        case REQUEST_DOESNT_EXIST:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 8,
          });
          break;
        case UNAUTHORIZED:
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 9,
          });
          break;
        default:
          toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 10,
          });
      }
    },
  });

  const getSpecificErrorsValues = (errors: any[]): number[] => {
    const values: number[] = [];
    errors.forEach((element: any) => {
      values.push(element.value);
    });
    return values;
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    if (existingRequest) {
      await update({
        variables: {
          updateRequestSettingId: existingRequest?.requestSetting?.id,
          url: data.url,
          frequency: frequency,
          isActive: data.isActive === "true" ? true : false,
          allErrorsEnabledEmail:
            emailAlerts === AlertChoices.ALL ? true : false,
          allErrorsEnabledPush: pushAlerts === AlertChoices.ALL ? true : false,
          customEmailErrors: getSpecificErrorsValues(emailSpecificErrors),
          customPushErrors: getSpecificErrorsValues(pushSpecificErrors),
          name: data.name?.length ? data.name : undefined,
          headers: data.headers.length
            ? JSON.stringify(data.headers)
            : undefined,
        },
      });
    } else {
      await create({
        variables: {
          url: data.url,
          frequency: parseInt(data.frequency),
          isActive: data.isActive === "true" ? true : false,
          allErrorsEnabledEmail:
            data.allErrorsEnabledEmail === "true" ? true : false,
          allErrorsEnabledPush:
            data.allErrorsEnabledPush === "true" ? true : false,
          customEmailErrors: getSpecificErrorsValues(emailSpecificErrors),
          customPushErrors: getSpecificErrorsValues(pushSpecificErrors),
          name: data.name?.length ? data.name : undefined,
          headers: data.headers.length
            ? JSON.stringify(data.headers)
            : undefined,
        },
      });
    }
  };

  return (
    <div
      className={`${styles.contentContainer} ${
        existingRequest ? "pt-md-0" : ""
      }`}
    >
      {existingRequest ? (
        <></>
      ) : (
        <h1 className={`${styles.pageTitle}`}>Request creation</h1>
      )}

      <form
        className={`${
          existingRequest ? "" : "mt-5"
        } d-flex flex-wrap gap-5 gap-md-3`}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* General */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-info-circle"></i>General
          </h2>
          <div className={`${styles.formContent}`}>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="url"
                placeholder={URL_PLACEHOLDER}
                {...register("url", {
                  required: URL_IS_REQUIRED_ERROR_MESSAGE,
                  pattern: {
                    value: URL_REG_EXP,
                    message: URL_PATTERN_ERROR_MESSAGE,
                  },
                })}
              />
              <label htmlFor="url">URL</label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage errors={errors} name={"url"} />
            </div>

            <div className="form-floating mt-3 mb-2">
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder={NAME_PLACEHOLDER}
                {...register("name", {
                  minLength: {
                    value: NAME_MIN_LENGTH,
                    message: NAME_MIN_LENGTH_ERROR_MESSAGE,
                  },
                  maxLength: {
                    value: NAME_MAX_LENGTH,
                    message: NAME_MAX_LENGTH_ERROR_MESSAGE,
                  },
                })}
              />
              <label htmlFor="name">Name</label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage errors={errors} name={"name"} />
            </div>
          </div>
        </div>

        {/* State */}
        <div className={`col ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-toggle-on"></i> State
          </h2>
          <div className={`${styles.formContent}`}>
            <div className={`${styles.stateInformationMessage} mb-3`}>
              {isActive ? (
                <>
                  <i
                    className={`${styles.activeStateIcon} bi bi-check-circle me-2`}
                  ></i>
                  Request will be active directly after saving. You have nothing
                  more to do !
                </>
              ) : (
                <>
                  <i
                    className={`${styles.inactiveStateIcon} bi bi-x-circle me-2`}
                  ></i>
                  Request will be inactive after saving. Note that you'll need
                  to activate it manually.
                </>
              )}
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                id="stateActive"
                value="true"
                {...register("isActive")}
                checked={isActive === true}
                onClick={() => setIsActive(true)}
              />
              <label className="form-check-label" htmlFor="stateActive">
                Active
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="stateInactive"
                value="false"
                {...register("isActive")}
                checked={isActive === false}
                onClick={() => setIsActive(false)}
              />
              <label className="form-check-label" htmlFor="stateInactive">
                Inactive
              </label>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-4`}>
            <i className="bi bi-activity"></i> Execution frequency
          </h2>
          <div className={`${styles.formContent}`}>
            {/* Days */}
            <p className={styles.frequencyLabel}>Days</p>
            <div className="d-flex justify-content-around mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="day30"
                  value={Frequency.THIRTY_DAYS}
                  {...register("frequency")}
                  checked={frequency === Frequency.THIRTY_DAYS}
                  onClick={() => setFrequency(Frequency.THIRTY_DAYS)}
                />
                <label className="form-check-label" htmlFor="day30">
                  30 days
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="day7"
                  value={Frequency.SEVEN_DAYS}
                  {...register("frequency")}
                  checked={frequency === Frequency.SEVEN_DAYS}
                  onClick={() => setFrequency(Frequency.SEVEN_DAYS)}
                />
                <label className="form-check-label" htmlFor="day7">
                  7 days
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="day1"
                  value={Frequency.ONE_DAY}
                  {...register("frequency")}
                  checked={frequency === Frequency.ONE_DAY}
                  onClick={() => setFrequency(Frequency.ONE_DAY)}
                />
                <label className="form-check-label" htmlFor="day1">
                  1 day
                </label>
              </div>
            </div>

            {/*  Hours */}
            <p className={styles.frequencyLabel}>Hours</p>
            <div className="d-flex justify-content-around mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="hr12"
                  value={Frequency.TWELVE_HOURS}
                  {...register("frequency")}
                  checked={frequency === Frequency.TWELVE_HOURS}
                  onClick={() => setFrequency(Frequency.TWELVE_HOURS)}
                />
                <label className="form-check-label" htmlFor="hr12">
                  12 hrs
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="hr6"
                  value={Frequency.SIX_HOURS}
                  {...register("frequency")}
                  checked={frequency === Frequency.SIX_HOURS}
                  onClick={() => setFrequency(Frequency.SIX_HOURS)}
                />
                <label className="form-check-label" htmlFor="hr6">
                  6 hrs
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="hr1"
                  value={Frequency.ONE_HOUR}
                  {...register("frequency")}
                  checked={frequency === Frequency.ONE_HOUR}
                  onClick={() => setFrequency(Frequency.ONE_HOUR)}
                />
                <label className="form-check-label" htmlFor="hr1">
                  1 hr
                </label>
              </div>
            </div>

            {/*  Minutes */}
            <p
              className={styles.frequencyLabel}
              title={
                role === "premium"
                  ? ""
                  : "You must be Premium to unlock these options"
              }
            >
              Minutes{" "}
              {role === "premium" ? (
                ""
              ) : (
                <i className={`${styles.premiumIcon} ms-2 bi bi-star-fill`}></i>
              )}
            </p>
            <div className="d-flex justify-content-around mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="mn30"
                  value={Frequency.THIRTY_MINUTES}
                  {...register("frequency")}
                  disabled={role !== "premium"}
                  checked={frequency === Frequency.THIRTY_MINUTES}
                  onClick={() => setFrequency(Frequency.THIRTY_MINUTES)}
                />
                <label className="form-check-label" htmlFor="mn30">
                  30 mn
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="mn15"
                  value={Frequency.FIFTEEN_MINUTES}
                  {...register("frequency")}
                  disabled={role !== "premium"}
                  checked={frequency === Frequency.FIFTEEN_MINUTES}
                  onClick={() => setFrequency(Frequency.FIFTEEN_MINUTES)}
                />
                <label className="form-check-label" htmlFor="mn15">
                  15 mn
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="mn1"
                  value={Frequency.ONE_MINUTE}
                  {...register("frequency")}
                  disabled={role !== "premium"}
                  checked={frequency === Frequency.ONE_MINUTE}
                  onClick={() => setFrequency(Frequency.ONE_MINUTE)}
                />
                <label className="form-check-label" htmlFor="mn1">
                  1 mn
                </label>
              </div>
            </div>

            {/* Seconds */}
            <p
              className={styles.frequencyLabel}
              title={
                role === "premium"
                  ? ""
                  : "You must be Premium to unlock these options"
              }
            >
              Seconds{" "}
              {role === "premium" ? (
                ""
              ) : (
                <i className={`${styles.premiumIcon} ms-2 bi bi-star-fill`}></i>
              )}
            </p>
            <div className="d-flex justify-content-around">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="sec30"
                  value={Frequency.THIRTY_SECONDS}
                  {...register("frequency")}
                  disabled={role !== "premium"}
                  checked={frequency === Frequency.THIRTY_SECONDS}
                  onClick={() => setFrequency(Frequency.THIRTY_SECONDS)}
                />
                <label className="form-check-label" htmlFor="sec30">
                  30 sec
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="sec15"
                  value={Frequency.FIFTEEN_SECONDS}
                  {...register("frequency")}
                  disabled={role !== "premium"}
                  checked={frequency === Frequency.FIFTEEN_SECONDS}
                  onClick={() => setFrequency(Frequency.FIFTEEN_SECONDS)}
                />
                <label className="form-check-label" htmlFor="sec15">
                  15 sec
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="sec5"
                  value={Frequency.FIVE_SECONDS}
                  {...register("frequency")}
                  disabled={role !== "premium"}
                  checked={frequency === Frequency.FIVE_SECONDS}
                  onClick={() => setFrequency(Frequency.FIVE_SECONDS)}
                />
                <label className="form-check-label" htmlFor="sec5">
                  5 sec
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className={`col ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-4`}>
            <i className="bi bi-bell"></i> Alerts
          </h2>
          <div className={`${styles.formContent}`}>
            {/* Email */}

            {/* No email */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                value="false"
                {...register("allErrorsEnabledEmail")}
                id="flexRadioDefault1"
                checked={typeof emailAlerts !== "string" && !emailAlerts.length}
                onClick={() => {
                  clearMultiSelectAndEmptyEmailErrorValues();
                  setEmailAlerts([]);
                }}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                No email alert
              </label>
            </div>

            {/* All email */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                value="true"
                {...register("allErrorsEnabledEmail")}
                id="flexRadioDefault1"
                onChange={() => {
                  clearMultiSelectAndEmptyEmailErrorValues();
                  setEmailAlerts(AlertChoices.ALL);
                }}
                checked={emailAlerts === AlertChoices.ALL}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Receive email on error 4XX and 5XX
              </label>
            </div>

            {/* Specific email */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                {...register("allErrorsEnabledEmail")}
                id="flexRadioDefault2"
                disabled={role !== "premium"}
                checked={
                  emailSpecificErrorRadioIsChecked ||
                  emailAlerts === AlertChoices.SPECIFIC
                }
                onChange={() => {
                  setEmailSpecificErrorRadioIsChecked(
                    !emailSpecificErrorRadioIsChecked
                  );
                  setEmailAlerts(AlertChoices.SPECIFIC);
                }}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Receive email on specific error(s)
              </label>
              {role === "premium" ? (
                ""
              ) : (
                <span>
                  <i
                    className={`${styles.premiumIcon} ms-2 bi bi-star-fill`}
                  ></i>
                </span>
              )}
            </div>
            <Select
              isMulti
              value={emailSpecificErrorsInputValue}
              placeholder="Select specific error(s)..."
              isDisabled={role !== "premium"}
              name="emailSpecificErrors"
              options={HTTP_ERROR_STATUS_CODES}
              className={`${styles.emailSpecificErrors} basic-multi-select`}
              classNamePrefix="select"
              onChange={(selectedErrors) => {
                onEmailSpecificErrorChange(selectedErrors);
                setEmailAlerts(AlertChoices.SPECIFIC);
              }}
            />

            {/* Push */}

            {/* No push */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                value="false"
                {...register("allErrorsEnabledPush")}
                id="flexRadioDefault1"
                checked={typeof pushAlerts !== "string" && !pushAlerts.length}
                onClick={() => {
                  setPushAlerts([]);
                  clearMultiSelectAndEmptyPushErrorValues();
                }}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                No push notification
              </label>
            </div>

            {/* All push */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                value="true"
                {...register("allErrorsEnabledPush")}
                id="flexRadioDefault1"
                onChange={() => {
                  setPushAlerts(AlertChoices.ALL);
                  clearMultiSelectAndEmptyPushErrorValues();
                }}
                checked={pushAlerts === AlertChoices.ALL}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Push notification on error 4XX and 5XX
              </label>
            </div>

            {/* Specific push */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                {...register("allErrorsEnabledPush")}
                id="flexRadioDefault2"
                disabled={role !== "premium"}
                checked={
                  pushSpecificErrorRadioIsChecked ||
                  pushAlerts === AlertChoices.SPECIFIC
                }
                onChange={() => {
                  setPushSpecificErrorRadioIsChecked(
                    !pushSpecificErrorRadioIsChecked
                  );
                  setPushAlerts(AlertChoices.SPECIFIC);
                }}
              />

              <label
                className={` ${styles.inline} form-check-label`}
                htmlFor="flexRadioDefault2"
              >
                Push notification on specific error(s)
              </label>
              {role === "premium" ? (
                ""
              ) : (
                <span>
                  <i
                    className={`${styles.premiumIcon} ms-2 bi bi-star-fill`}
                  ></i>
                </span>
              )}
            </div>
            <Select
              isMulti
              value={pushSpecificErrorsInputValue}
              isDisabled={role !== "premium"}
              placeholder="Select specific error(s)..."
              name="pushSpecificErrors"
              options={HTTP_ERROR_STATUS_CODES}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selectedErrors) => {
                onPushSpecificErrorChange(selectedErrors);
                setPushAlerts(AlertChoices.SPECIFIC);
              }}
            />
          </div>
        </div>

        {/* Headers */}
        <div className={`col-12 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-4`}>
            <i className="bi bi-card-heading"></i> Headers
          </h2>
          <div className={`${styles.formContent}`}>
            {fields.map((field, index) => (
              <div key={field.id} className="row g-2 mb-3">
                <div className="col-md">
                  <div className="form-floating mb-2">
                    <input
                      {...register(`headers.${index}.property`, {
                        required: {
                          value: true,
                          message: URL_HEADER_ERROR_MESSAGE,
                        },
                      })}
                      type="text"
                      className="form-control"
                      placeholder="content-type"
                    />
                    <label>Property</label>
                  </div>
                  <div className={styles.errorMessage}>
                    <FormErrorMessage
                      errors={errors}
                      name={`headers.${index}.property`}
                    />
                  </div>
                </div>
                <div className="col-md">
                  <div className="form-floating mb-2">
                    <input
                      {...register(`headers.${index}.value`, {
                        required: {
                          value: true,
                          message: URL_HEADER_ERROR_MESSAGE,
                        },
                      })}
                      type="text"
                      className="form-control"
                      placeholder="content-type"
                    />
                    <label>Value</label>
                  </div>
                  <div className={styles.errorMessage}>
                    <FormErrorMessage
                      errors={errors}
                      name={`headers.${index}.value`}
                    />
                  </div>
                </div>

                <div
                  onClick={() => remove(index)}
                  className={`${styles.removeHeaderIcon} col-1 d-flex justify-content-center align-items-center`}
                >
                  <i className="bi bi-trash3"></i>
                </div>
                <p
                  onClick={() => remove(index)}
                  className={`${styles.deleteHeaderText} text-center mt-1 mb-4`}
                >
                  Delete above header
                </p>
              </div>
            ))}
            <p
              className={styles.addHeaderBtn}
              onClick={() => {
                append({
                  property: "",
                  value: "",
                });
              }}
            >
              {fields.length ? (
                <span>
                  <i className="bi bi-plus-circle me-1"></i> Add another header
                </span>
              ) : (
                <span>
                  <i className="bi bi-plus-circle me-1"></i> Add your first
                  request header
                </span>
              )}
            </p>
          </div>
        </div>

        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <button
            type="reset"
            onClick={() => navigate(REQUESTS_ROUTE)}
            className={`${styles.btn} ${styles.btnSecondary} my-md-4`}
          >
            Cancel
          </button>
        </div>

        <div className={`col ${styles.formContainer}`}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary} my-md-4`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestCreation;
