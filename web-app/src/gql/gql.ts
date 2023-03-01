/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

const documents = {
  "\n  query MyProfile {\n    myProfile {\n      id\n      firstname\n      lastname\n      role\n      email\n    }\n  }\n":
    types.MyProfileDocument,
  "\n    mutation UpdateIdentity($lastname: String!, $firstname: String!) {\n      updateIdentity(lastname: $lastname, firstname: $firstname) {\n        lastname\n        firstname\n      }\n    }\n  ":
    types.UpdateIdentityDocument,
  "\n    mutation UpdatePassword(\n      $currentPassword: String!\n      $newPassword: String!\n      $newPasswordConfirmation: String!\n      $disconnectMe: Boolean!\n    ) {\n      updatePassword(\n        currentPassword: $currentPassword\n        newPassword: $newPassword\n        newPasswordConfirmation: $newPasswordConfirmation\n        disconnectMe: $disconnectMe\n      )\n    }\n  ":
    types.UpdatePasswordDocument,
  "\n    mutation UpdateEmail($newEmail: String!) {\n      updateEmail(newEmail: $newEmail)\n    }\n  ":
    types.UpdateEmailDocument,
  "\n  mutation DeleteUser($currentPassword: String!) {\n    deleteUser(currentPassword: $currentPassword)\n  }\n":
    types.DeleteUserDocument,
  "\n  mutation SignOut {\n    signOut\n  }\n": types.SignOutDocument,
  "\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n":
    types.ConfirmAccountDocument,
  "\n  mutation ConfirmEmail($confirmationToken: String!) {\n    confirmEmail(confirmationToken: $confirmationToken)\n  }\n":
    types.ConfirmEmailDocument,
  "\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n":
    types.AskForNewPasswordDocument,
  "\n  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {\n    checkIfNonPremiumUserHasReachedMaxRequestsCount\n  }\n":
    types.CheckIfNonPremiumUserHasReachedMaxRequestsCountDocument,
  "\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n":
    types.CheckUrlDocument,
  "\n  mutation CreateRequestSetting(\n    $url: String!\n    $frequency: Float!\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $name: String\n    $headers: String\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    create(\n      url: $url\n      frequency: $frequency\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      name: $name\n      headers: $headers\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      frequency\n      isActive\n      headers\n      alerts {\n        type\n        httpStatusCode\n      }\n    }\n  }\n":
    types.CreateRequestSettingDocument,
  "\n  query GetRequestSettingById($id: String!) {\n    getRequestSettingById(id: $id) {\n      requestSetting {\n        id\n        createdAt\n        url\n        name\n        isActive\n        frequency\n        headers\n        alerts {\n          httpStatusCode\n          type\n        }\n      }\n      requestResult {\n        id\n        createdAt\n        statusCode\n        duration\n        getIsAvailable\n      }\n    }\n  }\n":
    types.GetRequestSettingByIdDocument,
  "\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n":
    types.ResetPasswordDocument,
  "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n      role\n    }\n  }\n":
    types.SignInDocument,
  "\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n":
    types.ResendAccountConfirmationTokenDocument,
  "\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n":
    types.SignUpDocument,
};

