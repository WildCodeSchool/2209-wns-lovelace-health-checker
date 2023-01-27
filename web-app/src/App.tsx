import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';
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
import Home from './pages/Home/Home';
import Premium from './pages/Premium/Premium';
import Requests from './pages/Requests/Requests';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Terms from './pages/Terms/Terms';

function App() {
  const [user, setUser] = useState(null);

  return (
    <main className={`container p-0 ${styles.main}`}>
      <div className={styles.content}>
        <UserContext.Provider value={{ user, setUser }}>
          <NavLogo />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/account" element={<Account />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:resetPasswordToken"
              element={<ResetPassword />}
            />
            <Route
              path="/account-confirmation/:confirmationToken"
              element={<AccountConfirmation />}
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
