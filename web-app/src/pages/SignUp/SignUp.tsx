import { gql, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";

import { SignUpMutation, SignUpMutationVariables } from "../../gql/graphql";
import { SERVER_IS_KO_ERROR_MESSAGE } from "../../utils/error-messages";
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
  FIRSTNAME_PATTERN_ERROR_MESSAGE,
  FIRSTNAME_PLACEHOLDER,
  LASTNAME_IS_REQUIRED_ERROR_MESSAGE,
  LASTNAME_MAX_LENGTH,
  LASTNAME_MAX_LENGTH_ERROR_MESSAGE,
  LASTNAME_MIN_LENGTH,
  LASTNAME_MIN_LENGTH_ERROR_MESSAGE,
  LASTNAME_PATTERN_ERROR_MESSAGE,
  LASTNAME_PLACEHOLDER,
  PASSWORD_CONFIRMATION_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_CONFIRMATION_MATCH_ERROR_MESSAGE,
  PASSWORD_CONFIRMATION_PLACEHOLDER,
  PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
  PASSWORD_PATTERN_ERROR_MESSAGE,
  PASSWORD_PLACEHOLDER,
} from "../../utils/form-validations";
import {
  FIRSTNAME_AND_LASTNAME_REG_EXP,
  PASSWORD_REG_EXP,
} from "../../utils/regular-expressions";
import styles from "./SignUp.module.scss";

export const SIGN_UP = gql`
  mutation SignUp(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    signUp(
      firstname: $firstname
      lastname: $lastname
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      firstname
      lastname
      email
    }
  }
`;

type SignUpInputs = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  passwordConfirmation: string;
  agreedTerms: boolean;
};

const SignUp = () => {
  const [signUp, { data, loading }] = useMutation<
    SignUpMutation,
    SignUpMutationVariables
  >(SIGN_UP, {
    onError: (error) => {
      switch (error.message) {
        case "Argument Validation Error":
          toast.error(
            "Unable to create your account because the registration form contains one or more invalid fields.",
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              toastId: 1,
            }
          );
          break;
        case "This email is already used":
          toast.error("This email is already used", {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 2,
          });
          break;
        default:
          toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 3,
          });
      }
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInputs>({
    criteriaMode: "all",
    defaultValues: { agreedTerms: false },
  });

  const password = useRef({});
  password.current = watch("password", "");

  const [passwordInputType, setPasswordInputType] = useState("password");
  const [passwordConfirmationInputType, setConfirmationPasswordInputType] =
    useState("password");

  const onSubmit: SubmitHandler<any> = async (informations) => {
    await signUp({
      variables: {
        email: informations.email,
        firstname: informations.firstname,
        lastname: informations.lastname,
        password: informations.password,
        passwordConfirmation: informations.passwordConfirmation,
      },
    });
  };

  return (
    <div className={styles.contentContainer}>
      <h1 className={`mb-4`}>Account creation</h1>
      {data ? (
        <div className="text-center">
          <i
            data-testid="successIcon"
            className={`bi bi-check-circle ${styles.success}`}
          ></i>
          <p>
            Your account has been created successfully. Please, check your inbox
            to confirm your account and start using Health Check !
          </p>
        </div>
      ) : (
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

            <div className="form-floating mb-2 mt-3">
              <input
                type="text"
                defaultValue={""}
                className="form-control"
                {...register("firstname", {
                  required: FIRSTNAME_IS_REQUIRED_ERROR_MESSAGE,
                  minLength: {
                    value: FIRSTNAME_MIN_LENGTH,
                    message: FIRSTNAME_MIN_LENGTH_ERROR_MESSAGE,
                  },
                  maxLength: {
                    value: FIRSTNAME_MAX_LENGTH,
                    message: FIRSTNAME_MAX_LENGTH_ERROR_MESSAGE,
                  },
                  pattern: {
                    value: FIRSTNAME_AND_LASTNAME_REG_EXP,
                    message: FIRSTNAME_PATTERN_ERROR_MESSAGE,
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

            <div className="form-floating mb-2 mt-3">
              <input
                type="text"
                defaultValue={""}
                className="form-control"
                {...register("lastname", {
                  required: LASTNAME_IS_REQUIRED_ERROR_MESSAGE,
                  minLength: {
                    value: LASTNAME_MIN_LENGTH,
                    message: LASTNAME_MIN_LENGTH_ERROR_MESSAGE,
                  },
                  maxLength: {
                    value: LASTNAME_MAX_LENGTH,
                    message: LASTNAME_MAX_LENGTH_ERROR_MESSAGE,
                  },
                  pattern: {
                    value: FIRSTNAME_AND_LASTNAME_REG_EXP,
                    message: LASTNAME_PATTERN_ERROR_MESSAGE,
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

            <div className="form-floating mb-2 mt-3 d-flex">
              <input
                type={passwordInputType}
                data-testid="password"
                defaultValue={""}
                className={`form-control ${styles.passwordInput}`}
                {...register("password", {
                  required: PASSWORD_IS_REQUIRED_ERROR_MESSAGE,
                  pattern: {
                    value: PASSWORD_REG_EXP,
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

              <label htmlFor="passwordConfirmation">
                Password confirmation
              </label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage errors={errors} name={"passwordConfirmation"} />
            </div>

            <div className={`form-check mt-4`}>
              <input
                className="form-check-input"
                type="checkbox"
                {...register("agreedTerms", {
                  required: "You must accept terms and conditions",
                })}
                id="agreedTerms"
              />
              <label className="form-check-label" htmlFor="agreedTerms">
                I agree to the{" "}
                <Link className={styles.navlink} to="/terms">
                  terms and conditions
                </Link>
              </label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage errors={errors} name={"agreedTerms"} />
            </div>

            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary} mt-4`}
            >
              Create your account
            </button>
          </form>
        </div>
      )}

      {data ? (
        <></>
      ) : (
        <div data-testid="alreadyRegistered">
          <hr className={styles.separator} />
          <p className={styles.alreadyRegistered}>
            Already registered ?{" "}
            <Link className={styles.navlink} to="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
