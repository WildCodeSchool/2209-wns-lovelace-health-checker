import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import styles from './App.module.scss';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import NavLogo from './components/NavLogo/NavLogo';
import { UserContext } from './contexts/UserContext';
import Account from './pages/Account/Account';
import AccountConfirmation from './pages/AccountConfirmation/AccountConfirmation';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import AlreadyLoggedIn from './pages/Guards/AlreadyLoggedIn';
import Protected from './pages/Guards/Protected';
import Home from './pages/Home/Home';
import Premium from './pages/Premium/Premium';
import Requests from './pages/Requests/Requests';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Terms from './pages/Terms/Terms';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const providerValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
    }),
    [user, setUser, loading]
  );

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
      setLoading(false);
    }
    setLoading(false);
  }, []);

  return (
    <main className={`container p-0 ${styles.main}`}>
      <div className={styles.content}>
        <UserContext.Provider value={providerValue}>
          <NavLogo />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/sign-up"
              element={
                <AlreadyLoggedIn isLoggedIn={Boolean(user)}>
                  <SignUp />
                </AlreadyLoggedIn>
              }
            />
            <Route
              path="/sign-in"
              element={
                <AlreadyLoggedIn isLoggedIn={Boolean(user)}>
                  <SignIn />
                </AlreadyLoggedIn>
              }
            />
            <Route
              path="/requests"
              element={
                <Protected isLoggedIn={Boolean(user)} loading={loading}>
                  <Requests />
                </Protected>
              }
            />
            <Route
              path="/premium"
              element={
                <Protected isLoggedIn={Boolean(user)} loading={loading}>
                  <Premium />
                </Protected>
              }
            />

            <Route
              path="/account"
              element={
                <Protected isLoggedIn={Boolean(user)} loading={loading}>
                  <Account />
                </Protected>
              }
            />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/forgot-password"
              element={
                <AlreadyLoggedIn isLoggedIn={Boolean(user)}>
                  <ForgotPassword />
                </AlreadyLoggedIn>
              }
            />
            <Route
              path="/reset-password/:resetPasswordToken"
              element={
                <AlreadyLoggedIn isLoggedIn={Boolean(user)}>
                  <ResetPassword />
                </AlreadyLoggedIn>
              }
            />
            <Route
              path="/account-confirmation/:confirmationToken"
              element={
                <AlreadyLoggedIn isLoggedIn={Boolean(user)}>
                  <AccountConfirmation />
                </AlreadyLoggedIn>
              }
            />
          </Routes>
        </UserContext.Provider>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
      <ToastContainer className={styles.toastContainer} />
    </main>
  );
}

export default App;
