/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
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
  __typename?: "AlertSetting";
  httpStatusCode: Scalars["Float"];
  id: Scalars["ID"];
  preventAlertUntil: Scalars["DateTime"];
  requestSetting: RequestSetting;
  type: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  askForNewPassword: Scalars["String"];
  checkUrl: RequestResult;
  confirmAccount: Scalars["Boolean"];
  confirmEmail: Scalars["Boolean"];
  create: RequestSetting;
  resendAccountConfirmationToken: Scalars["String"];
  resetPassword: Scalars["String"];
  signIn: User;
  signOut: Scalars["String"];
  signUp: User;
  updateEmail: Scalars["String"];
  updateIdentity: User;
  updatePassword: Scalars["String"];
};

export type MutationAskForNewPasswordArgs = {
  email: Scalars["String"];
};

export type MutationCheckUrlArgs = {
  url: Scalars["String"];
};

export type MutationConfirmAccountArgs = {
  token: Scalars["String"];
};

export type MutationConfirmEmailArgs = {
  confirmationToken: Scalars["String"];
};

export type MutationCreateArgs = {
  allErrorsEnabledEmail: Scalars["Boolean"];
  allErrorsEnabledPush: Scalars["Boolean"];
  customEmailErrors?: InputMaybe<Array<Scalars["Float"]>>;
  customPushErrors?: InputMaybe<Array<Scalars["Float"]>>;
  frequency: Scalars["Float"];
  headers?: InputMaybe<Scalars["String"]>;
  isActive: Scalars["Boolean"];
  name?: InputMaybe<Scalars["String"]>;
  url: Scalars["String"];
};

export type MutationResendAccountConfirmationTokenArgs = {
  email: Scalars["String"];
};

export type MutationResetPasswordArgs = {
  password: Scalars["String"];
  passwordConfirmation: Scalars["String"];
  token: Scalars["String"];
};

export type MutationSignInArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationSignUpArgs = {
  email: Scalars["String"];
  firstname: Scalars["String"];
  lastname: Scalars["String"];
  password: Scalars["String"];
  passwordConfirmation: Scalars["String"];
};

export type MutationUpdateEmailArgs = {
  newEmail: Scalars["String"];
};

export type MutationUpdateIdentityArgs = {
  firstname: Scalars["String"];
  lastname: Scalars["String"];
};

export type MutationUpdatePasswordArgs = {
  currentPassword: Scalars["String"];
  disconnectMe: Scalars["Boolean"];
  newPassword: Scalars["String"];
  newPasswordConfirmation: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  checkIfNonPremiumUserHasReachedMaxRequestsCount: Scalars["Boolean"];
  myProfile: User;
};

export type RequestResult = {
  __typename?: "RequestResult";
  createdAt: Scalars["DateTime"];
  duration: Scalars["Float"];
  getIsAvailable: Scalars["Boolean"];
  id: Scalars["ID"];
  requestSetting: RequestSetting;
  statusCode: Scalars["Float"];
};

