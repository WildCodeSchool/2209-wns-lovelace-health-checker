import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import {
  ACCOUNT_ROUTE,
  HOMEPAGE_ROUTE,
  PREMIUM_ROUTE,
  REQUESTS_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "../../routes";
import styles from "./Navbar.module.scss";

const Navbar = (props: any) => {
  const [selectedTab, setSelectedTab] = useState("search");
  const logged = props.logged;
  const route = useLocation();

  useEffect(() => {
    if (route.pathname === HOMEPAGE_ROUTE) {
      setSelectedTab("search");
    } else if (route.pathname === SIGN_IN_ROUTE) {
      setSelectedTab("sign-in");
    } else if (route.pathname === SIGN_UP_ROUTE) {
      setSelectedTab("sign-up");
    } else if (route.pathname === PREMIUM_ROUTE) {
      setSelectedTab("premium");
    } else if (route.pathname === REQUESTS_ROUTE) {
      setSelectedTab("requests");
    } else if (route.pathname === ACCOUNT_ROUTE) {
      setSelectedTab("account");
    }
  }, [route]);

  let isLogged: boolean = logged;
  return (
    <nav className={`d-flex justify-content-between ${styles.navbar}`}>
      {/* Mobile */}
      <div
        className={`col-12 d-flex align-items-center ${styles.mobileNavbar}`}
      >
        <div
          className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
        >
          <Link
            className={`${styles.navlink} ${
              selectedTab === "search" && styles.selectedLink
            }`}
            to={HOMEPAGE_ROUTE}
          >
            <i className={`bi bi-search ${styles.bi}`}></i>
            <p className={`m-0 ${styles.linkLabel}`}>Search</p>
          </Link>
        </div>

        {isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
          >
            <Link
              className={`${styles.navlink} ${
                selectedTab === "requests" && styles.selectedLink
              }`}
              to={REQUESTS_ROUTE}
            >
              <i className={`bi bi-list-ul ${styles.bi}`}></i>
              <p className={`m-0 ${styles.linkLabel}`}>Requests</p>
            </Link>
          </div>
        ) : (
          <></>
        )}

        <div
          className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
        >
          <Link
            className={`${styles.navlink} ${
              selectedTab === "premium" && styles.selectedLink
            }`}
            to={PREMIUM_ROUTE}
          >
            <i className={`bi bi-bookmark-check ${styles.biBookmarkCheck}`}></i>
            <p className={`m-0 ${styles.linkLabel}`}>Premium</p>
          </Link>
        </div>

        {!isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
          >
            <Link
              className={`${styles.navlink} ${
                selectedTab === "sign-up" && styles.selectedLink
              }`}
              to={SIGN_UP_ROUTE}
            >
              <i className={`bi bi-person-plus ${styles.bi}`}></i>
              <p className={`m-0 ${styles.linkLabel}`}>Sign Up</p>
            </Link>
          </div>
        ) : (
          <></>
        )}

        {!isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
          >
            <Link
              className={`${styles.navlink} ${
                selectedTab === "sign-in" && styles.selectedLink
              }`}
              to={SIGN_IN_ROUTE}
            >
              <i className={`bi bi-box-arrow-in-right ${styles.bi}`}></i>
              <p className={`m-0 ${styles.linkLabel}`}>Sign In</p>
            </Link>
          </div>
        ) : (
          <></>
        )}

        {isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
          >
            <Link
              className={`${styles.navlink} ${
                selectedTab === "account" && styles.selectedLink
              }`}
              to={ACCOUNT_ROUTE}
            >
              <i className={`bi bi-person ${styles.bi}`}></i>
              <p className={`m-0 ${styles.linkLabel}`}>Account</p>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Desktop */}
      <div
        className={`col-12 d-flex align-items-center justify-content-between ${styles.desktopNavbar}`}
      >
        <Link to={HOMEPAGE_ROUTE}>
          <img className={styles.logo} src={logo} alt="Health Check logo"></img>
        </Link>

        <div className="d-flex align-items-center  h-100">
          <div className={styles.navElement}>
            <Link
              className={`${styles.navlink} ${
                selectedTab === "search" && styles.selectedLink
              }`}
              to={HOMEPAGE_ROUTE}
              onClick={() => setSelectedTab("search")}
            >
              Search
            </Link>
          </div>

          {isLogged ? (
            <div className={styles.navElement}>
              <Link
                className={`${styles.navlink} ${
                  selectedTab === "requests" && styles.selectedLink
                }`}
                to={REQUESTS_ROUTE}
                onClick={() => setSelectedTab("requests")}
              >
                Requests
              </Link>
            </div>
          ) : (
            <></>
          )}

          <div className={styles.navElement}>
            <Link
              className={`${styles.navlink} ${
                selectedTab === "premium" && styles.selectedLink
              }`}
              to={PREMIUM_ROUTE}
              onClick={() => setSelectedTab("premium")}
            >
              Premium
            </Link>
          </div>

          {isLogged ? (
            <div className={styles.navElement}>
              <Link
                className={`${styles.navlink} ${
                  selectedTab === "account" && styles.selectedLink
                }`}
                to={ACCOUNT_ROUTE}
                onClick={() => setSelectedTab("account")}
              >
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
                to={SIGN_UP_ROUTE}
                onClick={() => setSelectedTab("sign-up")}
              >
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  Sign up
                </button>
              </Link>{" "}
              <Link
                className={`m-0 `}
                to={SIGN_IN_ROUTE}
                onClick={() => setSelectedTab("sign-in")}
              >
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
