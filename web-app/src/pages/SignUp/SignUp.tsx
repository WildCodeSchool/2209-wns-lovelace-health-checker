import { gql, useMutation } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import FormErrorMessage from '../../components/ErrorMessage/FormErrorMessage';
import { SignUpMutation, SignUpMutationVariables } from '../../gql/graphql';
import styles from './SignUp.module.scss';

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

const firstNameAndLastNameRegExp = new RegExp(
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
);

const passwordRegExp = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$");

const SignUp = () => {
  const [signUp, { data, loading, error }] = useMutation<
    SignUpMutation,
    SignUpMutationVariables
  >(SIGN_UP);

  useEffect(() => {
    if (error?.graphQLErrors) {
      if (
        error?.graphQLErrors[0].message.toString() ===
        "Argument Validation Error"
      ) {
        toast.error(
          "Unable to create your account because the registration form contains one or more invalid fields.",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 1,
          }
        );
      } else {
        toast.error(
          "Oops... It seems that something went wront, please try again.",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 1,
          }
        );
      }
    }
  }, [error]);

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
          <i className={`bi bi-check-circle ${styles.success}`}></i>
          <p>
            Your account has been created successfully. Please, check your inbox
            to confirm your account and start using Health Check !
          </p>
        </div>
      ) : (
        <div className={styles.desktopContainer}>
          <form className={styles.signUpForm} onSubmit={handleSubmit(onSubmit)}>
            {loading ? (
              <div
                className={`${styles.loaderContainer} d-flex justify-content-center align-items-center`}
              >
                <div className={styles.loader}></div>
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
                  required: "Email is required",
                  maxLength: {
                    value: 320,
                    message: "Email must have maximum 320 character",
                  },
                })}
                id="email"
                placeholder="name@example.com"
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
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must have at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "First name must have maximum 100 characters",
                  },
                  pattern: {
                    value: firstNameAndLastNameRegExp,
                    message:
                      "First name must not contain numbers or special characters",
                  },
                })}
                id="firstname"
                placeholder="John"
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
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must have at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Last name must have maximum 100 characters",
                  },
                  pattern: {
                    value: firstNameAndLastNameRegExp,
                    message:
                      "Last name must not contain numbers or special characters",
                  },
                })}
                id="lastname"
                placeholder="Doe"
              />
              <label htmlFor="lastname">Lastname</label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage errors={errors} name={"lastname"} />
            </div>

            <div className="form-floating mb-2 mt-3 d-flex">
              <input
                type={passwordInputType}
                defaultValue={""}
                className={`form-control ${styles.passwordInput}`}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: passwordRegExp,
                    message:
                      "Password must have at least 8 characters, one upper case, one lower case, and one number",
                  },
                })}
                id="password"
                placeholder="Your password"
              />
              <div className={`input-group-text ${styles.showHidePassword}`}>
                {passwordInputType === "password" ? (
                  <i
                    onClick={() => setPasswordInputType("text")}
                    className={`bi bi-eye ${styles.eye}`}
                  ></i>
                ) : (
                  <i
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
                defaultValue={""}
                className={`form-control ${styles.passwordInput}`}
                {...register("passwordConfirmation", {
                  required: "Password confirmation is required",
                  validate: (value) =>
                    value === password.current || "Passwords don't match",
                })}
                id="passwordConfirmation"
                placeholder="Your password confirmation"
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
                <Link
                  className={styles.navlink}
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms and conditions
                </Link>
              </label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage errors={errors} name={"agreedTerms"} />
            </div>

            <button
              type="submit"
              className={`${styles.button} ${styles.primaryButton} mt-4`}
            >
              Create your account
            </button>
          </form>
        </div>
      )}

      {data ? (
        <></>
      ) : (
        <>
          <hr className={styles.separator} />
          <p className={styles.alreadyRegistered}>
            Already registered ?{" "}
            <Link className={styles.navlink} to="/signin">
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default SignUp;
