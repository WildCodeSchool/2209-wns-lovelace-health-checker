import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import FormErrorMessage from '../../components/ErrorMessage/FormErrorMessage';
import { SignInMutation, SignInMutationVariables } from '../../gql/graphql';
import styles from './SignIn.module.scss';

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      firstname
    }
  }
`;

const SignIn = () => {
  const [passwordInputType, setPasswordInputType] = useState("password");
  const passwordRegExp = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$");

  const [signIn, { loading, data }] = useMutation<
    SignInMutation,
    SignInMutationVariables
  >(SIGN_IN);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    signIn({ variables: { email: data.email, password: data.password } });
  };

  return (
    <div className={styles.contentContainer}>
      <h1 className={`mb-4`}>Connection to your account</h1>
      {data ? (
        <div className="text-center">
          <i
            data-testid="successIcon"
            className={`bi bi-check-circle ${styles.success}`}></i>
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
                className={`${styles.loaderContainer} d-flex justify-content-center align-items-center`}>
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
            <div className="form-floating mb-2 mt-3 d-flex">
              <input
                type={passwordInputType}
                data-testid="password"
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
                    data-testid="passwordEye"
                    onClick={() => setPasswordInputType("text")}
                    className={`bi bi-eye ${styles.eye}`}></i>
                ) : (
                  <i
                    data-testid="passwordEyeSlash"
                    onClick={() => setPasswordInputType("password")}
                    className={`bi bi-eye-slash ${styles.eye}`}></i>
                )}
              </div>
              <label htmlFor="password">Password</label>
            </div>
            <div className={styles.errorMessage}>
              <FormErrorMessage errors={errors} name={"password"} />
            </div>
            <button
              type="submit"
              className={`${styles.button} ${styles.primaryButton} mt-4`}>
              Sign in
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
            New to Health Check ?{" "}
            <Link className={styles.navlink} to="/sign-up">
              Sign up
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
