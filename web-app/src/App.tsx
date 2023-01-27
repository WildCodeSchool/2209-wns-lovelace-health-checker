import 'react-toastify/dist/ReactToastify.css';

import { gql, useQuery } from '@apollo/client';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import styles from './App.module.scss';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import NavLogo from './components/NavLogo/NavLogo';
import { MyProfileQuery } from './gql/graphql';
import Account from './pages/Account/Account';
import AccountConfirmation from './pages/AccountConfirmation/AccountConfirmation';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import AlreadyLoggedIn from './pages/Guards/AlreadyLoggedIn';
import Protected from './pages/Guards/Protected';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Premium from './pages/Premium/Premium';
import Requests from './pages/Requests/Requests';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Terms from './pages/Terms/Terms';

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

  const { loading, data, refetch } = useQuery<MyProfileQuery>(MY_PROFILE);
  console.log(data?.myProfile);

  return (
    <main className={`container p-0 ${styles.main}`}>
      <div className={styles.content}>
        <NavLogo />
        <Navbar logged={Boolean(data?.myProfile)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/sign-up"
            element={
              <AlreadyLoggedIn isLoggedIn={Boolean(data?.myProfile)}>
                <SignUp />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path="/sign-in"
            element={
              <AlreadyLoggedIn isLoggedIn={Boolean(data?.myProfile)}>
                <SignIn onSuccess={refetch} />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path="/requests"
            element={
              <Protected
                isLoggedIn={Boolean(data?.myProfile)}
                loading={loading}>
                <Requests />
              </Protected>
            }
          />
          <Route
            path="/premium"
            element={
              <Protected
                isLoggedIn={Boolean(data?.myProfile)}
                loading={loading}>
                <Premium />
              </Protected>
            }
          />

          <Route
            path="/account"
            element={
              <Protected
                isLoggedIn={Boolean(data?.myProfile)}
                loading={loading}>
                <Account onLogoutSuccess={refetch} />
              </Protected>
            }
          />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/forgot-password"
            element={
              <AlreadyLoggedIn isLoggedIn={Boolean(data?.myProfile)}>
                <ForgotPassword />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path="/reset-password/:resetPasswordToken"
            element={
              <AlreadyLoggedIn isLoggedIn={Boolean(data?.myProfile)}>
                <ResetPassword />
              </AlreadyLoggedIn>
            }
          />
          <Route
            path="/account-confirmation/:confirmationToken"
            element={
              <AlreadyLoggedIn isLoggedIn={Boolean(data?.myProfile)}>
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
