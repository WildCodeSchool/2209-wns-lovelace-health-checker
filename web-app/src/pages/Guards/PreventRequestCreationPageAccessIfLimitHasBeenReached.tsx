import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery } from "../../gql/graphql";
import { REQUESTS_ROUTE } from "../../routes";

const CHECK_IF_NON_PREMIUM_USER_HAS_REACHED_MAX_REQUESTS_COUNT = gql`
  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {
    checkIfNonPremiumUserHasReachedMaxRequestsCount
  }
`;

const PreventRequestCreationPageAccessIfLimitHasBeenReached = (props: any) => {
  const { children } = props;

  const [canAccessToRequestCreationPage, setCanAccessToRequestCreationPage] =
    useState(true);

  useQuery<CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery>(
    CHECK_IF_NON_PREMIUM_USER_HAS_REACHED_MAX_REQUESTS_COUNT,
    {
      onCompleted: (data) => {
        setCanAccessToRequestCreationPage(true);
      },
      onError: (error) => {
        setCanAccessToRequestCreationPage(false);
        toast.error(error.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 99,
        });
      },
    }
  );

  if (!canAccessToRequestCreationPage) {
    return <Navigate to={REQUESTS_ROUTE} replace />;
  }
  return children;
};
export default PreventRequestCreationPageAccessIfLimitHasBeenReached;
