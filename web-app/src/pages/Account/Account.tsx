import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SignOutMutation } from '../../gql/graphql';

const Account = ({ onLogoutSuccess }: { onLogoutSuccess: () => void }) => {
  const navigate = useNavigate();

  const SIGN_OUT = gql`
    mutation SignOut {
      signOut
    }
  `;

  const [signOut] = useMutation<SignOutMutation>(SIGN_OUT, {
    onCompleted: (data) => {
      onLogoutSuccess();
      toast.success(data.signOut, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "logout-success",
      });
    },
  });

  return (
    <>
      <p>Account works !</p>
      <button
        onClick={async () => {
          await signOut();
          navigate("/");
        }}>
        Logout
      </button>
    </>
  );
};

export default Account;
