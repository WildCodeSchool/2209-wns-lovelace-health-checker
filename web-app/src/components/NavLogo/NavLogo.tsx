import logo from '../../assets/images/logo.png';
import styles from './NavLogo.module.scss';

const NavLogo = () => {
  return (
    <div className={`d-flex align-items-center pt-1 ${styles.navLogo}`}>
      <a href="/">
        <img className={styles.logo} src={logo} alt="Health Check logo"></img>
      </a>
    </div>
  );
};

export default NavLogo;
