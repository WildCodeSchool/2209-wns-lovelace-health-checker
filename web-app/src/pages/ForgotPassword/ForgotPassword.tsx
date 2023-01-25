import { gql, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";
import {
  AskForNewPasswordMutation,
  AskForNewPasswordMutationVariables,
} from "../../gql/graphql";
import styles from "./ForgotPassword.module.scss";

export const ASK_FOR_NEW_PASSWORD = gql`
  mutation AskForNewPassword($email: String!) {
    askForNewPassword(email: $email)
  }
`;

const ForgotPassword = () => {
  const [askForNewPassword, { data, loading }] = useMutation<
    AskForNewPasswordMutation,
    AskForNewPasswordMutationVariables
  >(ASK_FOR_NEW_PASSWORD, {
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
          toast.error(
            "Oops... It seems that something went wront, please try again.",
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              toastId: 3,
            }
          );
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<any> = async (email) => {
    await askForNewPassword({
      variables: {
        email: email.email,
      },
    });
  };

  return (
    <div data-testid="formContainer" className={styles.desktopContainer}>
      <h1 className={`mb-4`}>It happens even to the best...</h1>
      <p>
        Enter your email address and you will receive a link to generate a new
        password.
      </p>
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
              required: "Email is required",
            })}
            id="email"
            placeholder="name@example.com"
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className={styles.errorMessage}>
          <FormErrorMessage errors={errors} name={"email"} />
        </div>

        <button
          type="submit"
          className={`${styles.button} ${styles.primaryButton} mt-4`}
        >
          Create your account
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
