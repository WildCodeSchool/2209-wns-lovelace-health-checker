import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type PropsType = {
  isLoggedIn: boolean;
  children: any;
};
const AlreadyLoggedIn = (props: PropsType) => {
  const { isLoggedIn, children } = props;
  if (isLoggedIn) {
    toast.error("You must logout to access this page", {
      position: toast.POSITION.BOTTOM_RIGHT,
      toastId: "alreadyLoggedIn",
    });
    return <Navigate to="/" replace />;
  }
  return children;
};
export default AlreadyLoggedIn;
