import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import { HOMEPAGE_ROUTE } from "../../routes";
import styles from "./NavLogo.module.scss";

const NavLogo = () => {
  return (
    <div className={`d-flex align-items-center pt-1 ${styles.navLogo}`}>
      <Link to={HOMEPAGE_ROUTE}>
        <img className={styles.logo} src={logo} alt="Health Check logo"></img>
      </Link>
    </div>
  );
};

export default NavLogo;
