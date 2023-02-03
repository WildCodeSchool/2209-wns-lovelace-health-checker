import { Link } from "react-router-dom";
import { HOMEPAGE_ROUTE } from "../../routes";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles.contentContainer}>
      <h1 className={`mb-4`}>Page not found</h1>
      <div className={styles.desktopContainer}>
        <p>
          We can't seem to find the page you're looking for. Try going back to
          the previous page or click the button below to go back to homepage.
        </p>
        <Link to={HOMEPAGE_ROUTE}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            Go to homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
