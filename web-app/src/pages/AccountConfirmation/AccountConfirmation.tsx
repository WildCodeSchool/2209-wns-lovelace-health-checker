import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ConfirmAccountMutation,
  ConfirmAccountMutationVariables,
} from "../../gql/graphql";
import { SIGN_IN_ROUTE } from "../../routes";
import styles from "./AccountConfirmation.module.scss";

export const CONFIRM_ACCOUNT = gql`
  mutation confirmAccount($token: String!) {
    confirmAccount(token: $token)
  }
`;

const AccountConfirmation = ({ onSuccess }: { onSuccess: () => void }) => {
  const [success, setSuccess] = useState<boolean>(false);

  const [confirmAccount, { loading }] = useMutation<
    ConfirmAccountMutation,
    ConfirmAccountMutationVariables
  >(CONFIRM_ACCOUNT, {
    onCompleted: (data) => {
      if (data.confirmAccount) {
        setSuccess(true);
        onSuccess();
      }
    },
    onError: (error) => {
      if (error.message === "Invalid confirmation token") {
        setSuccess(false);
      }
    },
  });

  let { confirmationToken } = useParams();

  useEffect(() => {
    confirmAccount({
      variables: {
        token: confirmationToken as string,
      },
    });
  }, [confirmAccount, confirmationToken]);

  if (loading)
    return (
      <>
        <div className={`${styles.contentContainer}`}>
          <h1>Account Confirmation</h1>
          <div className={`${styles.loader}`}></div>
          <p>Confirming account...</p>
        </div>
      </>
    );

  if (success)
    return (
      <div className={`${styles.contentContainer}`}>
        <h1>Account Confirmation</h1>
        <div className="text-center">
          <i
            data-testid="successIcon"
            className={`bi bi-check-circle ${styles.success}`}
          ></i>
          <p>
            Your account has been confirmed successfully. You can now{" "}
            <Link
              to={SIGN_IN_ROUTE}
              className={`${styles.link}`}
              style={{
                margin: "0",
                color: "#195078",
              }}
            >
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
            className={`bi bi-x-circle ${styles.error}`}
          ></i>
          <p>
            Your unique confirmation token is invalid or has already been used.
          </p>
          <p>Please click on link in your email again.</p>
        </div>
      </div>
    );
};

export default AccountConfirmation;
