import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../contexts/UserContext';

const Account = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      <p>Account works !</p>
      <p>{user?.firstname}</p>
      <button
        onClick={() => {
          setUser(null);
          navigate("/");
        }}>
        Logout
      </button>
    </>
  );
};

export default Account;
