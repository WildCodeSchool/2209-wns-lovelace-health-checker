import { useState } from "react";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";
import styles from "./RequestCreation.module.scss";
import Select from "react-select";
import { HTTP_ERROR_STATUS_CODES } from "../../utils/http-error-status-codes.enum";

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
  };

  const clearMultiSelectAndEmptyPushErrorValues = () => {
    setPushSpecificErrorsInputValue(null);
    setPushSpecificErrors([]);
  };

  const onPushSpecificErrorChange = (selectedErrors: any) => {
    setPushSpecificErrors(selectedErrors);
    setPushSpecificErrorsInputValue(selectedErrors);
  };

  return (
    <div className={`${styles.contentContainer}`}>
      <h1 className={`${styles.pageTitle}`}>Request creation</h1>
      <div onClick={() => setIsPremium(!isPremium)}>Toggle Premium</div>
      <form className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
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
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">URL</label>
            </div>
            {/*             <div className={styles.errorMessage}>
              <FormErrorMessage errors={errorsIdentity} name={"firstname"} />
            </div> */}
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">Name</label>
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
                  name="frequencySelection"
                  id="day30"
                />
                <label className="form-check-label" htmlFor="day30">
                  30 days
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="frequencySelection"
                  id="day7"
                />
                <label className="form-check-label" htmlFor="day7">
                  7 days
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="frequencySelection"
                  id="day1"
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
                  name="frequencySelection"
                  id="hr12"
                />
                <label className="form-check-label" htmlFor="hr12">
                  12 hrs
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="frequencySelection"
                  id="hr6"
                />
                <label className="form-check-label" htmlFor="hr6">
                  6 hrs
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="frequencySelection"
                  id="hr1"
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
                  name="frequencySelection"
                  id="mn30"
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
                  name="frequencySelection"
                  id="mn15"
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
                  name="frequencySelection"
                  id="mn1"
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
                  name="frequencySelection"
                  id="sec30"
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
                  name="frequencySelection"
                  id="sec15"
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
                  name="frequencySelection"
                  id="sec5"
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
                name="emailAlerts"
                id="flexRadioDefault1"
                defaultChecked
                onChange={clearMultiSelectAndEmptyEmailErrorValues}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                No email alert
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="emailAlerts"
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
                name="emailAlerts"
                id="flexRadioDefault2"
                disabled={!isPremium}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Receive email on specific error(s){" "}
              </label>{" "}
              {isPremium ? (
                ""
              ) : (
                <i className={`${styles.premiumIcon} ms-2 bi bi-star-fill`}></i>
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
                name="pushAlerts"
                id="flexRadioDefault1"
                defaultChecked
                onChange={clearMultiSelectAndEmptyPushErrorValues}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                No push notification
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="pushAlerts"
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
                name="pushAlerts"
                id="flexRadioDefault2"
                disabled={!isPremium}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Push notification on specific error(s){" "}
              </label>{" "}
              {isPremium ? (
                ""
              ) : (
                <i className={`${styles.premiumIcon} ms-2 bi bi-star-fill`}></i>
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
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-4`}>
            <i className="bi bi-card-heading"></i> Headers
          </h2>
          <div className={`${styles.formContent}`}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">URL</label>
            </div>
            {/*             <div className={styles.errorMessage}>
              <FormErrorMessage errors={errorsIdentity} name={"firstname"} />
            </div> */}
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">Name</label>
            </div>
            {/*             <div className={styles.errorMessage}>
              <FormErrorMessage errors={errorsIdentity} name={"lastname"} />
            </div> */}
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">Name</label>
            </div>
          </div>
        </div>

        <div className={`col ${styles.formContainer}`}></div>

        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <button className={`${styles.btn} ${styles.btnSecondary} my-md-4`}>
            Cancel
          </button>
        </div>

        <div className={`col ${styles.formContainer}`}>
          <button className={`${styles.btn} ${styles.btnPrimary} my-md-4`}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestCreation;
