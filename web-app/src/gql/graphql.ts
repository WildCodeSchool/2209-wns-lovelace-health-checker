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

export type Filter = {
  constraints: Array<FilterConstraint>;
  field: Scalars['String'];
  operator: Scalars['String'];
};

export type FilterConstraint = {
  matchMode: Scalars['String'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  askForNewPassword: Scalars['String'];
  checkUrl: RequestResult;
  confirmAccount: Scalars['Boolean'];
  confirmEmail: Scalars['Boolean'];
  create: RequestSetting;
  deleteRequestSetting: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  modifyPremiumSubscription: Scalars['Boolean'];
  resendAccountConfirmationToken: Scalars['String'];
  resetPassword: Scalars['String'];
  signIn: User;
  signOut: Scalars['String'];
  signUp: User;
  subscribePremium: StripeCheckout;
  updateEmail: Scalars['String'];
  updateIdentity: User;
  updatePassword: Scalars['String'];
  updateRequestSetting: RequestSetting;
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


export type MutationConfirmEmailArgs = {
  confirmationToken: Scalars['String'];
};


export type MutationCreateArgs = {
  allErrorsEnabledEmail: Scalars['Boolean'];
  allErrorsEnabledPush: Scalars['Boolean'];
  customEmailErrors?: InputMaybe<Array<Scalars['Float']>>;
  customPushErrors?: InputMaybe<Array<Scalars['Float']>>;
  frequency: Scalars['Float'];
  headers?: InputMaybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};


export type MutationDeleteRequestSettingArgs = {
  requestId: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  currentPassword: Scalars['String'];
};


export type MutationModifyPremiumSubscriptionArgs = {
  hasCanceledPremium: Scalars['Boolean'];
  keepPremiumRequestOnPremiumCancellation: Scalars['Boolean'];
};


export type MutationResendAccountConfirmationTokenArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  token: Scalars['String'];
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


export type MutationSubscribePremiumArgs = {
  plan: Scalars['String'];
};


export type MutationUpdateEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationUpdateIdentityArgs = {
  firstname: Scalars['String'];
  lastname: Scalars['String'];
};


export type MutationUpdatePasswordArgs = {
  currentPassword: Scalars['String'];
  disconnectMe: Scalars['Boolean'];
  newPassword: Scalars['String'];
  newPasswordConfirmation: Scalars['String'];
};


export type MutationUpdateRequestSettingArgs = {
  allErrorsEnabledEmail: Scalars['Boolean'];
  allErrorsEnabledPush: Scalars['Boolean'];
  customEmailErrors?: InputMaybe<Array<Scalars['Float']>>;
  customPushErrors?: InputMaybe<Array<Scalars['Float']>>;
  frequency: Scalars['Float'];
  headers?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  isActive: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type PageOfRequestResult = {
  __typename?: 'PageOfRequestResult';
  requestResults: Array<RequestResult>;
  totalCount: Scalars['Int'];
};

export type PageOfRequestSettingWithLastResult = {
  __typename?: 'PageOfRequestSettingWithLastResult';
  requestSettingsWithLastResult: Array<RequestSettingWithLastResult>;
  totalCount: Scalars['Int'];
};

export type Premium = {
  __typename?: 'Premium';
  billingType: Scalars['String'];
  endDate: Scalars['DateTime'];
  id: Scalars['ID'];
  price: Scalars['Float'];
  startDate: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  checkIfNonPremiumUserHasReachedMaxRequestsCount: Scalars['Boolean'];
  checkUrlLaunchedManually: RequestResult;
  getPageOfRequestResult: PageOfRequestResult;
  getPageOfRequestSettingWithLastResult: PageOfRequestSettingWithLastResult;
  getPremiumByUserId: Premium;
  getRequestSettingById: RequestSettingWithLastResult;
  myProfile: User;
};


export type QueryCheckUrlLaunchedManuallyArgs = {
  id: Scalars['String'];
};


export type QueryGetPageOfRequestResultArgs = {
  filters?: InputMaybe<Array<Filter>>;
  first: Scalars['Int'];
  page: Scalars['Int'];
  rows: Scalars['Int'];
  settingId: Scalars['String'];
  sortField: Scalars['String'];
  sortOrder: Scalars['Int'];
};


export type QueryGetPageOfRequestSettingWithLastResultArgs = {
  filters?: InputMaybe<Array<Filter>>;
  first: Scalars['Int'];
  page: Scalars['Int'];
  rows: Scalars['Int'];
  sortField: Scalars['String'];
  sortOrder: Scalars['Int'];
};


export type QueryGetRequestSettingByIdArgs = {
  id: Scalars['String'];
};

export type RequestResult = {
  __typename?: 'RequestResult';
  alerts: Array<RequestResult>;
  createdAt: Scalars['DateTime'];
  duration?: Maybe<Scalars['Float']>;
  getIsAvailable: Scalars['Boolean'];
  headers?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  requestSetting: RequestSetting;
  statusCode?: Maybe<Scalars['Float']>;
  url: Scalars['String'];
};

export type RequestSetting = {
  __typename?: 'RequestSetting';
  alerts: Array<AlertSetting>;
  createdAt: Scalars['DateTime'];
  frequency: Scalars['Float'];
  headers?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  results: Array<RequestResult>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  url: Scalars['String'];
};

export type RequestSettingWithLastResult = {
  __typename?: 'RequestSettingWithLastResult';
  requestResult?: Maybe<RequestResult>;
  requestSetting: RequestSetting;
};

export type StripeCheckout = {
  __typename?: 'StripeCheckout';
  url?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  customerId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  firstname: Scalars['String'];
  hasCanceledPremium?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  keepPremiumRequestOnPremiumCancellation?: Maybe<Scalars['Boolean']>;
  lastLoggedAt?: Maybe<Scalars['DateTime']>;
  lastname: Scalars['String'];
  requests: Array<RequestSetting>;
  role: Scalars['String'];
  status: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = { __typename?: 'Query', myProfile: { __typename?: 'User', id: string, firstname: string, lastname: string, role: string, email: string, hasCanceledPremium?: boolean | null, keepPremiumRequestOnPremiumCancellation?: boolean | null } };

export type UpdateIdentityMutationVariables = Exact<{
  lastname: Scalars['String'];
  firstname: Scalars['String'];
}>;


export type UpdateIdentityMutation = { __typename?: 'Mutation', updateIdentity: { __typename?: 'User', lastname: string, firstname: string } };

export type UpdatePasswordMutationVariables = Exact<{
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
  newPasswordConfirmation: Scalars['String'];
  disconnectMe: Scalars['Boolean'];
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword: string };

export type UpdateEmailMutationVariables = Exact<{
  newEmail: Scalars['String'];
}>;


export type UpdateEmailMutation = { __typename?: 'Mutation', updateEmail: string };

export type GetPremiumByUserIdQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPremiumByUserIdQueryQuery = { __typename?: 'Query', getPremiumByUserId: { __typename?: 'Premium', id: string, billingType: string, price: number, startDate: any, endDate: any } };

export type ModifyPremiumSubscriptionMutationVariables = Exact<{
  hasCanceledPremium: Scalars['Boolean'];
  keepPremiumRequestOnPremiumCancellation: Scalars['Boolean'];
}>;


export type ModifyPremiumSubscriptionMutation = { __typename?: 'Mutation', modifyPremiumSubscription: boolean };

export type DeleteUserMutationVariables = Exact<{
  currentPassword: Scalars['String'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type GetPageOfRequestSettingWithLastResultQueryVariables = Exact<{
  first: Scalars['Int'];
  rows: Scalars['Int'];
  page: Scalars['Int'];
  sortField: Scalars['String'];
  sortOrder: Scalars['Int'];
  filters?: InputMaybe<Array<Filter> | Filter>;
}>;


export type GetPageOfRequestSettingWithLastResultQuery = { __typename?: 'Query', getPageOfRequestSettingWithLastResult: { __typename?: 'PageOfRequestSettingWithLastResult', totalCount: number, requestSettingsWithLastResult: Array<{ __typename?: 'RequestSettingWithLastResult', requestResult?: { __typename?: 'RequestResult', getIsAvailable: boolean, statusCode?: number | null, createdAt: any } | null, requestSetting: { __typename?: 'RequestSetting', id: string, url: string, name?: string | null, frequency: number } }> } };

export type CheckUrlLaunchedManuallyQueryVariables = Exact<{
  checkUrlLaunchedManuallyId: Scalars['String'];
}>;


export type CheckUrlLaunchedManuallyQuery = { __typename?: 'Query', checkUrlLaunchedManually: { __typename?: 'RequestResult', id: string, createdAt: any, url: string, getIsAvailable: boolean, statusCode?: number | null, duration?: number | null, headers?: string | null } };

export type DeleteRequestMutationVariables = Exact<{
  requestId: Scalars['String'];
}>;


export type DeleteRequestMutation = { __typename?: 'Mutation', deleteRequestSetting: boolean };

export type GetPageOfRequestResultQueryVariables = Exact<{
  first: Scalars['Int'];
  rows: Scalars['Int'];
  page: Scalars['Int'];
  sortField: Scalars['String'];
  sortOrder: Scalars['Int'];
  settingId: Scalars['String'];
  filters?: InputMaybe<Array<Filter> | Filter>;
}>;


export type GetPageOfRequestResultQuery = { __typename?: 'Query', getPageOfRequestResult: { __typename?: 'PageOfRequestResult', totalCount: number, requestResults: Array<{ __typename?: 'RequestResult', createdAt: any, duration?: number | null, getIsAvailable: boolean, id: string, statusCode?: number | null }> } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut: string };

export type ConfirmAccountMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ConfirmAccountMutation = { __typename?: 'Mutation', confirmAccount: boolean };

export type ConfirmEmailMutationVariables = Exact<{
  confirmationToken: Scalars['String'];
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: boolean };

export type AskForNewPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type AskForNewPasswordMutation = { __typename?: 'Mutation', askForNewPassword: string };

export type CheckIfNonPremiumUserHasReachedMaxRequestsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery = { __typename?: 'Query', checkIfNonPremiumUserHasReachedMaxRequestsCount: boolean };

export type CheckUrlMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type CheckUrlMutation = { __typename?: 'Mutation', checkUrl: { __typename?: 'RequestResult', getIsAvailable: boolean, duration?: number | null, statusCode?: number | null } };

export type SubscribePremiumMutationVariables = Exact<{
  plan: Scalars['String'];
}>;


export type SubscribePremiumMutation = { __typename?: 'Mutation', subscribePremium: { __typename?: 'StripeCheckout', url?: string | null } };

export type CreateRequestSettingMutationVariables = Exact<{
  url: Scalars['String'];
  frequency: Scalars['Float'];
  isActive: Scalars['Boolean'];
  allErrorsEnabledEmail: Scalars['Boolean'];
  allErrorsEnabledPush: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  headers?: InputMaybe<Scalars['String']>;
  customEmailErrors?: InputMaybe<Array<Scalars['Float']> | Scalars['Float']>;
  customPushErrors?: InputMaybe<Array<Scalars['Float']> | Scalars['Float']>;
}>;


export type CreateRequestSettingMutation = { __typename?: 'Mutation', create: { __typename?: 'RequestSetting', id: string, url: string, name?: string | null, frequency: number, isActive: boolean, headers?: string | null, alerts: Array<{ __typename?: 'AlertSetting', type: string, httpStatusCode: number }> } };

export type UpdateRequestSettingMutationVariables = Exact<{
  updateRequestSettingId: Scalars['String'];
  url: Scalars['String'];
  frequency: Scalars['Float'];
  name?: InputMaybe<Scalars['String']>;
  headers?: InputMaybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  allErrorsEnabledEmail: Scalars['Boolean'];
  allErrorsEnabledPush: Scalars['Boolean'];
  customEmailErrors?: InputMaybe<Array<Scalars['Float']> | Scalars['Float']>;
  customPushErrors?: InputMaybe<Array<Scalars['Float']> | Scalars['Float']>;
}>;


export type UpdateRequestSettingMutation = { __typename?: 'Mutation', updateRequestSetting: { __typename?: 'RequestSetting', id: string, url: string, name?: string | null, isActive: boolean, createdAt: any, updatedAt?: any | null, frequency: number, headers?: string | null, alerts: Array<{ __typename?: 'AlertSetting', id: string, httpStatusCode: number, type: string }> } };

export type GetRequestSettingByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetRequestSettingByIdQuery = { __typename?: 'Query', getRequestSettingById: { __typename?: 'RequestSettingWithLastResult', requestSetting: { __typename?: 'RequestSetting', id: string, createdAt: any, url: string, name?: string | null, isActive: boolean, frequency: number, headers?: string | null, alerts: Array<{ __typename?: 'AlertSetting', httpStatusCode: number, type: string }> }, requestResult?: { __typename?: 'RequestResult', id: string, createdAt: any, statusCode?: number | null, duration?: number | null, getIsAvailable: boolean } | null } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: string };

export type SignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'User', id: string, firstname: string, role: string } };

export type ResendAccountConfirmationTokenMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ResendAccountConfirmationTokenMutation = { __typename?: 'Mutation', resendAccountConfirmationToken: string };

export type SignUpMutationVariables = Exact<{
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'User', firstname: string, lastname: string, email: string } };


export const MyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"hasCanceledPremium"}},{"kind":"Field","name":{"kind":"Name","value":"keepPremiumRequestOnPremiumCancellation"}}]}}]}}]} as unknown as DocumentNode<MyProfileQuery, MyProfileQueryVariables>;
export const UpdateIdentityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIdentity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIdentity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}}]}}]}}]} as unknown as DocumentNode<UpdateIdentityMutation, UpdateIdentityMutationVariables>;
export const UpdatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPasswordConfirmation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disconnectMe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currentPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPasswordConfirmation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPasswordConfirmation"}}},{"kind":"Argument","name":{"kind":"Name","value":"disconnectMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disconnectMe"}}}]}]}}]} as unknown as DocumentNode<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const UpdateEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEmail"}}}]}]}}]} as unknown as DocumentNode<UpdateEmailMutation, UpdateEmailMutationVariables>;
export const GetPremiumByUserIdQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPremiumByUserIdQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPremiumByUserId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<GetPremiumByUserIdQueryQuery, GetPremiumByUserIdQueryQueryVariables>;
export const ModifyPremiumSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ModifyPremiumSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hasCanceledPremium"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepPremiumRequestOnPremiumCancellation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifyPremiumSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hasCanceledPremium"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hasCanceledPremium"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepPremiumRequestOnPremiumCancellation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepPremiumRequestOnPremiumCancellation"}}}]}]}}]} as unknown as DocumentNode<ModifyPremiumSubscriptionMutation, ModifyPremiumSubscriptionMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currentPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentPassword"}}}]}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const GetPageOfRequestSettingWithLastResultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPageOfRequestSettingWithLastResult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rows"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortField"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPageOfRequestSettingWithLastResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"rows"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rows"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortField"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortField"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"requestSettingsWithLastResult"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestResult"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getIsAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestSetting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPageOfRequestSettingWithLastResultQuery, GetPageOfRequestSettingWithLastResultQueryVariables>;
export const CheckUrlLaunchedManuallyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckUrlLaunchedManually"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkUrlLaunchedManuallyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkUrlLaunchedManually"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkUrlLaunchedManuallyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"getIsAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"headers"}}]}}]}}]} as unknown as DocumentNode<CheckUrlLaunchedManuallyQuery, CheckUrlLaunchedManuallyQueryVariables>;
export const DeleteRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRequestSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}}}]}]}}]} as unknown as DocumentNode<DeleteRequestMutation, DeleteRequestMutationVariables>;
export const GetPageOfRequestResultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPageOfRequestResult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rows"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortField"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"settingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPageOfRequestResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"rows"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rows"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortField"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortField"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}},{"kind":"Argument","name":{"kind":"Name","value":"settingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"settingId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"requestResults"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"getIsAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]}}]} as unknown as DocumentNode<GetPageOfRequestResultQuery, GetPageOfRequestResultQueryVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const ConfirmAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"confirmAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<ConfirmAccountMutation, ConfirmAccountMutationVariables>;
export const ConfirmEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confirmationToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"confirmationToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confirmationToken"}}}]}]}}]} as unknown as DocumentNode<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export const AskForNewPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AskForNewPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"askForNewPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<AskForNewPasswordMutation, AskForNewPasswordMutationVariables>;
export const CheckIfNonPremiumUserHasReachedMaxRequestsCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckIfNonPremiumUserHasReachedMaxRequestsCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkIfNonPremiumUserHasReachedMaxRequestsCount"}}]}}]} as unknown as DocumentNode<CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery, CheckIfNonPremiumUserHasReachedMaxRequestsCountQueryVariables>;
export const CheckUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getIsAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<CheckUrlMutation, CheckUrlMutationVariables>;
export const SubscribePremiumDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubscribePremium"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plan"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribePremium"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"plan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plan"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<SubscribePremiumMutation, SubscribePremiumMutationVariables>;
export const CreateRequestSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRequestSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"frequency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allErrorsEnabledEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allErrorsEnabledPush"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"headers"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customEmailErrors"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customPushErrors"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"Argument","name":{"kind":"Name","value":"frequency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"frequency"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}},{"kind":"Argument","name":{"kind":"Name","value":"allErrorsEnabledEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allErrorsEnabledEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"allErrorsEnabledPush"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allErrorsEnabledPush"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"headers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"headers"}}},{"kind":"Argument","name":{"kind":"Name","value":"customEmailErrors"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customEmailErrors"}}},{"kind":"Argument","name":{"kind":"Name","value":"customPushErrors"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customPushErrors"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"headers"}},{"kind":"Field","name":{"kind":"Name","value":"alerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"httpStatusCode"}}]}}]}}]}}]} as unknown as DocumentNode<CreateRequestSettingMutation, CreateRequestSettingMutationVariables>;
export const UpdateRequestSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRequestSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateRequestSettingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"frequency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"headers"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allErrorsEnabledEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allErrorsEnabledPush"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customEmailErrors"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customPushErrors"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRequestSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateRequestSettingId"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"Argument","name":{"kind":"Name","value":"frequency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"frequency"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"headers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"headers"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}},{"kind":"Argument","name":{"kind":"Name","value":"allErrorsEnabledEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allErrorsEnabledEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"allErrorsEnabledPush"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allErrorsEnabledPush"}}},{"kind":"Argument","name":{"kind":"Name","value":"customEmailErrors"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customEmailErrors"}}},{"kind":"Argument","name":{"kind":"Name","value":"customPushErrors"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customPushErrors"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"headers"}},{"kind":"Field","name":{"kind":"Name","value":"alerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"httpStatusCode"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRequestSettingMutation, UpdateRequestSettingMutationVariables>;
export const GetRequestSettingByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRequestSettingById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRequestSettingById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestSetting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"headers"}},{"kind":"Field","name":{"kind":"Name","value":"alerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"httpStatusCode"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestResult"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"getIsAvailable"}}]}}]}}]}}]} as unknown as DocumentNode<GetRequestSettingByIdQuery, GetRequestSettingByIdQueryVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordConfirmation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"passwordConfirmation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordConfirmation"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const ResendAccountConfirmationTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resendAccountConfirmationToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendAccountConfirmationToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ResendAccountConfirmationTokenMutation, ResendAccountConfirmationTokenMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordConfirmation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"passwordConfirmation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordConfirmation"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;