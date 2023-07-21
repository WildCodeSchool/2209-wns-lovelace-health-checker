/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query MyProfile {\n    myProfile {\n      id\n      firstname\n      lastname\n      role\n      email\n      premiumPlan\n      onPremiumCancellation\n      premiumStartPeriod\n      premiumEndPeriod\n    }\n  }\n": types.MyProfileDocument,
    "\n    mutation UpdateIdentity($lastname: String!, $firstname: String!) {\n      updateIdentity(lastname: $lastname, firstname: $firstname) {\n        lastname\n        firstname\n      }\n    }\n  ": types.UpdateIdentityDocument,
    "\n    mutation UpdatePassword(\n      $currentPassword: String!\n      $newPassword: String!\n      $newPasswordConfirmation: String!\n      $disconnectMe: Boolean!\n    ) {\n      updatePassword(\n        currentPassword: $currentPassword\n        newPassword: $newPassword\n        newPasswordConfirmation: $newPasswordConfirmation\n        disconnectMe: $disconnectMe\n      )\n    }\n  ": types.UpdatePasswordDocument,
    "\n    mutation UpdateEmail($newEmail: String!) {\n      updateEmail(newEmail: $newEmail)\n    }\n  ": types.UpdateEmailDocument,
    "\n  mutation ModifyPremiumSubscription($onPremiumCancellation: String!) {\n    modifyPremiumSubscription(onPremiumCancellation: $onPremiumCancellation)\n  }\n": types.ModifyPremiumSubscriptionDocument,
    "\n  mutation DeleteUser($currentPassword: String!) {\n    deleteUser(currentPassword: $currentPassword)\n  }\n": types.DeleteUserDocument,
    "\n  query GetPageOfRequestSettingWithLastResult(\n    $first: Int!\n    $rows: Int!\n    $page: Int!\n    $sortField: String!\n    $sortOrder: Int!\n    $filters: [Filter!]\n  ) {\n    getPageOfRequestSettingWithLastResult(\n      first: $first\n      rows: $rows\n      page: $page\n      sortField: $sortField\n      sortOrder: $sortOrder\n      filters: $filters\n    ) {\n      totalCount\n      requestSettingsWithLastResult {\n        requestResult {\n          getIsAvailable\n          statusCode\n          createdAt\n        }\n        requestSetting {\n          id\n          url\n          name\n          frequency\n        }\n      }\n    }\n  }\n": types.GetPageOfRequestSettingWithLastResultDocument,
    "\n  query CheckUrlLaunchedManually($checkUrlLaunchedManuallyId: String!) {\n    checkUrlLaunchedManually(id: $checkUrlLaunchedManuallyId) {\n      id\n      createdAt\n      url\n      getIsAvailable\n      statusCode\n      duration\n      headers\n    }\n  }\n": types.CheckUrlLaunchedManuallyDocument,
    "\n  mutation DeleteRequest($requestId: String!) {\n    deleteRequestSetting(requestId: $requestId)\n  }\n": types.DeleteRequestDocument,
    "\n  query getPageOfRequestResult(\n    $first: Int!\n    $rows: Int!\n    $page: Int!\n    $sortField: String!\n    $sortOrder: Int!\n    $settingId: String!\n    $filters: [Filter!]\n  ) {\n    getPageOfRequestResult(\n      first: $first\n      rows: $rows\n      page: $page\n      sortField: $sortField\n      sortOrder: $sortOrder\n      settingId: $settingId\n      filters: $filters\n    ) {\n      totalCount\n      requestResults {\n        createdAt\n        duration\n        getIsAvailable\n        id\n        statusCode\n      }\n    }\n  }\n": types.GetPageOfRequestResultDocument,
    "\n  mutation SignOut {\n    signOut\n  }\n": types.SignOutDocument,
    "\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n": types.ConfirmAccountDocument,
    "\n  mutation ConfirmEmail($confirmationToken: String!) {\n    confirmEmail(confirmationToken: $confirmationToken)\n  }\n": types.ConfirmEmailDocument,
    "\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n": types.AskForNewPasswordDocument,
    "\n  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {\n    checkIfNonPremiumUserHasReachedMaxRequestsCount\n  }\n": types.CheckIfNonPremiumUserHasReachedMaxRequestsCountDocument,
    "\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n": types.CheckUrlDocument,
    "\n  mutation SubscribePremium($plan: String!) {\n    subscribePremium(plan: $plan) {\n      url\n    }\n  }\n": types.SubscribePremiumDocument,
    "\n  mutation CreateRequestSetting(\n    $url: String!\n    $frequency: Float!\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $name: String\n    $headers: String\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    create(\n      url: $url\n      frequency: $frequency\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      name: $name\n      headers: $headers\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      frequency\n      isActive\n      headers\n      alerts {\n        type\n        httpStatusCode\n      }\n    }\n  }\n": types.CreateRequestSettingDocument,
    "\n  mutation UpdateRequestSetting(\n    $updateRequestSettingId: String!\n    $url: String!\n    $frequency: Float!\n    $name: String\n    $headers: String\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    updateRequestSetting(\n      id: $updateRequestSettingId\n      url: $url\n      frequency: $frequency\n      name: $name\n      headers: $headers\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      isActive\n      createdAt\n      updatedAt\n      frequency\n      headers\n      alerts {\n        id\n        httpStatusCode\n        type\n      }\n    }\n  }\n": types.UpdateRequestSettingDocument,
    "\n  query GetRequestSettingById($id: String!) {\n    getRequestSettingById(id: $id) {\n      requestSetting {\n        id\n        createdAt\n        url\n        name\n        isActive\n        frequency\n        headers\n        alerts {\n          httpStatusCode\n          type\n        }\n      }\n      requestResult {\n        id\n        createdAt\n        statusCode\n        duration\n        getIsAvailable\n      }\n    }\n  }\n": types.GetRequestSettingByIdDocument,
    "\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n": types.ResetPasswordDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n      role\n    }\n  }\n": types.SignInDocument,
    "\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n": types.ResendAccountConfirmationTokenDocument,
    "\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n": types.SignUpDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyProfile {\n    myProfile {\n      id\n      firstname\n      lastname\n      role\n      email\n      premiumPlan\n      onPremiumCancellation\n      premiumStartPeriod\n      premiumEndPeriod\n    }\n  }\n"): (typeof documents)["\n  query MyProfile {\n    myProfile {\n      id\n      firstname\n      lastname\n      role\n      email\n      premiumPlan\n      onPremiumCancellation\n      premiumStartPeriod\n      premiumEndPeriod\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateIdentity($lastname: String!, $firstname: String!) {\n      updateIdentity(lastname: $lastname, firstname: $firstname) {\n        lastname\n        firstname\n      }\n    }\n  "): (typeof documents)["\n    mutation UpdateIdentity($lastname: String!, $firstname: String!) {\n      updateIdentity(lastname: $lastname, firstname: $firstname) {\n        lastname\n        firstname\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdatePassword(\n      $currentPassword: String!\n      $newPassword: String!\n      $newPasswordConfirmation: String!\n      $disconnectMe: Boolean!\n    ) {\n      updatePassword(\n        currentPassword: $currentPassword\n        newPassword: $newPassword\n        newPasswordConfirmation: $newPasswordConfirmation\n        disconnectMe: $disconnectMe\n      )\n    }\n  "): (typeof documents)["\n    mutation UpdatePassword(\n      $currentPassword: String!\n      $newPassword: String!\n      $newPasswordConfirmation: String!\n      $disconnectMe: Boolean!\n    ) {\n      updatePassword(\n        currentPassword: $currentPassword\n        newPassword: $newPassword\n        newPasswordConfirmation: $newPasswordConfirmation\n        disconnectMe: $disconnectMe\n      )\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateEmail($newEmail: String!) {\n      updateEmail(newEmail: $newEmail)\n    }\n  "): (typeof documents)["\n    mutation UpdateEmail($newEmail: String!) {\n      updateEmail(newEmail: $newEmail)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ModifyPremiumSubscription($onPremiumCancellation: String!) {\n    modifyPremiumSubscription(onPremiumCancellation: $onPremiumCancellation)\n  }\n"): (typeof documents)["\n  mutation ModifyPremiumSubscription($onPremiumCancellation: String!) {\n    modifyPremiumSubscription(onPremiumCancellation: $onPremiumCancellation)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUser($currentPassword: String!) {\n    deleteUser(currentPassword: $currentPassword)\n  }\n"): (typeof documents)["\n  mutation DeleteUser($currentPassword: String!) {\n    deleteUser(currentPassword: $currentPassword)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPageOfRequestSettingWithLastResult(\n    $first: Int!\n    $rows: Int!\n    $page: Int!\n    $sortField: String!\n    $sortOrder: Int!\n    $filters: [Filter!]\n  ) {\n    getPageOfRequestSettingWithLastResult(\n      first: $first\n      rows: $rows\n      page: $page\n      sortField: $sortField\n      sortOrder: $sortOrder\n      filters: $filters\n    ) {\n      totalCount\n      requestSettingsWithLastResult {\n        requestResult {\n          getIsAvailable\n          statusCode\n          createdAt\n        }\n        requestSetting {\n          id\n          url\n          name\n          frequency\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPageOfRequestSettingWithLastResult(\n    $first: Int!\n    $rows: Int!\n    $page: Int!\n    $sortField: String!\n    $sortOrder: Int!\n    $filters: [Filter!]\n  ) {\n    getPageOfRequestSettingWithLastResult(\n      first: $first\n      rows: $rows\n      page: $page\n      sortField: $sortField\n      sortOrder: $sortOrder\n      filters: $filters\n    ) {\n      totalCount\n      requestSettingsWithLastResult {\n        requestResult {\n          getIsAvailable\n          statusCode\n          createdAt\n        }\n        requestSetting {\n          id\n          url\n          name\n          frequency\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CheckUrlLaunchedManually($checkUrlLaunchedManuallyId: String!) {\n    checkUrlLaunchedManually(id: $checkUrlLaunchedManuallyId) {\n      id\n      createdAt\n      url\n      getIsAvailable\n      statusCode\n      duration\n      headers\n    }\n  }\n"): (typeof documents)["\n  query CheckUrlLaunchedManually($checkUrlLaunchedManuallyId: String!) {\n    checkUrlLaunchedManually(id: $checkUrlLaunchedManuallyId) {\n      id\n      createdAt\n      url\n      getIsAvailable\n      statusCode\n      duration\n      headers\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteRequest($requestId: String!) {\n    deleteRequestSetting(requestId: $requestId)\n  }\n"): (typeof documents)["\n  mutation DeleteRequest($requestId: String!) {\n    deleteRequestSetting(requestId: $requestId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPageOfRequestResult(\n    $first: Int!\n    $rows: Int!\n    $page: Int!\n    $sortField: String!\n    $sortOrder: Int!\n    $settingId: String!\n    $filters: [Filter!]\n  ) {\n    getPageOfRequestResult(\n      first: $first\n      rows: $rows\n      page: $page\n      sortField: $sortField\n      sortOrder: $sortOrder\n      settingId: $settingId\n      filters: $filters\n    ) {\n      totalCount\n      requestResults {\n        createdAt\n        duration\n        getIsAvailable\n        id\n        statusCode\n      }\n    }\n  }\n"): (typeof documents)["\n  query getPageOfRequestResult(\n    $first: Int!\n    $rows: Int!\n    $page: Int!\n    $sortField: String!\n    $sortOrder: Int!\n    $settingId: String!\n    $filters: [Filter!]\n  ) {\n    getPageOfRequestResult(\n      first: $first\n      rows: $rows\n      page: $page\n      sortField: $sortField\n      sortOrder: $sortOrder\n      settingId: $settingId\n      filters: $filters\n    ) {\n      totalCount\n      requestResults {\n        createdAt\n        duration\n        getIsAvailable\n        id\n        statusCode\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignOut {\n    signOut\n  }\n"): (typeof documents)["\n  mutation SignOut {\n    signOut\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n"): (typeof documents)["\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmEmail($confirmationToken: String!) {\n    confirmEmail(confirmationToken: $confirmationToken)\n  }\n"): (typeof documents)["\n  mutation ConfirmEmail($confirmationToken: String!) {\n    confirmEmail(confirmationToken: $confirmationToken)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n"): (typeof documents)["\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {\n    checkIfNonPremiumUserHasReachedMaxRequestsCount\n  }\n"): (typeof documents)["\n  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {\n    checkIfNonPremiumUserHasReachedMaxRequestsCount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n"): (typeof documents)["\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SubscribePremium($plan: String!) {\n    subscribePremium(plan: $plan) {\n      url\n    }\n  }\n"): (typeof documents)["\n  mutation SubscribePremium($plan: String!) {\n    subscribePremium(plan: $plan) {\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRequestSetting(\n    $url: String!\n    $frequency: Float!\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $name: String\n    $headers: String\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    create(\n      url: $url\n      frequency: $frequency\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      name: $name\n      headers: $headers\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      frequency\n      isActive\n      headers\n      alerts {\n        type\n        httpStatusCode\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRequestSetting(\n    $url: String!\n    $frequency: Float!\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $name: String\n    $headers: String\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    create(\n      url: $url\n      frequency: $frequency\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      name: $name\n      headers: $headers\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      frequency\n      isActive\n      headers\n      alerts {\n        type\n        httpStatusCode\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateRequestSetting(\n    $updateRequestSettingId: String!\n    $url: String!\n    $frequency: Float!\n    $name: String\n    $headers: String\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    updateRequestSetting(\n      id: $updateRequestSettingId\n      url: $url\n      frequency: $frequency\n      name: $name\n      headers: $headers\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      isActive\n      createdAt\n      updatedAt\n      frequency\n      headers\n      alerts {\n        id\n        httpStatusCode\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRequestSetting(\n    $updateRequestSettingId: String!\n    $url: String!\n    $frequency: Float!\n    $name: String\n    $headers: String\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    updateRequestSetting(\n      id: $updateRequestSettingId\n      url: $url\n      frequency: $frequency\n      name: $name\n      headers: $headers\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      isActive\n      createdAt\n      updatedAt\n      frequency\n      headers\n      alerts {\n        id\n        httpStatusCode\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRequestSettingById($id: String!) {\n    getRequestSettingById(id: $id) {\n      requestSetting {\n        id\n        createdAt\n        url\n        name\n        isActive\n        frequency\n        headers\n        alerts {\n          httpStatusCode\n          type\n        }\n      }\n      requestResult {\n        id\n        createdAt\n        statusCode\n        duration\n        getIsAvailable\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRequestSettingById($id: String!) {\n    getRequestSettingById(id: $id) {\n      requestSetting {\n        id\n        createdAt\n        url\n        name\n        isActive\n        frequency\n        headers\n        alerts {\n          httpStatusCode\n          type\n        }\n      }\n      requestResult {\n        id\n        createdAt\n        statusCode\n        duration\n        getIsAvailable\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n"): (typeof documents)["\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n"): (typeof documents)["\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;