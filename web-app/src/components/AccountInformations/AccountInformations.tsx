import { ApolloQueryResult, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  MyProfileQuery,
  UpdateEmailMutation,
  UpdateEmailMutationVariables,
  UpdateIdentityMutation,
  UpdateIdentityMutationVariables,
  UpdatePasswordMutation,
  UpdatePasswordMutationVariables,
} from "../../gql/graphql";
import { disablePageScroll, enablePageScroll } from "../../utils/browser-utils";
import {
  CURRENT_PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
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
  NEW_PASSWORD_CONFIRMATION_IS_REQUIRED_ERROR_MESSAGE,
  NEW_PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_CONFIRMATION_PLACEHOLDER,
  PASSWORD_PATTERN_ERROR_MESSAGE,
} from "../../utils/form-validations";
import { PASSWORD_REG_EXP } from "../../utils/regular-expressions";
import DeleteAccountModal from "../DeleteAccountModal/DeleteAccountModal";
import FormErrorMessage from "../ErrorMessage/FormErrorMessage";
import styles from "./AccountInformations.module.scss";

const AccountInformations = ({
  user,
  onDeleteSuccess,
  refreshProfile,
}: {
  user: any;
  onDeleteSuccess(): Promise<ApolloQueryResult<MyProfileQuery>>;
  refreshProfile(): Promise<void>;
}) => {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  if (showDeleteAccountModal) {
    disablePageScroll();
  } else {
    enablePageScroll();
  }

  const {
    register: registerIdentity,
    handleSubmit: handleSubmitIdentity,
    formState: { errors: errorsIdentity },
  } = useForm({
    criteriaMode: "all",
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm({
    criteriaMode: "all",
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    criteriaMode: "all",
  });

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
    console.log({ data });
    updateEmail({
      variables: {
        newEmail: data.email,
      },
    });
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
    onCompleted: async () => {
      await refreshProfile();
      toast.success("Your identity has been updated successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "updateIdentity",
      });
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
      toast.success(data.updatePassword, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "updatePassword",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const UPDATE_EMAIL = gql`
    mutation UpdateEmail($newEmail: String!) {
      updateEmail(newEmail: $newEmail)
    }
  `;

  const [updateEmail] = useMutation<
    UpdateEmailMutation,
    UpdateEmailMutationVariables
  >(UPDATE_EMAIL, {
    onCompleted: (data) => {
      console.log(data.updateEmail);
      toast.success(data.updateEmail, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "updateEmail",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      {showDeleteAccountModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteAccountModal(false)}
          onDeleteSuccess={onDeleteSuccess}
        />
      )}

      <div className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-person"></i> Personnal informations
          </h2>
          <div className={`${styles.formContent}`}>
            <form onSubmit={handleSubmitIdentity(onSubmitIdentity)}>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  defaultValue={user.firstname}
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

              <div className={`${styles.errorMessage}`}>
                <FormErrorMessage errors={errorsIdentity} name={"firstname"} />
              </div>
              <div className="form-floating mb-2 mt-3">
                <input
                  type="text"
                  defaultValue={user.lastname}
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
              <div className={`${styles.errorMessage} mb-2`}>
                <FormErrorMessage errors={errorsIdentity} name={"lastname"} />
              </div>

              <button type="submit" className={`${styles.mainButton} mt-2`}>
                Save
              </button>
            </form>
          </div>
        </div>
        <div className={` col ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-envelope"></i> Change your email
          </h2>
          <div className={`${styles.formContent}`}>
            <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
              <div className="form-floating mb-2">
                <input
                  type="email"
                  defaultValue={user.email}
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
              <button className={`${styles.mainButton} mt-2`}>
                Change your email
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        <div className={`col-12 col-md-6 ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-lock-fill"></i> Change your password
          </h2>
          <div className={`${styles.formContent}`}>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <div className="form-floating mb-2">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...registerPassword("currentPassword", {
                    required: CURRENT_PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
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
              <div className="form-floating mb-2 mt-3">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...registerPassword("newPassword", {
                    required: NEW_PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
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
              <div className="form-floating mb-2 mt-3">
                <input
                  type="password"
                  defaultValue={""}
                  className="form-control"
                  {...registerPassword("newPasswordConfirmation", {
                    required:
                      NEW_PASSWORD_CONFIRMATION_IS_REQUIRED_ERROR_MESSAGE,
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
              <div className="form-check mb-2 mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="disconnectMe"
                  {...registerPassword("disconnectMe")}
                />
                <label
                  className={`form-check-label ${styles.checkLabel}`}
                  htmlFor="disconnectMe">
                  Disconnect me from all my other devices
                </label>
              </div>
              <button className={`${styles.mainButton} mt-2`}>
                Change password
              </button>
            </form>
          </div>
        </div>
        <div className={`col ${styles.formContainer}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-exclamation-triangle"></i> Danger zone
          </h2>
          <div className={`${styles.dangerZone}`}>
            <p>
              Once you delete your account, there is no going back. You will
              loose all your requests. If you are Premium member, your plan will
              be canceled. Please be certain.
            </p>
            <button
              className={`${styles.dangerButton}`}
              onClick={() => setShowDeleteAccountModal(true)}>
              Delete your account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountInformations;
