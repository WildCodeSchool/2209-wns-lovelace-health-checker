import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import styles from './App.module.scss';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import NavLogo from './components/NavLogo/NavLogo';
import Home from './pages/Home/Home';

function App() {
  return (
    <div className={styles.app}>
      <main className={styles.content}>
        <NavLogo />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
