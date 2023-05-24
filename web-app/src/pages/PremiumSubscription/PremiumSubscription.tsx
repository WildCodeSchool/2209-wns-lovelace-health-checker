import { useState } from "react";
import styles from "./PremiumSubscription.module.scss";
import { InputSwitch } from "primereact/inputswitch";

const PremiumSubscription = () => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div className={`${styles.contentContainer}`}>
      <h1 className={`${styles.title} d-flex justify-content-center`}>
        Subscribe to Premium plan
      </h1>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className={`${styles.desktopContainer}`}>
          <div className="d-flex justify-content-end align-items-center gap-3">
            <span className={`${styles.bill}`}>Bill Yearly</span>
            <InputSwitch
              className={`${styles.switch}`}
              checked={checked}
              onChange={(e) => setChecked(e.value as boolean)}
            />
            <span className={`${styles.bill}`}>Bill Monthly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSubscription;
