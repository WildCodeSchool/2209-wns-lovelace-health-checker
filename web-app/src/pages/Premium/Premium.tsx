import styles from "./Premium.module.scss";
import spaceshipImage from "../../assets/images/spaceship.png";
import { useNavigate } from "react-router-dom";
import { PREMIUM_SUBSCRIPTION_ROUTE } from "../../routes";

const Premium = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className={`d-flex position-relative ${styles.searchBarContainer}`}>
        <h1 className="col-sm-5 col-12 text-white">
          Go further with Premium features
        </h1>
        <button
          className={`col-sm-6 col-12 ${styles.btn} ${styles.btnSecondary}`}
          onClick={() => navigate(PREMIUM_SUBSCRIPTION_ROUTE)}
        >
          Subscribe to Premium
        </button>
        <img
          className={`${styles.starshipImage} position-absolute`}
          src={spaceshipImage}
          alt="Starship icon"
        />
      </div>

      <div className={styles.contentContainer}>
        <div className={`${styles.content} mt-3`}>
          <h2>Why choose Premium ?</h2>
          <p>
            Wondering why you should subscribe to a Premium membership ? It will
            allow you to test your websites more frequently and also receive
            only the alerts that interest you.
          </p>
        </div>

        <div className={styles.content}>
          <h2>One plan. Many features.</h2>
          <p>
            We offer two subscription options : monthly or annual. After
            subscribing, you will have the ability to switch between options
            with just 1 click. Simple. Basic.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <div
              className={`${styles.price} d-flex flex-column justify-content-center align-items-center position-relative`}
            >
              <div className={`position-absolute ${styles.discount}`}>
                15% discount
              </div>
              <p className="m-0">9.99€</p>
              <small className={`${styles.subPrice} m-0`}>per year</small>
            </div>
            <i className="bi bi-arrow-left-right fs-3"></i>
            <div
              className={`${styles.price} d-flex flex-column justify-content-center align-items-center`}
            >
              <p className="m-0">0.99€</p>
              <small className={`${styles.subPrice} m-0`}>per month</small>
            </div>
          </div>
          <button
            className={`${styles.btn} ${styles.btnPrimary} mt-5`}
            onClick={() => navigate(PREMIUM_SUBSCRIPTION_ROUTE)}
          >
            Subscribe to Premium
          </button>
        </div>

        <div className={`${styles.content}`}>
          <h2>More request test frequencies</h2>
          <p>
            With Premium, you have the option to set much shorter test
            intervals, ranging from 30 minutes to 5 seconds. This way, you can
            monitor your websites more closely.
          </p>
        </div>

        <div className={`${styles.content}`}>
          <h2>Customized error code alerts</h2>
          <p>
            No longer do you have to choose between receiving an alert for every
            error or not receiving any alerts at all ! With Premium, you can
            select the error codes that will trigger an alert, allowing you to
            choose only the ones that interest you.
          </p>
        </div>

        <div className={`${styles.content} mt-0`}>
          <button
            className={`${styles.btn} ${styles.btnPrimary} mt-5`}
            onClick={() => navigate(PREMIUM_SUBSCRIPTION_ROUTE)}
          >
            Subscribe to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
