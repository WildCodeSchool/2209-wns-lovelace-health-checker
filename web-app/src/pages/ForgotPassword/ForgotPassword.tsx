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
  const [askForNewPassword, { loading }] = useMutation<
    AskForNewPasswordMutation,
    AskForNewPasswordMutationVariables
  >(ASK_FOR_NEW_PASSWORD, {
    onCompleted: (data) => {
      reset();
      toast.success(data.askForNewPassword, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: 3,
      });
    },
    onError: () => {
      toast.error(
        "Oops... It seems that something went wront, please try again.",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 3,
        }
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    <div className={styles.contentContainer}>
      <h1 className={`mb-4`}>It happens even to the best...</h1>
      <div data-testid="formContainer" className={styles.desktopContainer}>
        <p>
          Enter your email address and you will receive a link to generate a new
          password.
        </p>
        <form
          className={styles.askForNewPasswordForm}
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
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
