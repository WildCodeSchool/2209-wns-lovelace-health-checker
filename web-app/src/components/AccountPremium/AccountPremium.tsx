import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import styles from "./AccountPremium.module.scss";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  GetPremiumByUserIdQueryQuery,
  ModifyPremiumSubscriptionMutation,
  ModifyPremiumSubscriptionMutationVariables,
} from "../../gql/graphql";
import { toast } from "react-toastify";

const GET_PREMIUM_BY_USER_ID = gql`
  query GetPremiumByUserIdQuery {
    getPremiumByUserId {
      id
      billingType
      price
      startDate
      endDate
    }
  }
`;

const MODIFY_PREMIUM_SUBSCRIPTION = gql`
  mutation ModifyPremiumSubscription(
    $hasCanceledPremium: Boolean!
    $keepPremiumRequestOnPremiumCancellation: Boolean!
  ) {
    modifyPremiumSubscription(
      hasCanceledPremium: $hasCanceledPremium
      keepPremiumRequestOnPremiumCancellation: $keepPremiumRequestOnPremiumCancellation
    )
  }
`;

const AccountPremium = ({
  user,
  onUpdatePremiumSuccess,
}: {
  user: any;
  onUpdatePremiumSuccess(): Promise<void>;
}) => {
  interface Premium {
    id: string;
    billingType: string;
    price: number;
    startDate: any;
    endDate: any;
  }
  const [premium, setPremium] = useState<Premium>();
  const { loading, refetch, data } = useQuery<GetPremiumByUserIdQueryQuery>(
    GET_PREMIUM_BY_USER_ID,
    {
      onCompleted: (data) => {
        setPremium(data.getPremiumByUserId);
      },
      onError: (error) => {
        toast.error(error.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 1,
        });
      },
    }
  );

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
    keepPremiumRequestOnPremiumCancellation: boolean;
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
        hasCanceledPremium: !!!user.hasCanceledPremium,
        keepPremiumRequestOnPremiumCancellation:
          keepPremiumRequestOnPremiumCancellation ? true : false,
      },
    });
  };

  const [
    keepPremiumRequestOnPremiumCancellation,
    setKeepPremiumRequestOnPremiumCancellation,
  ] = useState(true);

  return (
    <>
      {/* Cancel confirmation modal */}
      {!user.hasCanceledPremium && (
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
      {!user.hasCanceledPremium && (
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
                    {...register("keepPremiumRequestOnPremiumCancellation")}
                    checked={keepPremiumRequestOnPremiumCancellation === true}
                    onClick={() =>
                      setKeepPremiumRequestOnPremiumCancellation(true)
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
                    {...register("keepPremiumRequestOnPremiumCancellation")}
                    checked={keepPremiumRequestOnPremiumCancellation === false}
                    onClick={() =>
                      setKeepPremiumRequestOnPremiumCancellation(false)
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
      {user.hasCanceledPremium && (
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
                  >
                    Confirm
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
              <p className={`${styles.value}`}>{premium?.billingType}</p>
              <div className={`${styles.label}`}>Price</div>
              <p className={`${styles.value}`}>{premium?.price}</p>
              <div className={`${styles.label}`}>Billing period</div>
              <p className={`${styles.value}`}>
                {premium?.startDate + " - " + premium?.endDate}
              </p>
              <div className={`${styles.label}`}>Next payment</div>
              {user.hasCanceledPremium ? (
                <p className={`${styles.value}`}>-</p>
              ) : (
                <p className={`${styles.value}`}>{premium?.endDate}</p>
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
            {user.hasCanceledPremium ? (
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
              {user.hasCanceledPremium ? (
                <>
                  <p>
                    You have chosen to cancel your plan and
                    {user.keepPremiumRequestOnPremiumCancellation
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
              {user.hasCanceledPremium ? (
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
