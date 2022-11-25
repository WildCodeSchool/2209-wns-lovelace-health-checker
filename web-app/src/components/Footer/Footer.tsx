import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer
      className={`d-flex flex-column justify-content-center ${styles.footer}`}
    >
      <ul className={styles.navList}>
        <li>
          <a href="/">Legals</a>
        </li>
        <li>
          <a href="/">Terms of use</a>
        </li>
        <li>
          <a href="/">Sales and refunds</a>
        </li>
      </ul>
      <p className={styles.copyright}>©2022 Health Check</p>
    </footer>
  );
};

export default Footer;
