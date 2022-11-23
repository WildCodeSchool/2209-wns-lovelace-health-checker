import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import styles from './App.module.scss';
import Home from './pages/home/Home';

function App() {
  return (
    <div className={styles.background}>
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
