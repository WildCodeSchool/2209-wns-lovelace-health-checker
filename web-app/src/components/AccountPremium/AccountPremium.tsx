import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import styles from "./AccountPremium.module.scss";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  ModifyPremiumSubscriptionMutation,
  ModifyPremiumSubscriptionMutationVariables,
} from "../../gql/graphql";
import { toast } from "react-toastify";
import { OnPremiumCancellation, User } from "../../App";
import { formatDateString } from "../../utils/date";

const MODIFY_PREMIUM_SUBSCRIPTION = gql`
  mutation ModifyPremiumSubscription($onPremiumCancellation: String!) {
    modifyPremiumSubscription(onPremiumCancellation: $onPremiumCancellation)
  }
`;

const AccountPremium = ({
  user,
  onUpdatePremiumSuccess,
}: {
  user: User;
  onUpdatePremiumSuccess(): Promise<void>;
}) => {
  const [modifyPremiumSubscription, { error }] = useMutation<
    ModifyPremiumSubscriptionMutation,
    ModifyPremiumSubscriptionMutationVariables
  >(MODIFY_PREMIUM_SUBSCRIPTION, {
    onCompleted: () => {
      onUpdatePremiumSuccess();
    },
    onError: (error) => {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: 1,
      });
    },
  });
  type ModifyPremiumSubscriptionInput = {
    onPremiumCancellation: OnPremiumCancellation;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ModifyPremiumSubscriptionInput>({
    criteriaMode: "all",
  });
  const onSubmit: SubmitHandler<any> = async () => {
    await modifyPremiumSubscription({
      variables: {
        onPremiumCancellation: onPremiumCancellation,
      },
    });
  };

  const [onPremiumCancellation, setOnPremiumCancellation] = useState<any>(
    OnPremiumCancellation.DISABLED
  );

  return (
    <>
      {/* Cancel confirmation modal */}
      {(user.onPremiumCancellation === null ||
        user.onPremiumCancellation === OnPremiumCancellation.STAY) && (
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header ${styles.modalHeader}`}>
                <h1
                  className={`m-0 ${styles.modalTitle}`}
                  id="staticBackdropLabel"
                >
                  Premium plan cancellation
                </h1>
              </div>
              <div className="modal-body py-4">
                Once you cancel your Premium plan,Premium features wille be
                available until the end of billing period. You can reactivate
                your Premium plan until the end of billing period.
              </div>
              <div className="modal-footer">
                <button
                  className={`${styles.btnModal} ${styles.btnSecondary}`}
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop2"
                  className={`${styles.btnModal} ${styles.btnPrimary}`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Request handling modal */}
      {(user.onPremiumCancellation === null ||
        user.onPremiumCancellation === OnPremiumCancellation.STAY) && (
        <div
          className="modal fade"
          id="staticBackdrop2"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-labelledby="staticBackdrop2Label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`modal-header ${styles.modalHeader}`}>
                  <h1
                    className={`m-0 ${styles.modalTitle}`}
                    id="staticBackdrop2Label"
                  >
                    Premium request handling
                  </h1>
                </div>
                <div className="modal-body py-4">
                  Please choose how to handle your Premium requests at the end
                  of the remaining billing period
                </div>
                <div className="form-check mb-2 mx-4">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="stateActive"
                    value="true"
                    {...register("onPremiumCancellation")}
                    checked={
                      onPremiumCancellation === OnPremiumCancellation.DISABLED
                    }
                    onClick={() =>
                      setOnPremiumCancellation(OnPremiumCancellation.DISABLED)
                    }
                  />
                  <label className="form-check-label" htmlFor="stateActive">
                    Keep your Premium requests but make them inactive
                  </label>
                </div>
                <div className="form-check mb-4 mx-4">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="stateInactive"
                    value="false"
                    {...register("onPremiumCancellation")}
                    checked={
                      onPremiumCancellation === OnPremiumCancellation.DEFAULT
                    }
                    onClick={() =>
                      setOnPremiumCancellation(OnPremiumCancellation.DEFAULT)
                    }
                  />
                  <label className="form-check-label" htmlFor="stateInactive">
                    Convert all your Premium requests to non-Premium requests
                  </label>
                </div>
                <div className="modal-footer">
                  <button
                    className={`${styles.btnModal} ${styles.btnSecondary}`}
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className={`${styles.btnModal} ${styles.btnPrimary}`}
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Maintain confirmation modal */}
      {(user.onPremiumCancellation === OnPremiumCancellation.DISABLED ||
        user.onPremiumCancellation === OnPremiumCancellation.DEFAULT) && (
        <div
          className="modal fade"
          id="staticBackdrop3"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-labelledby="staticBackdrop3Label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`modal-header ${styles.modalHeader}`}>
                  <h1
                    className={`m-0 ${styles.modalTitle}`}
                    id="staticBackdrop3Label"
                  >
                    Maintain your Premium plan
                  </h1>
                </div>
                <div className="modal-body py-4">Stay with us</div>
                <div className="modal-footer">
                  <button
                    className={`${styles.btnModal} ${styles.btnSecondary}`}
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className={`${styles.btnModal} ${styles.btnPrimary}`}
                    {...register("onPremiumCancellation")}
                    onClick={() =>
                      setOnPremiumCancellation(OnPremiumCancellation.STAY)
                    }
                  >
                    Maintain
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5 d-flex flex-wrap gap-5 gap-md-3">
        {/* Your plan */}
        <div className={`col-12 col-md-6 ${styles.container}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-coin"></i> Your plan
          </h2>
          <div className={`${styles.content}`}>
            <div>
              <div className={`${styles.label}`}>Billing type</div>
              <p className={`${styles.value}`}>
                {user.premiumPlan!.charAt(0).toUpperCase() +
                  user.premiumPlan!.slice(1)}
              </p>
              <div className={`${styles.label}`}>Price</div>
              <p className={`${styles.value}`}>
                {user.premiumPlan === "annually" ? "€9.99" : "€0.99"}
              </p>
              <div className={`${styles.label}`}>Billing period</div>
              <p className={`${styles.value}`}>
                {formatDateString(user.premiumStartPeriod!) +
                  " - " +
                  formatDateString(user.premiumEndPeriod!)}
              </p>
              <div className={`${styles.label}`}>Next payment</div>
              {user.onPremiumCancellation === OnPremiumCancellation.DISABLED ||
              user.onPremiumCancellation === OnPremiumCancellation.DEFAULT ? (
                <p className={`${styles.value}`}>-</p>
              ) : (
                <p className={`${styles.value}`}>
                  {formatDateString(user.premiumEndPeriod!)}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Payment informations */}
        <div className={`col ${styles.container}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            <i className="bi bi-credit-card"></i> Payment informations
          </h2>
          <div className={`${styles.content}`}>
            <div>
              <div className={`${styles.label}`}>Credit card</div>
              <p className={`${styles.value}`}>{"**** **** **** 1234"}</p>
              <div className={`${styles.label}`}>Expiration date</div>
              <p className={`${styles.value}`}>{"02/25"}</p>
            </div>
          </div>
        </div>
        {/* Cancel your plan */}
        <div className={`col-12 col-md-6 ${styles.container}`}>
          <h2 className={`${styles.header} mt-md-3`}>
            {user.onPremiumCancellation === OnPremiumCancellation.DISABLED ||
            user.onPremiumCancellation === OnPremiumCancellation.DEFAULT ? (
              <>
                <i className="bi bi-check-circle"></i> Maintain your plan
              </>
            ) : (
              <>
                <i className="bi bi-x-circle"></i> Cancel your plan
              </>
            )}
          </h2>
          <div className={`${styles.content}`}>
            <div>
              {user.onPremiumCancellation === OnPremiumCancellation.DISABLED ||
              user.onPremiumCancellation === OnPremiumCancellation.DEFAULT ? (
                <>
                  <p>
                    You have chosen to cancel your plan and
                    {user.onPremiumCancellation ===
                    OnPremiumCancellation.DISABLED
                      ? " to deactivate your Premium requests "
                      : " to convert your Premium requests to non-Premium requests "}
                    at the end of the billing period.
                  </p>
                  <p>
                    You can undo your choice by clicking the following button.
                  </p>
                </>
              ) : (
                <p>
                  You can cancel your Premium plan at any time. Premium features
                  will be available until the end of billing period. You can
                  also reactivate your Premium plan until the end of billing
                  period.
                </p>
              )}
              {user.onPremiumCancellation === OnPremiumCancellation.DISABLED ||
              user.onPremiumCancellation === OnPremiumCancellation.DEFAULT ? (
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop3"
                  className={`${styles.button}`}
                >
                  Maintain your plan
                </button>
              ) : (
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  className={`${styles.button}`}
                >
                  Cancel your plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPremium;
