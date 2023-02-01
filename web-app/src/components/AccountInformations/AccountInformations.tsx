import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  UpdateIdentityMutation,
  UpdateIdentityMutationVariables,
  UpdatePasswordMutation,
  UpdatePasswordMutationVariables,
} from '../../gql/graphql';
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
  PASSWORD_CONFIRMATION_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_CONFIRMATION_PLACEHOLDER,
  PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_PATTERN_ERROR_MESSAGE,
} from '../../utils/form-validations';
import { PASSWORD_REG_EXP } from '../../utils/regular-expressions';
import FormErrorMessage from '../ErrorMessage/FormErrorMessage';
import styles from './AccountInformations.module.scss';

const AccountInformations = (user: any) => {
  const {
    register: registerIdentity,
    handleSubmit: handleSubmitIdentity,
    formState: { errors: errorsIdentity },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm();

  const onSubmitPassword = async (data: any) => {
    await updatePassword({
      variables: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        newPasswordConfirmation: data.newPasswordConfirmation,
        disconnectMe: data.disconnectMe,
      },
    });
  };

  const onSubmitIdentity = (data: any) => {
    updateIdentity({
      variables: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
    });
  };

  const onSubmitEmail = (data: any) => {
    console.log(data);
  };

  const UPDATE_IDENTITY = gql`
    mutation UpdateIdentity($lastname: String!, $firstname: String!) {
      updateIdentity(lastname: $lastname, firstname: $firstname) {
        lastname
        firstname
      }
    }
  `;

  const [updateIdentity] = useMutation<
    UpdateIdentityMutation,
    UpdateIdentityMutationVariables
  >(UPDATE_IDENTITY, {
    onCompleted: (data) => {
      console.log(data);
      toast.success(
        data.updateIdentity.firstname + " " + data.updateIdentity.lastname
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const UPDATE_PASSWORD = gql`
    mutation UpdatePassword(
      $currentPassword: String!
      $newPassword: String!
      $newPasswordConfirmation: String!
      $disconnectMe: Boolean!
    ) {
      updatePassword(
        currentPassword: $currentPassword
        newPassword: $newPassword
        newPasswordConfirmation: $newPasswordConfirmation
        disconnectMe: $disconnectMe
      )
    }
  `;

  const [updatePassword] = useMutation<
    UpdatePasswordMutation,
    UpdatePasswordMutationVariables
  >(UPDATE_PASSWORD, {
    onCompleted: (data) => {
      console.log(data.updatePassword);
      resetPassword();
      toast.success(data.updatePassword);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <div className={`${styles.header}`}>
            <i className="bi bi-person"></i> Personnal informations
          </div>
          <div className={`${styles.formContent}`}>
            <form onSubmit={handleSubmitIdentity(onSubmitIdentity)}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  defaultValue={user.user.firstname}
                  className="form-control"
                  {...registerIdentity("firstname", {
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
                <FormErrorMessage errors={errorsIdentity} name={"firstname"} />
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  defaultValue={user.user.lastname}
                  className="form-control"
                  {...registerIdentity("lastname", {
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
                <FormErrorMessage errors={errorsIdentity} name={"lastname"} />
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
            <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  defaultValue={""}
                  className="form-control"
                  {...registerEmail("email", {
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
                <FormErrorMessage errors={errorsEmail} name={"email"} />
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
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...registerPassword("currentPassword", {
                    required: PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
                    pattern: {
                      value: PASSWORD_REG_EXP,
                      message: PASSWORD_PATTERN_ERROR_MESSAGE,
                    },
                  })}
                  id="currentPassword"
                  placeholder={EMAIL_PLACEHOLDER}
                />
                <label htmlFor="currentPassword">Current Password</label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage
                  errors={errorsPassword}
                  name={"currentPassword"}
                />
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...registerPassword("newPassword", {
                    required: PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
                    pattern: {
                      value: PASSWORD_REG_EXP,
                      message: PASSWORD_PATTERN_ERROR_MESSAGE,
                    },
                  })}
                  id="newPassword"
                  placeholder={EMAIL_PLACEHOLDER}
                />
                <label htmlFor="newPassword">New Password</label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage
                  errors={errorsPassword}
                  name={"newPassword"}
                />
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...registerPassword("newPasswordConfirmation", {
                    required: PASSWORD_CONFIRMATION_IS_REQUIRED_ERROR_MESSAGE,
                    pattern: {
                      value: PASSWORD_REG_EXP,
                      message: PASSWORD_PATTERN_ERROR_MESSAGE,
                    },
                  })}
                  id="newPasswordConfirmation"
                  placeholder={PASSWORD_CONFIRMATION_PLACEHOLDER}
                />
                <label htmlFor="newPasswordConfirmation">
                  New Password Confirmation
                </label>
              </div>
              <div className={styles.errorMessage}>
                <FormErrorMessage
                  errors={errorsPassword}
                  name={"newPasswordConfirmation"}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="disconnectMe"
                  {...registerPassword("disconnectMe")}
                />
                <label
                  className={`form-check-label ${styles.checkLabel}`}
                  htmlFor="disconnectMe">
                  Disconnect me from all my devices
                </label>
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
              Once you delete your account, there is no going back. You will
              loose all your requests. If you are Premium member, your plan will
              be canceled. Please be certain.
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
