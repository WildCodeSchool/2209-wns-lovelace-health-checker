import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

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
} from "../../utils/info-and-error-messages";
import { Context } from "../..";

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
    @Ctx() context: Context
  ): Promise<User> {
    const { user, session } = await UserService.signIn(email, password);
    setSessionIdInCookie(context, session.id);
    return user;
  }

  @Authorized()
  @Mutation(() => String)
  async signOut(@Ctx() context: Context): Promise<string> {
    await UserService.logout(context);
    deleteSessionIdInCookie(context);
    return SIGN_OUT_SUCCESS;
  }

  @Authorized()
  @Query(() => User)
  async myProfile(@Ctx() context: Context): Promise<User> {
    return context.user as User;
  }

  @Authorized()
  @Mutation(() => User)
  async updateIdentity(
    @Args() { firstname, lastname }: UpdateIdentityArgs,
    @Ctx() context: Context
  ): Promise<User> {
    return UserService.updateUserIdentity(
      context.user as User,
      firstname,
      lastname
    );
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
    @Ctx() context: Context
  ): Promise<string> {
    const currentSessionId = context.sessionId;
    if (!currentSessionId) throw Error(SESSION_NOT_FOUND);
    return UserService.updateUserPassword(
      context.user as User,
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

    @Ctx() context: Context
  ): Promise<string> {
    return UserService.updateUserEmail(context.user as User, newEmail);
  }

  @Mutation(() => Boolean)
  confirmEmail(
    @Arg("confirmationToken") confirmationToken: string
  ): Promise<Boolean> {
    return UserService.confirmEmail(confirmationToken);
  }

  @Authorized()
  @Mutation(() => Boolean)
  deleteUser(
    @Arg("currentPassword") currentPassword: string,
    @Ctx() context: Context
  ): Promise<Boolean> {
    return UserService.deleteCurrentUser(context.user as User, currentPassword);
  }
}
