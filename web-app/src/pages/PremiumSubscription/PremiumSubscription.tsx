import { useState } from "react";
import styles from "./PremiumSubscription.module.scss";
import { InputSwitch } from "primereact/inputswitch";
import { Checkbox } from "primereact/checkbox";
import { Link } from "react-router-dom";
import stripe from "../../assets/images/logoStripe.svg";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import {
  SubscribePremiumMutation,
  SubscribePremiumMutationVariables,
} from "../../gql/graphql";

const PREMIUM_SUBSCRIPTION = gql`
  mutation SubscribePremium($plan: String!) {
    subscribePremium(plan: $plan) {
      url
    }
  }
`;

enum PREMIUM_PLAN {
  MONTHLY = "monthly",
  ANNUALLY = "annually",
}

const PremiumSubscription = () => {
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [isTermAgreed, setIsTermAgreed] = useState<boolean>(false);

  const [subscribePremium] = useMutation<
    SubscribePremiumMutation,
    SubscribePremiumMutationVariables
  >(PREMIUM_SUBSCRIPTION, {
    onCompleted: (data) => {
      if (data.subscribePremium.url)
        window.location.href = data.subscribePremium.url;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className={`${styles.contentContainer}`}>
      <h1 className={`${styles.title} d-flex justify-content-center`}>
        Subscribe to Premium plan
      </h1>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className={`${styles.desktopContainer}`}>
          <div className="d-flex justify-content-end align-items-center gap-3 ">
            <span className={`${!isYearly ? styles.active : styles.bill}`}>
              Bill Monthly
            </span>
            <InputSwitch
              className={`${styles.switch} `}
              checked={isYearly}
              onChange={(e) => {
                setIsYearly(e.value as boolean);
              }}
            />
            <span className={`${isYearly ? styles.active : styles.bill} `}>
              Bill Yearly
            </span>
          </div>

          <div className={`${styles.priceContainer} mt-4`}>
            {isYearly && (
              <div className={`${styles.discount}`}>15% discount</div>
            )}
            <div className="d-flex justify-content-center align-items-baseline gap-2">
              {isYearly ? (
                <>
                  <span className={`${styles.price}`}>9.99€ </span>

                  <span className={`${styles.year}`}> / year*</span>
                </>
              ) : (
                <>
                  <span className={`${styles.price}`}>0.99€ </span>

                  <span className={`${styles.year}`}> / month*</span>
                </>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              {isYearly ? (
                <span className={`${styles.conversion}`}>
                  Equals to 0.83€ per month
                </span>
              ) : (
                <span className={`${styles.conversion}`}>
                  Equals to 11.88€ per year
                </span>
              )}
            </div>
          </div>
          <div
            className={`mt-4 d-flex align-items-center gap-2 ${styles.termContainer}`}
            onClick={() => setIsTermAgreed(!isTermAgreed)}>
            <Checkbox
              onChange={(e) => setIsTermAgreed(e.checked as boolean)}
              checked={isTermAgreed}></Checkbox>
            <span>
              I agree to the{" "}
              <Link to={"/"} className={`${styles.link}`}>
                sales and refunds
              </Link>{" "}
            </span>
          </div>
          <div className="d-flex flex-column gap-4 mt-4">
            {isTermAgreed ? (
              <button
                className={`${styles.btnPrimary}`}
                onClick={() => {
                  isYearly
                    ? subscribePremium({
                        variables: { plan: PREMIUM_PLAN.ANNUALLY },
                      })
                    : subscribePremium({
                        variables: { plan: PREMIUM_PLAN.MONTHLY },
                      });
                }}>
                Checkout
              </button>
            ) : (
              <button className={`${styles.btnDisabled}`}>Checkout</button>
            )}
            <button className={`${styles.btnSecondary}`}>Cancel</button>
          </div>
          <div className="mt-4">
            <span className={`${styles.conditions}`}>
              * You can cancel your subscription at any time
            </span>
          </div>
          <div className="mt-5 d-flex justify-content-center align-items-center">
            <img
              src={stripe}
              alt="Stripe logo"
              className={`${styles.stripeLogo}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSubscription;
