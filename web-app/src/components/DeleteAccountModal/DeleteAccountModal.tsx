import { useForm } from 'react-hook-form';

import {
    CURRENT_PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
    EMAIL_PLACEHOLDER,
    PASSWORD_PATTERN_ERROR_MESSAGE,
} from '../../utils/form-validations';
import { PASSWORD_REG_EXP } from '../../utils/regular-expressions';
import FormErrorMessage from '../ErrorMessage/FormErrorMessage';
import styles from './DeleteAccountModal.module.scss';

type DeleteAccountModalProps = {
  onClose: () => void;
  onDelete: () => void;
};

const DeleteAccountModal = (props: DeleteAccountModalProps) => {
  const {
    register: registerPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    criteriaMode: "all",
  });

  return (
    <div className={`${styles.fullPage}`}>
      <div className={`${styles.modalContainer}`}>
        <div className={`${styles.modalHeader}`}>
          <h2 className={`${styles.modalTitle}`}>Delete Account</h2>
        </div>
        <div className={`${styles.modalBody}`}>
          <p className={`${styles.modalText}`}>
            We want to make sure it's you who is trying to delete the account.
            Please confirm by entering your password, then confirm your choice.
          </p>
          <form className={`${styles.modalInput}`}>
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
          </form>
          <div className={`${styles.modalButtons}`}>
            <button
              className={`${styles.modalButton} ${styles.cancelButton}`}
              onClick={props.onClose}>
              Cancel
            </button>
            <button
              className={`${styles.modalButton} ${styles.deleteButton}`}
              onClick={props.onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
