import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SignOutMutation } from '../../gql/graphql';

const Account = ({ onLogoutSuccess }: { onLogoutSuccess: () => {} }) => {
  const navigate = useNavigate();

  const SIGN_OUT = gql`
    mutation SignOut {
      signOut
    }
  `;

  const [signOut] = useMutation<SignOutMutation>(SIGN_OUT, {
    onCompleted: async (data) => {
      onLogoutSuccess();
      toast.success(data.signOut, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "logout-success",
      });
      navigate("/");
    },
  });

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    console.log("logout");
    signOut();
  };

  return (
    <>
      <p>Account works !</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button
          onClick={async () => {
            await signOut();
          }}>
          Logout
        </button>
      </form>
    </>
  );
};

export default Account;
