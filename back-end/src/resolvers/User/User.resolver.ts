import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { GlobalContext } from '../..';
import User from '../../entities/User.entity';
import { setSessionIdInCookie } from '../../http-utils';
import UserService from '../../services/User.service';
import { SignInArgs, SignUpArgs } from './User.input';

@Resolver(User)
export default class UserResolver {
  @Mutation(() => User)
  signUp(
    @Args()
    { firstname, lastname, email, password, passwordConfirmation }: SignUpArgs
  ): Promise<User> {
    return UserService.createUser(firstname, lastname, email, password);
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
  @Query(() => User)
  async myProfile(@Ctx() context: GlobalContext): Promise<User> {
    return context.user as User;
  }
}
