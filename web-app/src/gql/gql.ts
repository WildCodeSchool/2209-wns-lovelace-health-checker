/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n": types.ConfirmAccountDocument,
    "\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n": types.AskForNewPasswordDocument,
    "\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n": types.CheckUrlDocument,
    "\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n": types.ResetPasswordDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n    }\n  }\n": types.SignInDocument,
    "\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n": types.ResendAccountConfirmationTokenDocument,
    "\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n": types.SignUpDocument,
};

export function graphql(source: "\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n"): (typeof documents)["\n  mutation confirmAccount($token: String!) {\n    confirmAccount(token: $token)\n  }\n"];
export function graphql(source: "\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n"): (typeof documents)["\n  mutation AskForNewPassword($email: String!) {\n    askForNewPassword(email: $email)\n  }\n"];
export function graphql(source: "\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n"): (typeof documents)["\n  mutation CheckUrl($url: String!) {\n    checkUrl(url: $url) {\n      getIsAvailable\n      duration\n      statusCode\n    }\n  }\n"];
export function graphql(source: "\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n"): (typeof documents)["\n  mutation ResetPassword(\n    $token: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    resetPassword(\n      token: $token\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    )\n  }\n"];
export function graphql(source: "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      id\n      firstname\n    }\n  }\n"];
export function graphql(source: "\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n"): (typeof documents)["\n  mutation resendAccountConfirmationToken($email: String!) {\n    resendAccountConfirmationToken(email: $email)\n  }\n"];
export function graphql(source: "\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n    $passwordConfirmation: String!\n  ) {\n    signUp(\n      firstname: $firstname\n      lastname: $lastname\n      email: $email\n      password: $password\n      passwordConfirmation: $passwordConfirmation\n    ) {\n      firstname\n      lastname\n      email\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;