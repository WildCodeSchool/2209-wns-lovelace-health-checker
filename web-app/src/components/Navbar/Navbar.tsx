import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/images/logo.png';
import styles from './Navbar.module.scss';

const Navbar = (props: any) => {
  const [selectedTab, setSelectedTab] = useState("search");
  const logged = props.logged;

  const route = useLocation();

  useEffect(() => {
    if (route.pathname === "/") {
      setSelectedTab("search");
    } else if (route.pathname === "/sign-in") {
      setSelectedTab("sign-in");
    } else if (route.pathname === "/sign-up") {
      setSelectedTab("sign-up");
    } else if (route.pathname === "/premium") {
      setSelectedTab("premium");
    } else if (route.pathname === "/requests") {
      setSelectedTab("requests");
    } else if (route.pathname === "/account") {
      setSelectedTab("account");
    }
  }, [route]);

  let isLogged: boolean = logged;
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

        <div className="d-flex align-items-center  h-100">
          <div
            className={`${styles.navElement} ${
              selectedTab === "search" && styles.selectedTab
            }`}>
            <Link
              className={`${styles.navlink} ${
                selectedTab === "search" && styles.selectedLink
              }`}
              to="/"
              onClick={() => setSelectedTab("search")}>
              Search
            </Link>
          </div>

          {isLogged ? (
            <div
              className={`${styles.navElement} ${
                selectedTab === "requests" && styles.selectedTab
              } `}>
              <Link
                className={`${styles.navlink} ${
                  selectedTab === "requests" && styles.selectedLink
                }`}
                to="/requests"
                onClick={() => setSelectedTab("requests")}>
                Requests
              </Link>
            </div>
          ) : (
            <></>
          )}

          <div
            className={`${styles.navElement} ${
              selectedTab === "premium" && styles.selectedTab
            } `}>
            <Link
              className={`${styles.navlink} ${
                selectedTab === "premium" && styles.selectedLink
              }`}
              to="/premium"
              onClick={() => setSelectedTab("premium")}>
              Premium
            </Link>
          </div>

          {isLogged ? (
            <div
              className={`${styles.navElement} ${
                selectedTab === "account" && styles.selectedTab
              } `}>
              <Link
                className={`${styles.navlink} ${
                  selectedTab === "account" && styles.selectedLink
                }`}
                to="/account"
                onClick={() => setSelectedTab("account")}>
                Account
              </Link>
            </div>
          ) : (
            <></>
          )}

          {!isLogged ? (
            <div>
              <Link
                className={`m-0 ${styles.notLogged}`}
                to="/sign-up"
                onClick={() => setSelectedTab("sign-up")}>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  Sign up
                </button>
              </Link>{" "}
              <Link
                className={`m-0 `}
                to="/sign-in"
                onClick={() => setSelectedTab("sign-in")}>
                <button className={`${styles.btn} ${styles.btnSecondary}`}>
                  Sign in
                </button>
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
