import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type PropsType = {
  isLoggedIn: boolean;
  children: any;
  loading: boolean;
};
const Protected = (props: PropsType) => {
  const { isLoggedIn, children, loading } = props;
  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) {
    toast.error("You must be logged to access this page", {
      position: toast.POSITION.BOTTOM_RIGHT,
      toastId: "notLoggedIn",
    });
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};
export default Protected;
