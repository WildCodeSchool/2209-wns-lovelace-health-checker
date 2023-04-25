import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { GlobalContext } from "../..";
import User from "../../entities/User.entity";
import UserService from "../../services/User/User.service";
import {
  deleteSessionIdInCookie,
  setSessionIdInCookie,
} from "../../utils/http-cookies";
import {
  AskForNewPasswordArgs,
  ConfirmAccountArgs,
  ResendAccountConfirmationTokenArgs,
  ResetPasswordArgs,
  SignInArgs,
  SignUpArgs,
  UpdateIdentityArgs,
  UpdatePasswordArgs,
} from "./User.input";
import {
  PASSWORD_CHANGE_SUCCESS,
  SESSION_NOT_FOUND,
  SIGN_OUT_SUCCESS,
  UNABLE_TO_FIND_USER_FROM_CONTEXT,
} from "../../utils/info-and-error-messages";

@Resolver(User)
export default class UserResolver {
  @Mutation(() => User)
  signUp(
    @Args()
    { firstname, lastname, email, password, passwordConfirmation }: SignUpArgs
  ): Promise<User> {
    return UserService.createUser(firstname, lastname, email, password);
  }

  @Mutation(() => String)
  resendAccountConfirmationToken(
    @Args() { email }: ResendAccountConfirmationTokenArgs
  ): Promise<string> {
    return UserService.resendAccountConfirmationToken(email);
  }

  @Mutation(() => Boolean)
  confirmAccount(@Args() { token }: ConfirmAccountArgs): Promise<Boolean> {
    return UserService.confirmAccount(token);
  }

  @Mutation(() => String)
  async askForNewPassword(
    @Args() { email }: AskForNewPasswordArgs
  ): Promise<string> {
    return await UserService.askForNewPassword(email);
  }

  @Mutation(() => String)
  async resetPassword(
    @Args() { token, password }: ResetPasswordArgs
  ): Promise<string> {
    await UserService.resetPassword(password, token);
    return PASSWORD_CHANGE_SUCCESS;
  }

  @Mutation(() => User)
  async signIn(
    @Args() { email, password }: SignInArgs,
    @Ctx() context: GlobalContext
  ): Promise<User> {
    const { user, session } = await UserService.signIn(email, password);
    setSessionIdInCookie(context, session.id);
    return user;
  }

  @Authorized()
  @Mutation(() => String)
  async signOut(@Ctx() context: GlobalContext): Promise<string> {
    await UserService.logout(context);
    deleteSessionIdInCookie(context);
    return SIGN_OUT_SUCCESS;
  }

  @Authorized()
  @Query(() => User)
  async myProfile(@Ctx() context: GlobalContext): Promise<User> {
    return context.user as User;
  }

  @Authorized()
  @Mutation(() => User)
  async updateIdentity(
    @Args() { firstname, lastname }: UpdateIdentityArgs,
    @Ctx() context: GlobalContext
  ): Promise<User> {
    if (!context.user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);
    return UserService.updateUserIdentity(context.user, firstname, lastname);
  }

  @Authorized()
  @Mutation(() => String)
  async updatePassword(
    @Args()
    {
      currentPassword,
      newPassword,
      newPasswordConfirmation,
      disconnectMe,
    }: UpdatePasswordArgs,
    @Ctx() context: GlobalContext
  ): Promise<string> {
    if (!context.user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);
    const currentSessionId = context.sessionId;
    if (!currentSessionId) throw Error(SESSION_NOT_FOUND);
    return UserService.updateUserPassword(
      context.user,
      currentPassword,
      newPassword,
      disconnectMe,
      currentSessionId
    );
  }

  @Authorized()
  @Mutation(() => String)
  async updateEmail(
    @Arg("newEmail") newEmail: string,

    @Ctx() context: GlobalContext
  ): Promise<string> {
    if (!context.user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);
    return UserService.updateUserEmail(context.user, newEmail);
  }

  @Mutation(() => Boolean)
  confirmEmail(
    @Arg("confirmationToken") confirmationToken: string
  ): Promise<Boolean> {
    return UserService.confirmEmail(confirmationToken);
  }

  @Mutation(() => Boolean)
  deleteUser(
    @Arg("currentPassword") currentPassword: string,
    @Ctx() context: GlobalContext
  ): Promise<Boolean> {
    if (!context.user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);
    return UserService.deleteCurrentUser(context.user, currentPassword);
  }
}
