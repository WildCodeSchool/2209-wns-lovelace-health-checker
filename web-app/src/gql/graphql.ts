/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AlertSetting = {
  __typename?: 'AlertSetting';
  httpStatusCode: Scalars['Float'];
  id: Scalars['ID'];
  preventAlertUntil: Scalars['DateTime'];
  requestSetting: RequestSetting;
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  askForNewPassword: Scalars['String'];
  checkUrl: RequestResult;
  confirmAccount: Scalars['String'];
  resendAccountConfirmationToken: Scalars['String'];
  signIn: User;
  signUp: User;
};


export type MutationAskForNewPasswordArgs = {
  email: Scalars['String'];
};


export type MutationCheckUrlArgs = {
  url: Scalars['String'];
};


export type MutationConfirmAccountArgs = {
  token: Scalars['String'];
};


export type MutationResendAccountConfirmationTokenArgs = {
  email: Scalars['String'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  myProfile: User;
};

export type RequestResult = {
  __typename?: 'RequestResult';
  createdAt: Scalars['DateTime'];
  duration: Scalars['Float'];
  getIsAvailable: Scalars['Boolean'];
  id: Scalars['ID'];
  requestSetting: RequestSetting;
  statusCode: Scalars['Float'];
};

export type RequestSetting = {
  __typename?: 'RequestSetting';
  alerts: Array<AlertSetting>;
  frequency: Scalars['Float'];
  headers?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  customerId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  firstname: Scalars['String'];
  hasCanceledPremium?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  lastLoggedAt?: Maybe<Scalars['DateTime']>;
  lastname: Scalars['String'];
  requests: Array<RequestSetting>;
  role: Scalars['String'];
  status: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type CheckUrlMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type CheckUrlMutation = { __typename?: 'Mutation', checkUrl: { __typename?: 'RequestResult', getIsAvailable: boolean, duration: number, statusCode: number } };


export const CheckUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getIsAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<CheckUrlMutation, CheckUrlMutationVariables>;