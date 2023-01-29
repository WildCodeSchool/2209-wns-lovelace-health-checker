import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AccountBills from '../../components/AccountBills/AccountBills';
import AccountInformations from '../../components/AccountInformations/AccountInformations';
import AccountPremium from '../../components/AccountPremium/AccountPremium';
import { SignOutMutation } from '../../gql/graphql';
import styles from './Account.module.scss';

const Account = ({
  user,
  onLogoutSuccess,
}: {
  user: any;
  onLogoutSuccess(): void;
}) => {
  const [selectedTab, setSelectedTab] = useState("informations");

  const navigate = useNavigate();

  const SIGN_OUT = gql`
    mutation SignOut {
      signOut
    }
  `;

  const [signOut] = useMutation<SignOutMutation>(SIGN_OUT, {
    onCompleted: async (data) => {
      onLogoutSuccess();
      toast.success(data.signOut, {
        position: toast.POSITION.BOTTOM_RIGHT,
        toastId: "logout-success",
      });
      navigate("/");
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
            }}>
            Log out
          </span>
        </div>
        <div className="d-flex gap-4 mt-5">
          <div
            className={`${
              selectedTab === "informations" && styles.selectedTab
            }  ${styles.tabContainer}`}>
            <span
              className={`${styles.tabs} `}
              onClick={() => setSelectedTab("informations")}>
              Informations
            </span>
          </div>
          <div
            className={`${selectedTab === "premium" && styles.selectedTab}  ${
              styles.tabContainer
            }`}>
            <span
              className={`${styles.tabs} `}
              onClick={() => setSelectedTab("premium")}>
              Premium
            </span>
          </div>
          <div
            className={`${selectedTab === "bills" && styles.selectedTab}  ${
              styles.tabContainer
            }`}>
            <span
              className={`${styles.tabs} `}
              onClick={() => setSelectedTab("bills")}>
              Bills
            </span>
          </div>
        </div>
        <div>
          {selectedTab === "informations" && <AccountInformations />}
          {selectedTab === "premium" && <AccountPremium />}
          {selectedTab === "bills" && <AccountBills />}
        </div>
      </div>
    </>
  );
};

export default Account;
