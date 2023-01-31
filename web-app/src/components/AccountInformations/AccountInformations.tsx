import { useForm } from 'react-hook-form';

import {
  EMAIL_IS_REQUIRED_ERROR_MESSAGE,
  EMAIL_MAX_LENGTH,
  EMAIL_MAX_LENGTH_ERROR_MESSAGE,
  EMAIL_PLACEHOLDER,
  FIRSTNAME_IS_REQUIRED_ERROR_MESSAGE,
  FIRSTNAME_MAX_LENGTH,
  FIRSTNAME_MAX_LENGTH_ERROR_MESSAGE,
  FIRSTNAME_MIN_LENGTH,
  FIRSTNAME_MIN_LENGTH_ERROR_MESSAGE,
  FIRSTNAME_PLACEHOLDER,
  LASTNAME_IS_REQUIRED_ERROR_MESSAGE,
  LASTNAME_MAX_LENGTH,
  LASTNAME_MAX_LENGTH_ERROR_MESSAGE,
  LASTNAME_MIN_LENGTH,
  LASTNAME_MIN_LENGTH_ERROR_MESSAGE,
  LASTNAME_PLACEHOLDER,
  PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_PATTERN_ERROR_MESSAGE,
} from '../../utils/form-validations';
import { passwordRegExp } from '../../utils/regular-expressions';
import FormErrorMessage from '../ErrorMessage/FormErrorMessage';
import styles from './AccountInformations.module.scss';

const AccountInformations = (user: any) => {
  const {
    register,

    formState: { errors },
  } = useForm();

  console.log(user.user.firstname);

  return (
    <>
      <div className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <div className={`${styles.header}`}>
            <i className="bi bi-person"></i> Personnal informations
          </div>
          <div className={`${styles.formContent}`}>
            <form>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  defaultValue={user.user.firstname}
                  className="form-control"
                  {...register("firstname", {
                    required: FIRSTNAME_IS_REQUIRED_ERROR_MESSAGE,
                    maxLength: {
                      value: FIRSTNAME_MAX_LENGTH,
                      message: FIRSTNAME_MAX_LENGTH_ERROR_MESSAGE,
                    },
                    minLength: {
                      value: FIRSTNAME_MIN_LENGTH,
                      message: FIRSTNAME_MIN_LENGTH_ERROR_MESSAGE,
                    },
                  })}
                  id="firstname"
                  placeholder={FIRSTNAME_PLACEHOLDER}
                />
                <label htmlFor="firstname">Firstname</label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage errors={errors} name={"firstname"} />
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  defaultValue={""}
                  className="form-control"
                  {...register("lastname", {
                    required: LASTNAME_IS_REQUIRED_ERROR_MESSAGE,
                    maxLength: {
                      value: LASTNAME_MAX_LENGTH,
                      message: LASTNAME_MAX_LENGTH_ERROR_MESSAGE,
                    },
                    minLength: {
                      value: LASTNAME_MIN_LENGTH,
                      message: LASTNAME_MIN_LENGTH_ERROR_MESSAGE,
                    },
                  })}
                  id="lastname"
                  placeholder={LASTNAME_PLACEHOLDER}
                />
                <label htmlFor="lastname">Lastname</label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage errors={errors} name={"lastname"} />
              </div>

              <button className={`${styles.mainButton}`}>Save</button>
            </form>
          </div>
        </div>
        <div className={` col ${styles.formContainer}`}>
          <div className={`${styles.header}`}>
            <i className="bi bi-envelope"></i> Change your email
          </div>
          <div className={`${styles.formContent}`}>
            <form>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  defaultValue={""}
                  className="form-control"
                  {...register("email", {
                    required: EMAIL_IS_REQUIRED_ERROR_MESSAGE,
                    maxLength: {
                      value: EMAIL_MAX_LENGTH,
                      message: EMAIL_MAX_LENGTH_ERROR_MESSAGE,
                    },
                  })}
                  id="email"
                  placeholder={EMAIL_PLACEHOLDER}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage errors={errors} name={"email"} />
              </div>
              <button className={`${styles.mainButton}`}>
                Change your email
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <div className={`${styles.header}`}>
            <i className="bi bi-lock-fill"></i> Change your password
          </div>
          <div className={`${styles.formContent}`}>
            <form>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...register("currentPassword", {
                    required: PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
                    pattern: {
                      value: passwordRegExp,
                      message: PASSWORD_PATTERN_ERROR_MESSAGE,
                    },
                  })}
                  id="currentPassword"
                  placeholder={EMAIL_PLACEHOLDER}
                />
                <label htmlFor="currentPassword">Current Password</label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage errors={errors} name={"currentPassword"} />
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...register("newPassword", {
                    required: PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
                    pattern: {
                      value: passwordRegExp,
                      message: PASSWORD_PATTERN_ERROR_MESSAGE,
                    },
                  })}
                  id="newPassword"
                  placeholder={EMAIL_PLACEHOLDER}
                />
                <label htmlFor="newPassword">New Password</label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage errors={errors} name={"newPassword"} />
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...register("newConfirmationPassword", {
                    required: PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
                    pattern: {
                      value: passwordRegExp,
                      message: PASSWORD_PATTERN_ERROR_MESSAGE,
                    },
                  })}
                  id="newConfirmationPassword"
                  placeholder={EMAIL_PLACEHOLDER}
                />
                <label htmlFor="newConfirmationPassword">
                  New Password Confirmation
                </label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage errors={errors} name={"newPassword"} />
              </div>
              <button className={`${styles.mainButton}`}>
                Change password
              </button>
            </form>
          </div>
        </div>
        <div className={`col ${styles.formContainer}`}>
          <div className={`${styles.header}`}>
            <i className="bi bi-exclamation-triangle"></i> Danger zone
          </div>
          <div className={`${styles.dangerZone}`}>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam
              eaque laudantium itaque quod repellat illo nemo saepe ea non
              obcaecati labore modi tenetur, sint cum dolorum tempore, omnis
              quisquam architecto.
            </p>
            <button className={`${styles.dangerButton}`}>
              Delete your account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountInformations;
