import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { GlobalContext } from '../..';
import User from '../../entities/User.entity';
import { deleteSessionIdInCookie, setSessionIdInCookie } from '../../http-utils';
import UserService from '../../services/User.service';
import {
  AskForNewPasswordArgs,
  ConfirmAccountArgs,
  ResendAccountConfirmationTokenArgs,
  ResetPasswordArgs,
  SignInArgs,
  SignUpArgs,
} from './User.input';

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
    await UserService.askForNewPassword(email);
    return "Your request has been processed successfully";
  }

  @Mutation(() => String)
  async resetPassword(
    @Args() { token, password }: ResetPasswordArgs
  ): Promise<string> {
    await UserService.resetPassword(password, token);
    return "Your password has been updated successfully";
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
    return "You've been signed out securely";
  }

  @Authorized()
  @Query(() => User)
  async myProfile(@Ctx() context: GlobalContext): Promise<User> {
    return context.user as User;
  }
}
