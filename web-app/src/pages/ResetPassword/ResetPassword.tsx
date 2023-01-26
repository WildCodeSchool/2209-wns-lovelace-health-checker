import { gql, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";
import {
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from "../../gql/graphql";
import { SERVER_IS_KO_ERROR_MESSAGE } from "../../utils/error-messages";
import styles from "./ResetPassword.module.scss";
import { passwordRegExp } from "../../utils/regular-expressions";
import {
  PASSWORD_CONFIRMATION_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_CONFIRMATION_MATCH_ERROR_MESSAGE,
  PASSWORD_CONFIRMATION_PLACEHOLDER,
  PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_PATTERN_ERROR_MESSAGE,
  PASSWORD_PLACEHOLDER,
} from "../../utils/form-validations";

export const RESET_PASSWORD = gql`
  mutation ResetPassword(
    $token: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    resetPassword(
      token: $token
      password: $password
      passwordConfirmation: $passwordConfirmation
    )
  }
`;

type ResetPasswordInputs = {
  password: string;
  passwordConfirmation: string;
};

const ResetPassword = () => {
  let { resetPasswordToken } = useParams();
  const navigate = useNavigate();

  const [resetPassword, { loading }] = useMutation<
    ResetPasswordMutation,
    ResetPasswordMutationVariables
  >(RESET_PASSWORD, {
    onCompleted: (data) => {
      toast.success(data.resetPassword, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: 1,
      });
      navigate("/sign-in");
    },
    onError: (error) => {
      if (error.message.includes("time limit has been exceeded")) {
        toast.error(error.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 2,
          autoClose: false,
        });
      } else if (error.message === "Argument Validation Error") {
        toast.error("Passwords don't match or password pattern is incorrect", {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 3,
        });
      } else if (
        error.message === "Your reset password token is no longer valid"
      ) {
        toast.error(error.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 4,
        });
      } else {
        toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 5,
        });
      }
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    criteriaMode: "all",
  });

  const password = useRef({});
  password.current = watch("password", "");

  const [passwordInputType, setPasswordInputType] = useState("password");
  const [passwordConfirmationInputType, setConfirmationPasswordInputType] =
    useState("password");

  const onSubmit: SubmitHandler<any> = async (informations) => {
    if (resetPasswordToken) {
      await resetPassword({
        variables: {
          token: resetPasswordToken,
          password: informations.password,
          passwordConfirmation: informations.passwordConfirmation,
        },
      });
    }
  };

  return (
    <div className={styles.contentContainer}>
      <h1 className={`mb-4`}>Reset your password</h1>
      <div data-testid="formContainer" className={styles.desktopContainer}>
        <form
          className={styles.resetPasswordForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          {loading ? (
            <div
              className={`${styles.loaderContainer} d-flex justify-content-center align-items-center`}
            >
              <div className={styles.loader} role="status"></div>
            </div>
          ) : (
            <></>
          )}

          <div className="form-floating mb-2 mt-3 d-flex">
            <input
              type={passwordInputType}
              data-testid="password"
              defaultValue={""}
              className={`form-control ${styles.passwordInput}`}
              {...register("password", {
                required: PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
                pattern: {
                  value: passwordRegExp,
                  message: PASSWORD_PATTERN_ERROR_MESSAGE,
                },
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

          <div className="form-floating mb-2 mt-3 d-flex">
            <input
              type={passwordConfirmationInputType}
              data-testid="passwordConfirmation"
              defaultValue={""}
              className={`form-control ${styles.passwordInput}`}
              {...register("passwordConfirmation", {
                required: PASSWORD_CONFIRMATION_IS_REQUIRED_ERROR_MESSAGE,
                validate: (value) =>
                  value === password.current ||
                  PASSWORD_CONFIRMATION_MATCH_ERROR_MESSAGE,
              })}
              id="passwordConfirmation"
              placeholder={PASSWORD_CONFIRMATION_PLACEHOLDER}
            />
            <div className={`input-group-text ${styles.showHidePassword}`}>
              {passwordConfirmationInputType === "password" ? (
                <i
                  onClick={() => setConfirmationPasswordInputType("text")}
                  className={`bi bi-eye ${styles.eye}`}
                ></i>
              ) : (
                <i
                  onClick={() => setConfirmationPasswordInputType("password")}
                  className={`bi bi-eye-slash ${styles.eye}`}
                ></i>
              )}
            </div>

            <label htmlFor="passwordConfirmation">Password confirmation</label>
          </div>
          <div className={styles.errorMessage}>
            <FormErrorMessage errors={errors} name={"passwordConfirmation"} />
          </div>

          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary} mt-4`}
          >
            Reset your password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
