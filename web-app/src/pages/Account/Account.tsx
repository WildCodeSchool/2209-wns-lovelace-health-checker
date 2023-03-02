import { ApolloQueryResult, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AccountBills from "../../components/AccountBills/AccountBills";
import AccountInformations from "../../components/AccountInformations/AccountInformations";
import AccountPremium from "../../components/AccountPremium/AccountPremium";
import { MyProfileQuery, SignOutMutation } from "../../gql/graphql";
import { HOMEPAGE_ROUTE } from "../../routes";
import styles from "./Account.module.scss";

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;

const Account = ({
  user,
  onLogoutSuccess,
  onDeleteSuccess,
}: {
  user: any;
  onLogoutSuccess(): Promise<void>;
  onDeleteSuccess(): Promise<ApolloQueryResult<MyProfileQuery>>;
}) => {
  const [selectedTab, setSelectedTab] = useState("informations");

  const navigate = useNavigate();

  const [signOut] = useMutation<SignOutMutation>(SIGN_OUT, {
    onCompleted: async (data) => {
      await onLogoutSuccess();
      toast.success(data.signOut, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "logout-success",
      });
      navigate(HOMEPAGE_ROUTE);
    },
  });

  return (
    <>
      <div className={`${styles.contentContainer}`}>
        <div className="d-flex justify-content-between">
          <h1 className={`${styles.pageTitle}`}>Account</h1>
          <span
            className={`${styles.logout}`}
            onClick={async () => {
              await signOut();
            }}
          >
            Log out
          </span>
        </div>
        <div className="d-flex gap-4 mt-5">
          <div
            className={`${
              selectedTab === "informations" && styles.selectedTab
            }  ${styles.tabContainer}`}
          >
            <span
              className={`${styles.tabs} `}
              onClick={() => setSelectedTab("informations")}
            >
              Informations
            </span>
          </div>
          <div
            className={`${selectedTab === "premium" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
          >
            <span
              className={`${styles.tabs} `}
              onClick={() => setSelectedTab("premium")}
            >
              Premium
            </span>
          </div>
          <div
            className={`${selectedTab === "bills" && styles.selectedTab}  ${
              styles.tabContainer
            }`}
          >
            <span
              className={`${styles.tabs} `}
              onClick={() => setSelectedTab("bills")}
            >
              Bills
            </span>
          </div>
        </div>
        <div>
          {selectedTab === "informations" && (
            <AccountInformations
              user={user}
              onDeleteSuccess={onDeleteSuccess}
            />
          )}
          {selectedTab === "premium" && <AccountPremium />}
          {selectedTab === "bills" && <AccountBills />}
        </div>
      </div>
    </>
  );
};

export default Account;
