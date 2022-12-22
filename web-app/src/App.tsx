import 'react-toastify/dist/ReactToastify.css';

import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import styles from './App.module.scss';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import NavLogo from './components/NavLogo/NavLogo';
import Account from './pages/Account/Account';
import Home from './pages/Home/Home';
import Premium from './pages/Premium/Premium';
import Requests from './pages/Requests/Requests';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Terms from './pages/Terms/Terms';

function App() {
  return (
    <main className={`container p-0 ${styles.main}`}>
      <div className={styles.content}>
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
        </Routes>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
      <ToastContainer />
    </main>
  );
}

export default App;