export function graphql(
  source: "\n  query MyProfile {\n    myProfile {\n      id\n      firstname\n      lastname\n      role\n      email\n    }\n  }\n"
): (typeof documents)["\n  query MyProfile {\n    myProfile {\n      id\n      firstname\n      lastname\n      role\n      email\n    }\n  }\n"];
export function graphql(
  source: "\n    mutation UpdateIdentity($lastname: String!, $firstname: String!) {\n      updateIdentity(lastname: $lastname, firstname: $firstname) {\n        lastname\n        firstname\n      }\n    }\n  "
): (typeof documents)["\n    mutation UpdateIdentity($lastname: String!, $firstname: String!) {\n      updateIdentity(lastname: $lastname, firstname: $firstname) {\n        lastname\n        firstname\n      }\n    }\n  "];
export function graphql(
  source: "\n    mutation UpdatePassword(\n      $currentPassword: String!\n      $newPassword: String!\n      $newPasswordConfirmation: String!\n      $disconnectMe: Boolean!\n    ) {\n      updatePassword(\n        currentPassword: $currentPassword\n        newPassword: $newPassword\n        newPasswordConfirmation: $newPasswordConfirmation\n        disconnectMe: $disconnectMe\n      )\n    }\n  "
): (typeof documents)["\n    mutation UpdatePassword(\n      $currentPassword: String!\n      $newPassword: String!\n      $newPasswordConfirmation: String!\n      $disconnectMe: Boolean!\n    ) {\n      updatePassword(\n        currentPassword: $currentPassword\n        newPassword: $newPassword\n        newPasswordConfirmation: $newPasswordConfirmation\n        disconnectMe: $disconnectMe\n      )\n    }\n  "];
export function graphql(
  source: "\n    mutation UpdateEmail($newEmail: String!) {\n      updateEmail(newEmail: $newEmail)\n    }\n  "
): (typeof documents)["\n    mutation UpdateEmail($newEmail: String!) {\n      updateEmail(newEmail: $newEmail)\n    }\n  "];
export function graphql(
  source: "\n  mutation DeleteUser($currentPassword: String!) {\n    deleteUser(currentPassword: $currentPassword)\n  }\n"
): (typeof documents)["\n  mutation DeleteUser($currentPassword: String!) {\n    deleteUser(currentPassword: $currentPassword)\n  }\n"];
export function graphql(
  source: "\n  mutation SignOut {\n    signOut\n  }\n"
): (typeof documents)["\n  mutation SignOut {\n    signOut\n  }\n"];
export function graphql(
  source: "\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n"
): (typeof documents)["\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n"];
export function graphql(
  source: "\n  mutation ConfirmEmail($confirmationToken: String!) {\n    confirmEmail(confirmationToken: $confirmationToken)\n  }\n"
): (typeof documents)["\n  mutation ConfirmEmail($confirmationToken: String!) {\n    confirmEmail(confirmationToken: $confirmationToken)\n  }\n"];
export function graphql(
  source: "\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n"
): (typeof documents)["\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n"];
export function graphql(
  source: "\n  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {\n    checkIfNonPremiumUserHasReachedMaxRequestsCount\n  }\n"
): (typeof documents)["\n  query CheckIfNonPremiumUserHasReachedMaxRequestsCount {\n    checkIfNonPremiumUserHasReachedMaxRequestsCount\n  }\n"];
export function graphql(
  source: "\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n"
): (typeof documents)["\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n"];
export function graphql(
  source: "\n  mutation CreateRequestSetting(\n    $url: String!\n    $frequency: Float!\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $name: String\n    $headers: String\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    create(\n      url: $url\n      frequency: $frequency\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      name: $name\n      headers: $headers\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      frequency\n      isActive\n      headers\n      alerts {\n        type\n        httpStatusCode\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation CreateRequestSetting(\n    $url: String!\n    $frequency: Float!\n    $isActive: Boolean!\n    $allErrorsEnabledEmail: Boolean!\n    $allErrorsEnabledPush: Boolean!\n    $name: String\n    $headers: String\n    $customEmailErrors: [Float!]\n    $customPushErrors: [Float!]\n  ) {\n    create(\n      url: $url\n      frequency: $frequency\n      isActive: $isActive\n      allErrorsEnabledEmail: $allErrorsEnabledEmail\n      allErrorsEnabledPush: $allErrorsEnabledPush\n      name: $name\n      headers: $headers\n      customEmailErrors: $customEmailErrors\n      customPushErrors: $customPushErrors\n    ) {\n      id\n      url\n      name\n      frequency\n      isActive\n      headers\n      alerts {\n        type\n        httpStatusCode\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query GetRequestSettingById($id: String!) {\n    getRequestSettingById(id: $id) {\n      requestSetting {\n        id\n        createdAt\n        url\n        name\n        isActive\n        frequency\n        headers\n        alerts {\n          httpStatusCode\n          type\n        }\n      }\n      requestResult {\n        id\n        createdAt\n        statusCode\n        duration\n        getIsAvailable\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetRequestSettingById($id: String!) {\n    getRequestSettingById(id: $id) {\n      requestSetting {\n        id\n        createdAt\n        url\n        name\n        isActive\n        frequency\n        headers\n        alerts {\n          httpStatusCode\n          type\n        }\n      }\n      requestResult {\n        id\n        createdAt\n        statusCode\n        duration\n        getIsAvailable\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n"
): (typeof documents)["\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n"];
export function graphql(
  source: "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n      role\n    }\n  }\n"
): (typeof documents)["\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n      role\n    }\n  }\n"];
export function graphql(
  source: "\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n"
): (typeof documents)["\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n"];
export function graphql(
  source: "\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n"
): (typeof documents)["\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
