import "react-toastify/dist/ReactToastify.css";

import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import styles from "./App.module.scss";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import NavLogo from "./components/NavLogo/NavLogo";
import { MyProfileQuery } from "./gql/graphql";
import Account from "./pages/Account/Account";
import AccountConfirmation from "./pages/AccountConfirmation/AccountConfirmation";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import AlreadyLoggedIn from "./pages/Guards/AlreadyLoggedIn";
import Protected from "./pages/Guards/Protected";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Premium from "./pages/Premium/Premium";
import Requests from "./pages/Requests/Requests";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Terms from "./pages/Terms/Terms";
import RequestCreation from "./pages/RequestCreation/RequestCreation";
import PreventRequestCreationPageAccessIfLimitHasBeenReached from "./pages/Guards/PreventRequestCreationPageAccessIfLimitHasBeenReached";

function App() {
  const MY_PROFILE = gql`
    query MyProfile {
      myProfile {
        id
        firstname
        role
      }
    }
  `;
  const [isLogged, setIsLogged] = useState(false);

  const { loading, refetch, data } = useQuery<MyProfileQuery>(MY_PROFILE, {
    onCompleted: (data) => {
      if (data.myProfile) {
        setIsLogged(true);
      }
    },
    onError: () => {
      setIsLogged(false);
    },
  });

  const refreshMyProfile = async () => {
    try {
      toast.dismiss();
      await refetch();
    } catch (error) {}
  };

  return (
    <main className={`container p-0 ${styles.main}`}>
      <div className={styles.content}>
        <NavLogo />
        <Navbar logged={isLogged} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/sign-up"
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <SignUp />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path="/sign-in"
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <SignIn onSuccess={refetch} />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path="/requests"
            element={
              <Protected isLoggedIn={isLogged} loading={loading}>
                <Requests />
              </Protected>
            }
          />
          <Route
            path="/request-creation"
            element={
              <PreventRequestCreationPageAccessIfLimitHasBeenReached>
                <RequestCreation />
              </PreventRequestCreationPageAccessIfLimitHasBeenReached>
            }
          />
          <Route
            path="/premium"
            element={
              <Protected isLoggedIn={isLogged} loading={loading}>
                <Premium />
              </Protected>
            }
          />

          <Route
            path="/account"
            element={
              <Protected isLoggedIn={isLogged} loading={loading}>
                <Account
                  onLogoutSuccess={refreshMyProfile}
                  user={data?.myProfile}
                />
              </Protected>
            }
          />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/forgot-password"
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <ForgotPassword />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path="/reset-password/:resetPasswordToken"
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <ResetPassword />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path="/account-confirmation/:confirmationToken"
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <AccountConfirmation />
              </AlreadyLoggedIn>
            }
          />
          {/* Always put the wildcard on last position */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
      <ToastContainer className={styles.toastContainer} />
    </main>
  );
}

export default App;
