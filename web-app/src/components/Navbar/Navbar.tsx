import { useContext } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/images/logo.png';
import { UserContext } from '../../contexts/UserContext';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { user } = useContext(UserContext);

  let isLogged: boolean = Boolean(user);
  return (
    <nav className={`d-flex justify-content-between ${styles.navbar}`}>
      {/* Mobile */}
      <div
        className={`col-12 d-flex align-items-center ${styles.mobileNavbar}`}>
        <div
          className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}>
          <i className={`bi bi-search ${styles.bi}`}></i>
          <Link className={styles.navlink} to="/">
            Search
          </Link>
        </div>

        {isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}>
            <i className={`bi bi-list-ul ${styles.bi}`}></i>
            <Link className={styles.navlink} to="/requests">
              Requests
            </Link>
          </div>
        ) : (
          <></>
        )}

        <div
          className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}>
          <i className={`bi bi-bookmark-check ${styles.biBookmarkCheck}`}></i>
          <Link className={styles.navlink} to="/premium">
            Premium
          </Link>
        </div>

        {!isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}>
            <i className={`bi bi-person-plus ${styles.bi}`}></i>
            <Link className={styles.navlink} to="/sign-up">
              Sign up
            </Link>
          </div>
        ) : (
          <></>
        )}

        {!isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}>
            <i className={`bi bi-box-arrow-in-right ${styles.bi}`}></i>
            <Link className={styles.navlink} to="/sign-in">
              Sign in
            </Link>
          </div>
        ) : (
          <></>
        )}

        {isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}>
            <i className={`bi bi-person ${styles.bi}`}></i>
            <Link className={styles.navlink} to="/account">
              Account
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Desktop */}
      <div
        className={`col-12 d-flex align-items-center justify-content-between ${styles.desktopNavbar}`}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="Health Check logo"></img>
        </Link>

        <div className="d-flex align-items-center gap-4 h-100">
          <div className={styles.navElement}>
            <Link className={styles.navlink} to="/">
              Search
            </Link>
          </div>

          {isLogged ? (
            <div className={`${styles.navElement} `}>
              <Link className={styles.navlink} to="/requests">
                Requests
              </Link>
            </div>
          ) : (
            <></>
          )}

          <div className={`${styles.navElement} `}>
            <Link className={styles.navlink} to="/premium">
              Premium
            </Link>
          </div>

          {isLogged ? (
            <div className={styles.navElement}>
              <Link className={styles.navlink} to="/account">
                Account
              </Link>
            </div>
          ) : (
            <></>
          )}

          {!isLogged ? (
            <Link className="m-0" to="/sign-up">
              <button className={`${styles.btn} ${styles.btnPrimary}`}>
                Sign up
              </button>
            </Link>
          ) : (
            <></>
          )}

          {!isLogged ? (
            <Link className="m-0" to="/sign-in">
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                Sign in
              </button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