export type RequestSetting = {
  __typename?: "RequestSetting";
  alerts: Array<AlertSetting>;
  createdAt: Scalars["DateTime"];
  frequency: Scalars["Float"];
  headers?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  isActive: Scalars["Boolean"];
  name?: Maybe<Scalars["String"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  url: Scalars["String"];
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["DateTime"];
  customerId?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  firstname: Scalars["String"];
  hasCanceledPremium?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  lastLoggedAt?: Maybe<Scalars["DateTime"]>;
  lastname: Scalars["String"];
  requests: Array<RequestSetting>;
  role: Scalars["String"];
  status: Scalars["String"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type MyProfileQueryVariables = Exact<{ [key: string]: never }>;

export type MyProfileQuery = {
  __typename?: "Query";
  myProfile: {
    __typename?: "User";
    id: string;
    firstname: string;
    lastname: string;
    role: string;
    email: string;
  };
};

export type UpdateIdentityMutationVariables = Exact<{
  lastname: Scalars["String"];
  firstname: Scalars["String"];
}>;

export type UpdateIdentityMutation = {
  __typename?: "Mutation";
  updateIdentity: { __typename?: "User"; lastname: string; firstname: string };
};

export type UpdatePasswordMutationVariables = Exact<{
  currentPassword: Scalars["String"];
  newPassword: Scalars["String"];
  newPasswordConfirmation: Scalars["String"];
  disconnectMe: Scalars["Boolean"];
}>;

export type UpdatePasswordMutation = {
  __typename?: "Mutation";
  updatePassword: string;
};

export type UpdateEmailMutationVariables = Exact<{
  newEmail: Scalars["String"];
}>;

export type UpdateEmailMutation = {
  __typename?: "Mutation";
  updateEmail: string;
};

export type SignOutMutationVariables = Exact<{ [key: string]: never }>;

export type SignOutMutation = { __typename?: "Mutation"; signOut: string };

export type ConfirmAccountMutationVariables = Exact<{
  token: Scalars["String"];
}>;

export type ConfirmAccountMutation = {
  __typename?: "Mutation";
  confirmAccount: boolean;
};

export type ConfirmEmailMutationVariables = Exact<{
  confirmationToken: Scalars["String"];
}>;

export type ConfirmEmailMutation = {
  __typename?: "Mutation";
  confirmEmail: boolean;
};

export type AskForNewPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type AskForNewPasswordMutation = {
  __typename?: "Mutation";
  askForNewPassword: string;
};

export type CheckIfNonPremiumUserHasReachedMaxRequestsCountQueryVariables =
  Exact<{ [key: string]: never }>;

export type CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery = {
  __typename?: "Query";
  checkIfNonPremiumUserHasReachedMaxRequestsCount: boolean;
};

export type CheckUrlMutationVariables = Exact<{
  url: Scalars["String"];
}>;

export type CheckUrlMutation = {
  __typename?: "Mutation";
  checkUrl: {
    __typename?: "RequestResult";
    getIsAvailable: boolean;
    duration: number;
    statusCode: number;
  };
};

export type CreateRequestSettingMutationVariables = Exact<{
  url: Scalars["String"];
  frequency: Scalars["Float"];
  isActive: Scalars["Boolean"];
  allErrorsEnabledEmail: Scalars["Boolean"];
  allErrorsEnabledPush: Scalars["Boolean"];
  name?: InputMaybe<Scalars["String"]>;
  headers?: InputMaybe<Scalars["String"]>;
  customEmailErrors?: InputMaybe<Array<Scalars["Float"]> | Scalars["Float"]>;
  customPushErrors?: InputMaybe<Array<Scalars["Float"]> | Scalars["Float"]>;
}>;

export type CreateRequestSettingMutation = {
  __typename?: "Mutation";
  create: {
    __typename?: "RequestSetting";
    id: string;
    url: string;
    name?: string | null;
    frequency: number;
    isActive: boolean;
    headers?: string | null;
    alerts: Array<{
      __typename?: "AlertSetting";
      type: string;
      httpStatusCode: number;
    }>;
  };
};

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars["String"];
  password: Scalars["String"];
  passwordConfirmation: Scalars["String"];
}>;

export type ResetPasswordMutation = {
  __typename?: "Mutation";
  resetPassword: string;
};

export type SignInMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type SignInMutation = {
  __typename?: "Mutation";
  signIn: { __typename?: "User"; id: string; firstname: string; role: string };
};

export type ResendAccountConfirmationTokenMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ResendAccountConfirmationTokenMutation = {
  __typename?: "Mutation";
  resendAccountConfirmationToken: string;
};

export type SignUpMutationVariables = Exact<{
  firstname: Scalars["String"];
  lastname: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
  passwordConfirmation: Scalars["String"];
}>;

export type SignUpMutation = {
  __typename?: "Mutation";
  signUp: {
    __typename?: "User";
    firstname: string;
    lastname: string;
    email: string;
  };
};

export const MyProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "MyProfile" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "myProfile" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "firstname" } },
                { kind: "Field", name: { kind: "Name", value: "lastname" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MyProfileQuery, MyProfileQueryVariables>;
export const UpdateIdentityDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateIdentity" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "lastname" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "firstname" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateIdentity" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "lastname" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "lastname" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "firstname" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "firstname" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "lastname" } },
                { kind: "Field", name: { kind: "Name", value: "firstname" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateIdentityMutation,
  UpdateIdentityMutationVariables
>;
export const UpdatePasswordDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdatePassword" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "currentPassword" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "newPassword" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "newPasswordConfirmation" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "disconnectMe" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePassword" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "currentPassword" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "currentPassword" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "newPassword" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "newPassword" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "newPasswordConfirmation" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "newPasswordConfirmation" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "disconnectMe" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "disconnectMe" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePasswordMutation,
  UpdatePasswordMutationVariables
>;
export const UpdateEmailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateEmail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "newEmail" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateEmail" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "newEmail" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "newEmail" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateEmailMutation, UpdateEmailMutationVariables>;
export const SignOutDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SignOut" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "signOut" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const ConfirmAccountDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "confirmAccount" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "token" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "confirmAccount" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "token" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "token" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ConfirmAccountMutation,
  ConfirmAccountMutationVariables
>;
export const ConfirmEmailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ConfirmEmail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "confirmationToken" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "confirmEmail" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "confirmationToken" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "confirmationToken" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ConfirmEmailMutation,
  ConfirmEmailMutationVariables
>;
export const AskForNewPasswordDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AskForNewPassword" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "askForNewPassword" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AskForNewPasswordMutation,
  AskForNewPasswordMutationVariables
>;
export const CheckIfNonPremiumUserHasReachedMaxRequestsCountDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "CheckIfNonPremiumUserHasReachedMaxRequestsCount",
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "checkIfNonPremiumUserHasReachedMaxRequestsCount",
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CheckIfNonPremiumUserHasReachedMaxRequestsCountQuery,
  CheckIfNonPremiumUserHasReachedMaxRequestsCountQueryVariables
>;
export const CheckUrlDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CheckUrl" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "url" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "checkUrl" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "url" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "url" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "getIsAvailable" },
                },
                { kind: "Field", name: { kind: "Name", value: "duration" } },
                { kind: "Field", name: { kind: "Name", value: "statusCode" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CheckUrlMutation, CheckUrlMutationVariables>;
export const CreateRequestSettingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateRequestSetting" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "url" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "frequency" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isActive" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "allErrorsEnabledEmail" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "allErrorsEnabledPush" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "headers" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "customEmailErrors" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Float" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "customPushErrors" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Float" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "create" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "url" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "url" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "frequency" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "frequency" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isActive" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isActive" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "allErrorsEnabledEmail" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "allErrorsEnabledEmail" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "allErrorsEnabledPush" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "allErrorsEnabledPush" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "headers" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "headers" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "customEmailErrors" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "customEmailErrors" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "customPushErrors" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "customPushErrors" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "frequency" } },
                { kind: "Field", name: { kind: "Name", value: "isActive" } },
                { kind: "Field", name: { kind: "Name", value: "headers" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "alerts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "type" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "httpStatusCode" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateRequestSettingMutation,
  CreateRequestSettingMutationVariables
>;
export const ResetPasswordDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ResetPassword" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "token" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "password" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "passwordConfirmation" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "resetPassword" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "token" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "token" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "password" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "password" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "passwordConfirmation" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "passwordConfirmation" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>;
export const SignInDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SignIn" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "password" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "signIn" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "password" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "password" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "firstname" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const ResendAccountConfirmationTokenDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "resendAccountConfirmationToken" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "resendAccountConfirmationToken" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ResendAccountConfirmationTokenMutation,
  ResendAccountConfirmationTokenMutationVariables
>;
export const SignUpDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SignUp" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "firstname" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "lastname" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "password" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "passwordConfirmation" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "signUp" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "firstname" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "firstname" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "lastname" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "lastname" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "password" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "password" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "passwordConfirmation" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "passwordConfirmation" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "firstname" } },
                { kind: "Field", name: { kind: "Name", value: "lastname" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
