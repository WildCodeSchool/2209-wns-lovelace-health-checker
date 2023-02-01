import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";
import styles from "./RequestCreation.module.scss";

const RequestCreation = () => {
  return (
    <div className={`${styles.contentContainer}`}>
      <h1 className={`${styles.pageTitle}`}>Request creation</h1>
      <form className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        {/* General */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header}`}>
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
          <h2 className={`${styles.header}`}>
            <i className="bi bi-toggle-on"></i> State
          </h2>
          <div className={`${styles.formContent}`}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">Firstname</label>
            </div>
            {/*             <div className={styles.errorMessage}>
              <FormErrorMessage errors={errorsIdentity} name={"firstname"} />
            </div> */}
            <div className="form-floating mb">
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">Firstname</label>
            </div>
            {/*             <div className={styles.errorMessage}>
              <FormErrorMessage errors={errorsIdentity} name={"lastname"} />
            </div> */}
          </div>
        </div>

        {/* Frequency */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header}`}>
            <i className="bi bi-activity"></i> Frequency
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

        {/* Alerts */}
        <div className={`col ${styles.formContainer}`}>
          <h2 className={`${styles.header}`}>
            <i className="bi bi-bell"></i> Alerts
          </h2>
          <div className={`${styles.formContent}`}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">Firstname</label>
            </div>
            {/*             <div className={styles.errorMessage}>
              <FormErrorMessage errors={errorsIdentity} name={"firstname"} />
            </div> */}
            <div className="form-floating mb">
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="URL"
              />
              <label htmlFor="firstname">Firstname</label>
            </div>
            {/*             <div className={styles.errorMessage}>
              <FormErrorMessage errors={errorsIdentity} name={"lastname"} />
            </div> */}
          </div>
        </div>

        {/* Headers */}
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header}`}>
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
          </div>
        </div>

        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <button className={`${styles.btn} ${styles.btnSecondary} mb-3`}>
            Cancel
          </button>
        </div>

        {/* Alerts */}
        <div className={`col ${styles.formContainer}`}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Save</button>
        </div>
      </form>
    </div>
  );
};

export default RequestCreation;
