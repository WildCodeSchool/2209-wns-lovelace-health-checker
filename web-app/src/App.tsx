import "react-toastify/dist/ReactToastify.css";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import styles from "./App.module.scss";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { MyProfileQuery } from "./gql/graphql";
import Account from "./pages/Account/Account";
import AccountConfirmation from "./pages/AccountConfirmation/AccountConfirmation";
import EmailConfirmation from "./pages/EmailConfirmation/EmailConfirmation";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import AlreadyLoggedIn from "./pages/Guards/AlreadyLoggedIn";
import PreventRequestCreationPageAccessIfLimitHasBeenReached from "./pages/Guards/PreventRequestCreationPageAccessIfLimitHasBeenReached";
import Protected from "./pages/Guards/Protected";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Premium from "./pages/Premium/Premium";
import RequestCreation from "./pages/RequestCreation/RequestCreation";
import Requests from "./pages/Requests/Requests";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Terms from "./pages/Terms/Terms";
import {
  ACCOUNT_CONFIRMATION_WITH_TOKEN_ROUTE,
  ACCOUNT_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  HOMEPAGE_ROUTE,
  PREMIUM_ROUTE,
  REQUEST_CREATION_ROUTE,
  REQUESTS_ROUTE,
  RESET_EMAIL_WITH_TOKEN_ROUTE,
  RESET_PASSWORD_WITH_TOKEN_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  TERMS_ROUTE,
  REQUEST_DETAILS_ROUTE,
  PREMIUM_SUBSCRIPTION_ROUTE,
} from "./routes";
import RequestDetails from "./pages/RequestDetails/RequestDetails";
import PremiumSubscription from "./pages/PremiumSubscription/PremiumSubscription";

export const MY_PROFILE = gql`
  query MyProfile {
    myProfile {
      id
      firstname
      lastname
      role
      email
      hasCanceledPremium
      onPremiumCancellation
    }
  }
`;

export enum OnPremiumCancellation {
  DEFAULT = "default",
  DISABLED = "disabled",
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  hasCancelledPremium?: boolean | null | undefined;
  onPremiumCancellation?: string | null | undefined;
}

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<User>();

  const { loading, refetch, data } = useQuery<MyProfileQuery>(MY_PROFILE, {
    onCompleted: (data) => {
      if (data.myProfile) {
        setIsLogged(true);
        setUser(data.myProfile);
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
        <Navbar logged={isLogged} />
        <Routes>
          <Route path={HOMEPAGE_ROUTE} element={<Home />} />
          <Route
            path={SIGN_UP_ROUTE}
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <SignUp />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path={SIGN_IN_ROUTE}
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <SignIn onSuccess={refetch} />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path={REQUESTS_ROUTE}
            element={
              <Protected isLoggedIn={isLogged} loading={loading}>
                <Requests />
              </Protected>
            }
          />
          <Route
            path={REQUEST_CREATION_ROUTE}
            element={
              <PreventRequestCreationPageAccessIfLimitHasBeenReached>
                <RequestCreation role={data?.myProfile.role} />
              </PreventRequestCreationPageAccessIfLimitHasBeenReached>
            }
          />
          <Route
            path={REQUEST_DETAILS_ROUTE}
            element={
              <Protected isLoggedIn={isLogged} loading={loading}>
                <RequestDetails role={data?.myProfile.role} />
              </Protected>
            }
          />
          <Route path={PREMIUM_ROUTE} element={<Premium />} />
          <Route
            path={PREMIUM_SUBSCRIPTION_ROUTE}
            element={
              <Protected isLoggedIn={isLogged} loading={loading}>
                <PremiumSubscription />
              </Protected>
            }
          />

          <Route
            path={ACCOUNT_ROUTE}
            element={
              <Protected isLoggedIn={isLogged} loading={loading}>
                <Account
                  onLogoutSuccess={refreshMyProfile}
                  onDeleteSuccess={refetch}
                  onUpdatePremiumSuccess={refreshMyProfile}
                  user={user}
                />
              </Protected>
            }
          />
          <Route path={TERMS_ROUTE} element={<Terms />} />
          <Route
            path={FORGOT_PASSWORD_ROUTE}
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <ForgotPassword />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path={RESET_PASSWORD_WITH_TOKEN_ROUTE}
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <ResetPassword />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path={ACCOUNT_CONFIRMATION_WITH_TOKEN_ROUTE}
            element={
              <AlreadyLoggedIn isLoggedIn={isLogged}>
                <AccountConfirmation onSuccess={refetch} />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path={RESET_EMAIL_WITH_TOKEN_ROUTE}
            element={<EmailConfirmation onSuccess={refetch} />}
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
