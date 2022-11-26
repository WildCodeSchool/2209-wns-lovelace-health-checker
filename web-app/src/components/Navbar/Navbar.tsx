import logo from '../../assets/images/logo.png';
import styles from './Navbar.module.scss';

const Navbar = () => {
  let isLogged: boolean = true;
  return (
    <nav className={`d-flex justify-content-between ${styles.navbar}`}>
      {/* Mobile */}
      <div
        className={`col-12 d-flex align-items-center ${styles.mobileNavbar}`}
      >
        <div
          className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
        >
          <i className={`bi bi-search ${styles.bi}`}></i>
          <a className={styles.navlink} href="/">
            Search
          </a>
        </div>

        {isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
          >
            <i className={`bi bi-list-ul ${styles.bi}`}></i>
            <a className={styles.navlink} href="/">
              Requests
            </a>
          </div>
        ) : (
          <></>
        )}

        <div
          className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
        >
          <i className={`bi bi-bookmark-check ${styles.biBookmarkCheck}`}></i>
          <a className={styles.navlink} href="/">
            Premium
          </a>
        </div>

        {!isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
          >
            <i className={`bi bi-person-plus ${styles.bi}`}></i>
            <a className={styles.navlink} href="/">
              Sign up
            </a>
          </div>
        ) : (
          <></>
        )}

        {!isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
          >
            <i className={`bi bi-box-arrow-in-right ${styles.bi}`}></i>
            <a className={styles.navlink} href="/">
              Sign in
            </a>
          </div>
        ) : (
          <></>
        )}

        {isLogged ? (
          <div
            className={`col-3 d-flex flex-column align-items-center ${styles.navElement}`}
          >
            <i className={`bi bi-person ${styles.bi}`}></i>
            <a className={styles.navlink} href="/">
              Account
            </a>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Desktop */}
      <div
        className={`col-12 d-flex align-items-center justify-content-between ${styles.desktopNavbar}`}
      >
        <a href="/">
          <img className={styles.logo} src={logo} alt="Health Check logo"></img>
        </a>

        <div className="d-flex align-items-center gap-4">
          <div className={styles.navElement}>
            <a className={styles.navlink} href="/">
              Search
            </a>
          </div>

          {isLogged ? (
            <div className={styles.navElement}>
              <a className={styles.navlink} href="/">
                Requests
              </a>
            </div>
          ) : (
            <></>
          )}

          <div className={styles.navElement}>
            <a className={styles.navlink} href="/">
              Premium
            </a>
          </div>

          {isLogged ? (
            <div className={styles.navElement}>
              <a className={styles.navlink} href="/">
                Account
              </a>
            </div>
          ) : (
            <></>
          )}

          {!isLogged ? (
            <button className={styles.primaryButton}>Sign up</button>
          ) : (
            <></>
          )}

          {!isLogged ? (
            <button className={styles.secondaryButton}>Sign in</button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
