import { ApolloQueryResult, gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  MyProfileQuery,
} from "../../gql/graphql";
import {
  CURRENT_PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_PATTERN_ERROR_MESSAGE,
} from "../../utils/form-validations";
import { PASSWORD_REG_EXP } from "../../utils/regular-expressions";
import FormErrorMessage from "../ErrorMessage/FormErrorMessage";
import styles from "./DeleteAccountModal.module.scss";

type DeleteAccountModalProps = {
  onClose: () => void;
  onDeleteSuccess: () => Promise<ApolloQueryResult<MyProfileQuery>>;
};

const DELETE_ACCOUNT = gql`
  mutation DeleteUser($currentPassword: String!) {
    deleteUser(currentPassword: $currentPassword)
  }
`;

const DeleteAccountModal = (props: DeleteAccountModalProps) => {
  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      navigate("/");
      await props.onDeleteSuccess();
    } catch (error) {}
  };

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    criteriaMode: "all",
  });

  const [deleteUser] = useMutation<
    DeleteUserMutation,
    DeleteUserMutationVariables
  >(DELETE_ACCOUNT, {
    onCompleted: async (data) => {
      if (data.deleteUser) {
        await onDelete();
        toast.success("Account deleted successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: "deleteAccountSuccess",
        });
      }
    },
    onError: (error) => {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "deleteAccountError",
      });
    },
  });

  const onSubmitPassword = (data: any) => {
    deleteUser({
      variables: {
        currentPassword: data.currentPassword,
      },
    });
  };

  return (
    <div className={`${styles.fullPage}`}>
      <div className={`${styles.modalContainer}`}>
        <div className={`${styles.modalHeader}`}>
          <h2>Delete Account</h2>
        </div>
        <div className={`${styles.modalBody}`}>
          <p className={`${styles.modalText}`}>
            We want to make sure it's you who is trying to delete the account.
            Please confirm by entering your password, then confirm your choice.
          </p>
          <form
            className={`${styles.modalInput}`}
            onSubmit={handleSubmitPassword(onSubmitPassword)}
          >
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
              />
              <label htmlFor="currentPassword">Current Password</label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage
                errors={errorsPassword}
                name={"currentPassword"}
              />
            </div>
            <div className={`${styles.modalButtons}`}>
              <button
                className={`${styles.modalButton} ${styles.cancelButton}`}
                onClick={props.onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`${styles.modalButton} ${styles.deleteButton}`}
                type="submit"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
