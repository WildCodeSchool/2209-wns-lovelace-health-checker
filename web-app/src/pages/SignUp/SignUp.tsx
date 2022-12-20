import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormErrorMessage from '../../components/ErrorMessage/FormErrorMessage';

type SignUpInputs = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  passwordConfirmation: string;
  agreedTerms: boolean;
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>({ criteriaMode: "all" });

  const onSubmit: SubmitHandler<any> = async () => {
    try {
      console.log("foo");
    } catch (error) {
      toast.error(
        "Oops, it seems that something went wrong... Please try again",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 1,
        }
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="d-flex">
        <input
          type="text"
          defaultValue={""}
          placeholder="johndoe@example.com"
          {...register("email", {
            required: "Email is required",
          })}
        />
        <div>
          <FormErrorMessage errors={errors} name={"email"} />
        </div>
        <button
          type="submit"
          className={`d-flex justify-content-center align-items-center`}
        >
          Create your account
        </button>
      </form>
    </div>
  );
};

export default SignUp;
