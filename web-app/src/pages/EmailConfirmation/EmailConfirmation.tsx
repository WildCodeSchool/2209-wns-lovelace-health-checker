import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ConfirmEmailMutation, ConfirmEmailMutationVariables } from '../../gql/graphql';
import styles from '../AccountConfirmation/AccountConfirmation.module.scss';

const CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($confirmationToken: String!) {
    confirmEmail(confirmationToken: $confirmationToken)
  }
`;

const EmailConfirmation = ({ onSuccess }: { onSuccess: () => {} }) => {
  const [success, setSuccess] = useState<boolean>(false);

  const [confirmEmail, { loading }] = useMutation<
    ConfirmEmailMutation,
    ConfirmEmailMutationVariables
  >(CONFIRM_EMAIL, {
    onCompleted: (data) => {
      if (data.confirmEmail) {
        setSuccess(true);
        onSuccess();
      }
    },
    onError: (error) => {
      if (error.message === "Invalid email confirmation token") {
        setSuccess(false);
      }
    },
  });

  let { confirmationToken } = useParams();

  useEffect(() => {
    if (confirmationToken) {
      confirmEmail({
        variables: {
          confirmationToken: confirmationToken as string,
        },
      });
    }
  }, [confirmationToken, confirmEmail]);

  if (loading)
    return (
      <>
        <div className={`${styles.contentContainer}`}>
          <h1>Email Confirmation</h1>
          <div className={`${styles.loader}`}></div>
          <p>Confirming email...</p>
        </div>
      </>
    );

  if (success)
    return (
      <div className={`${styles.contentContainer}`}>
        <h1>Email Confirmation</h1>
        <div className="text-center">
          <i
            data-testid="successIcon"
            className={`bi bi-check-circle ${styles.success}`}></i>
          <p>Your email has been updated successfully !</p>
        </div>
      </div>
    );
  else
    return (
      <div className={`${styles.contentContainer}`}>
        <h1>Email Confirmation</h1>
        <div className="text-center">
          <i
            data-testid="errorIcon"
            className={`bi bi-x-circle ${styles.error}`}></i>
          <p>
            Your unique confirmation token is invalid or has already been used.
          </p>
          <p>Please click on link in your email again.</p>
        </div>
      </div>
    );
};

export default EmailConfirmation;
