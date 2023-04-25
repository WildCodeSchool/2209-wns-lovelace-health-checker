import { HOMEPAGE_ROUTE } from "../../routes";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer
      className={`d-flex flex-column justify-content-center ${styles.footer}`}
    >
      <ul>
        <li>
          <a href={HOMEPAGE_ROUTE}>Legals</a>
        </li>
        <li>
          <a href={HOMEPAGE_ROUTE}>Terms of use</a>
        </li>
        <li>
          <a href={HOMEPAGE_ROUTE}>Sales and refunds</a>
        </li>
      </ul>
      <p className={styles.copyright}>©2023 Health Check</p>
    </footer>
  );
};

export default Footer;
