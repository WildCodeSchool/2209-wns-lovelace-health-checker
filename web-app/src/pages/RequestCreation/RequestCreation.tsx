import { useEffect, useState } from "react";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";
import styles from "./RequestCreation.module.scss";
import Select from "react-select";
import { HTTP_ERROR_STATUS_CODES } from "../../utils/http-error-status-codes.enum";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import {
  CreateRequestSettingMutation,
  CreateRequestSettingMutationVariables,
} from "../../gql/graphql";
import { Frequency } from "../../utils/request-frequency.enum";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

type RequestCreationInputs = {
  url: string;
  name: string;
  isActive: boolean;
  frequency: number;
  allErrorsEnabledEmail: boolean;
  allErrorsEnabledPush: boolean;
  customEmailErrors: number[];
  customPushErrors: number[];
  headers: { property: string; value: string }[];
};

const RequestCreation = () => {
  const [requestIsActive, setRequestIsActive] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const [emailSpecificErrors, setEmailSpecificErrors] = useState([]);
  const [emailSpecificErrorsInputValue, setEmailSpecificErrorsInputValue] =
    useState(null);

  const [pushSpecificErrors, setPushSpecificErrors] = useState([]);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RequestCreationInputs>({
    criteriaMode: "all",
    defaultValues: {
      isActive: true,
      frequency: 3600,
      allErrorsEnabledEmail: false,
      allErrorsEnabledPush: false,
      customEmailErrors: [],
      customPushErrors: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "headers",
  });

  const navigate = useNavigate();

  const [create, { data, loading }] = useMutation<
    CreateRequestSettingMutation,
    CreateRequestSettingMutationVariables
  >(CREATE_REQUEST, {
    onCompleted: () => {
      toast.success("Request created successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: 1,
      });
      navigate("/requests");
    },
    onError: (error) => {},
  });

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const allErrorsEnabledEmail =
      data.allErrorsEnabledEmail === "true" ? true : false;

    const allErrorsEnabledPush =
      data.allErrorsEnabledPush === "true" ? true : false;

    const getEmailSpecificErrorsValues = (): number[] => {
      const values: number[] = [];
      emailSpecificErrors.forEach((element: any) => {
        values.push(element.value);
      });
      return values;
    };

    const getPushSpecificErrorsValues = (): number[] => {
      const values: number[] = [];
      pushSpecificErrors.forEach((element: any) => {
        values.push(element.value);
      });
      return values;
    };

    await create({
      variables: {
        url: data.url,
        frequency: parseInt(data.frequency),
        isActive: requestIsActive,
        allErrorsEnabledEmail: allErrorsEnabledEmail,
        allErrorsEnabledPush: allErrorsEnabledPush,
        customEmailErrors: getEmailSpecificErrorsValues(),
        customPushErrors: getPushSpecificErrorsValues(),
        name: data.name.length ? data.name : undefined,
        headers: data.headers.length ? JSON.stringify(data.headers) : undefined,
      },
    });

    console.log({
      url: data.url,
      frequency: parseInt(data.frequency),
      isActive: requestIsActive,
      allErrorsEnabledEmail: allErrorsEnabledEmail,
      allErrorsEnabledPush: allErrorsEnabledPush,
      customEmailErrors: getEmailSpecificErrorsValues(),
      customPushErrors: getPushSpecificErrorsValues(),
      name: data.name,
      headers: JSON.stringify(data.headers),
    });
  };

  return (
    <div className={`${styles.contentContainer}`}>
      <h1 className={`${styles.pageTitle}`}>Request creation</h1>
      <div onClick={() => setIsPremium(!isPremium)}>Toggle Premium</div>
      <form
        className="mt-5 d-flex flex-wrap gap-5 gap-md-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* General */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-info-circle"></i> General
          </h2>
          <div className={`${styles.formContent}`}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="url"
                placeholder="URL"
                {...register("url")}
              />
              <label htmlFor="url">URL</label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage errors={errors} name={"lastname"} />
            </div>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="name"
                {...register("name")}
              />
              <label htmlFor="name">Name</label>
            </div>
            {/*             <div className={styles.errorMessage}>
              <FormErrorMessage errors={errorsIdentity} name={"lastname"} />
            </div> */}
          </div>
        </div>

        {/* State */}
        <div className={`col ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-toggle-on"></i> State
          </h2>
          <div className={`${styles.formContent}`}>
            <div className={`${styles.stateInformationMessage} mb-3`}>
              {requestIsActive ? (
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
            <div
              className={`${styles.btn} ${styles.btnSecondary} d-flex justify-content-center align-items-center mt-3 mt`}
              onClick={() => setRequestIsActive(!requestIsActive)}
            >
              {requestIsActive ? "Deactivate" : "Activate"}
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-4`}>
            <i className="bi bi-activity"></i> Frequency
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
                  defaultChecked
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
                isPremium ? "" : "You must be Premium to unlock these options"
              }
            >
              Minutes{" "}
              {isPremium ? (
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
                  disabled={!isPremium}
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
                  disabled={!isPremium}
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
                  disabled={!isPremium}
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
                isPremium ? "" : "You must be Premium to unlock these options"
              }
            >
              Seconds{" "}
              {isPremium ? (
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
                  disabled={!isPremium}
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
                  disabled={!isPremium}
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
                  disabled={!isPremium}
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
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                value="false"
                {...register("allErrorsEnabledEmail")}
                id="flexRadioDefault1"
                defaultChecked
                onClick={clearMultiSelectAndEmptyEmailErrorValues}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                No email alert
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                value="true"
                {...register("allErrorsEnabledEmail")}
                id="flexRadioDefault1"
                onChange={clearMultiSelectAndEmptyEmailErrorValues}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Receive email on error 4XX and 5XX
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                {...register("allErrorsEnabledEmail")}
                id="flexRadioDefault2"
                disabled={!isPremium}
                checked={emailSpecificErrorRadioIsChecked}
                onChange={() =>
                  setEmailSpecificErrorRadioIsChecked(
                    !emailSpecificErrorRadioIsChecked
                  )
                }
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Receive email on specific error(s)
              </label>
              {isPremium ? (
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
              isDisabled={!isPremium}
              name="emailSpecificErrors"
              options={HTTP_ERROR_STATUS_CODES}
              className={`${styles.emailSpecificErrors} basic-multi-select`}
              classNamePrefix="select"
              onChange={(selectedErrors) =>
                onEmailSpecificErrorChange(selectedErrors)
              }
            />

            {/* Push */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                value="false"
                {...register("allErrorsEnabledPush")}
                id="flexRadioDefault1"
                defaultChecked
                onClick={clearMultiSelectAndEmptyPushErrorValues}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                No push notification
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                value="true"
                {...register("allErrorsEnabledPush")}
                id="flexRadioDefault1"
                onChange={clearMultiSelectAndEmptyPushErrorValues}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Push notification on error 4XX and 5XX
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                {...register("allErrorsEnabledPush")}
                id="flexRadioDefault2"
                disabled={!isPremium}
                checked={pushSpecificErrorRadioIsChecked}
                onChange={() =>
                  setPushSpecificErrorRadioIsChecked(
                    !pushSpecificErrorRadioIsChecked
                  )
                }
              />
              <label
                className={` ${styles.inline} form-check-label`}
                htmlFor="flexRadioDefault2"
              >
                Push notification on specific error(s)
              </label>
              {isPremium ? (
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
              isDisabled={!isPremium}
              placeholder="Select specific error(s)..."
              name="pushSpecificErrors"
              options={HTTP_ERROR_STATUS_CODES}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selectedErrors) =>
                onPushSpecificErrorChange(selectedErrors)
              }
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
                  <div className="form-floating">
                    <input
                      {...register(`headers.${index}.property`, {
                        required: {
                          value: true,
                          message: "This field couln't be empty",
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
                  <div className="form-floating">
                    <input
                      {...register(`headers.${index}.value`, {
                        required: true,
                      })}
                      type="text"
                      className="form-control"
                      placeholder="content-type"
                    />
                    <label>Value</label>
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
                  className={`${styles.deleteHeaderText} text-center mt-2`}
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
          <button className={`${styles.btn} ${styles.btnSecondary} my-md-4`}>
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
