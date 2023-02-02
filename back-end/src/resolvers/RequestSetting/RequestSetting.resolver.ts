import { Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GlobalContext } from "../..";
import RequestSetting from "../../entities/RequestSetting.entity";
import User from "../../entities/User.entity";
import AlertSettingService from "../../services/AlertSetting/AlertSetting.service";
import RequestSettingService from "../../services/RequestSetting/RequestSetting.service";

import { CreateRequestSettingArgs } from "./RequestSetting.input";

@Resolver(RequestSetting)
export default class RequestSettingResolver {
  @Authorized()
  @Query(() => Boolean)
  async checkIfNonPremiumUserHasReachedMaxRequestsCount(
    @Ctx() context: GlobalContext
  ): Promise<boolean> {
    return RequestSettingService.checkIfNonPremiumUserHasReachedMaxRequestsCount(
      context.user as User
    );
  }

  // @Ctx() context: GlobalContext
  @Authorized()
  @Mutation(() => RequestSetting)
  async create(
    @Args()
    {
      url,
      frequency,
      name,
      headers,
      isActive,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      customEmailErrors,
      customPushErrors,
    }: CreateRequestSettingArgs,
    @Ctx() context: GlobalContext
  ): Promise<RequestSetting> {
    const user = context.user as User;
    if (!user) throw Error("Unable to find user from global context");

    /*     // Only for test purposes
    const dummyUser = await UserService.findByEmail("vianneyaccart@gmail.com"); */

    const createdRequestSetting =
      await RequestSettingService.createRequestSetting(
        user,
        url,
        frequency,
        isActive,
        name,
        headers
      );

    await AlertSettingService.setPushAlerts(
      customPushErrors,
      allErrorsEnabledPush,
      createdRequestSetting
    );

    await AlertSettingService.setEmailAlerts(
      customEmailErrors,
      allErrorsEnabledEmail,
      createdRequestSetting
    );

    return createdRequestSetting;
  }
}
