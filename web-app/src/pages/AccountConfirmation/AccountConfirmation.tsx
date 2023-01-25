import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ConfirmAccountMutation, ConfirmAccountMutationVariables } from '../../gql/graphql';
import styles from './AccountConfirmation.module.scss';

export const CONFIRM_ACCOUNT = gql`
  mutation confirmAccount($token: String!) {
    confirmAccount(token: $token)
  }
`;

const AccountConfirmation = () => {
  const [success, setSuccess] = useState<boolean>(false);

  const [confirmAccount, { loading }] = useMutation<
    ConfirmAccountMutation,
    ConfirmAccountMutationVariables
  >(CONFIRM_ACCOUNT);

  let { confirmationToken } = useParams();
  const validateAccount = async () => {
    try {
      const result = await confirmAccount({
        variables: { token: confirmationToken as string },
      });

      if (result.data?.confirmAccount) {
        setSuccess(true);
      } else if (result.errors) {
        if (
          result.errors?.length > 0 &&
          result.errors[0].message === "Invalid confirmation token"
        ) {
          setSuccess(false);
        }
      }
    } catch (e) {
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (confirmationToken) {
      validateAccount();
    }
  }, [confirmationToken]);

  if (loading) return <p>Confirming account...</p>;

  if (success)
    return (
      <div className={`${styles.contentContainer}`}>
        <h1>Account Confirmation</h1>
        <div className="text-center">
          <i
            data-testid="successIcon"
            className={`bi bi-check-circle ${styles.success}`}></i>
          <p>
            Your account has been confirmed successfully. You can now{" "}
            <Link
              to={"/sign-up"}
              style={{
                margin: "0",
                color: "#212529",
                textDecoration: "underline",
              }}>
              log in
            </Link>{" "}
            to HealthCheck !
          </p>
        </div>
      </div>
    );
  else
    return (
      <div className={`${styles.contentContainer}`}>
        <h1>Account Confirmation</h1>
        <div className="text-center">
          <i
            data-testid="errorIcon"
            className={`bi bi-x-circle ${styles.error}`}></i>
          <p>
            An error has occured, link is invalid or your account is already
            confirmed.
          </p>
        </div>
      </div>
    );
};

export default AccountConfirmation;
