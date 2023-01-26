import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";

import {
  ResendAccountConfirmationTokenMutation,
  ResendAccountConfirmationTokenMutationVariables,
  SignInMutation,
  SignInMutationVariables,
} from "../../gql/graphql";
import { SERVER_IS_KO_ERROR_MESSAGE } from "../../utils/error-messages";
import styles from "./SignIn.module.scss";

import {
  EMAIL_IS_REQUIRED_ERROR_MESSAGE,
  EMAIL_MAX_LENGTH,
  EMAIL_MAX_LENGTH_ERROR_MESSAGE,
  EMAIL_PLACEHOLDER,
  PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_PLACEHOLDER,
} from "../../utils/form-validations";

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      firstname
    }
  }
`;

export const RESEND_ACCOUNT_CONFIRMATION_TOKEN = gql`
  mutation resendAccountConfirmationToken($email: String!) {
    resendAccountConfirmationToken(email: $email)
  }
`;

const SignIn = () => {
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();

  const [signIn, { loading }] = useMutation<
    SignInMutation,
    SignInMutationVariables
  >(SIGN_IN, {
    onCompleted: (data) => {
      toast.success("Welcome " + data.signIn.firstname + " !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: 1,
      });
      navigate("/");
    },
    onError: (error) => {
      if (
        error.message ===
        "Your account is not active, click on the link in your email to activate it"
      ) {
        setIsPending(true);
        toast.info("Please check your email to confirm your account", {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 4,
        });
      } else if (error.message === "Incorrect credentials") {
        setIsPending(false);
        toast.error("Incorrect credentials", {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 3,
        });
      } else {
        toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 5,
        });
      }
    },
  });

  const [resendAccountConfirmationToken] = useMutation<
    ResendAccountConfirmationTokenMutation,
    ResendAccountConfirmationTokenMutationVariables
  >(RESEND_ACCOUNT_CONFIRMATION_TOKEN, {
    onCompleted: (data) => {
      toast.success(data.resendAccountConfirmationToken, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: 2,
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    setEmail(data.email);
    signIn({ variables: { email: data.email, password: data.password } });
  };

  const sendConfirmationEmail = () => {
    console.log(email);
    resendAccountConfirmationToken({ variables: { email: email } });
  };

  return (
    <div className={styles.contentContainer}>
      <h1 className={`mb-4`}>Connection to your account</h1>
      <div data-testid="formContainer" className={styles.desktopContainer}>
        <form className={styles.signUpForm} onSubmit={handleSubmit(onSubmit)}>
          {loading ? (
            <div
              className={`${styles.loaderContainer} d-flex justify-content-center align-items-center`}
            >
              <div className={styles.loader} role="status"></div>
            </div>
          ) : (
            <></>
          )}
          <div className="form-floating mb-2">
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
          <div className="form-floating mb-2 mt-3 d-flex">
            <input
              type={passwordInputType}
              data-testid="password"
              defaultValue={""}
              className={`form-control ${styles.passwordInput}`}
              {...register("password", {
                required: PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
              })}
              id="password"
              placeholder={PASSWORD_PLACEHOLDER}
            />
            <div className={`input-group-text ${styles.showHidePassword}`}>
              {passwordInputType === "password" ? (
                <i
                  data-testid="passwordEye"
                  onClick={() => setPasswordInputType("text")}
                  className={`bi bi-eye ${styles.eye}`}
                ></i>
              ) : (
                <i
                  data-testid="passwordEyeSlash"
                  onClick={() => setPasswordInputType("password")}
                  className={`bi bi-eye-slash ${styles.eye}`}
                ></i>
              )}
            </div>
            <label htmlFor="password">Password</label>
          </div>
          <div className={styles.errorMessage}>
            <FormErrorMessage errors={errors} name={"password"} />
          </div>
          {isPending && (
            <>
              <div
                className={`${styles.pendingAccount}`}
                data-testid="errorMessage"
              >
                <p>
                  Your account isn't active yet ! Verify your inbox to confirm
                  your account.{" "}
                  <span
                    className={`${styles.navlink}`}
                    style={{ cursor: "pointer" }}
                    onClick={sendConfirmationEmail}
                    data-testid="resendConfirmationEmail"
                  >
                    Send confirmation email again
                  </span>
                </p>
              </div>
            </>
          )}
          <div data-testid="alreadyRegistered" className="mt-3">
            <p className={styles.alreadyRegistered}>
              <Link className={styles.navlink} to="/forgot-password">
                Forgot your password ?
              </Link>
            </p>
          </div>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary} mt-4`}
          >
            Sign in
          </button>
        </form>
      </div>

      <div data-testid="alreadyRegistered">
        <hr className={styles.separator} />
        <p className={styles.alreadyRegistered}>
          New to Health Check ?{" "}
          <Link className={styles.navlink} to="/sign-up">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
