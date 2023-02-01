import { Args, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import RequestSetting from "../../entities/RequestSetting.entity";
import AlertSettingService from "../../services/AlertSetting/AlertSetting.service";
import RequestSettingService from "../../services/RequestSetting/RequestSetting.service";
import UserService from "../../services/User.service";
import { CreateRequestSettingArgs } from "./RequestSetting.input";

@Resolver(RequestSetting)
export default class RequestSettingResolver {
  // @Ctx() context: GlobalContext
  //@Authorized()
  @Mutation(() => RequestSetting)
  async create(
    @Args()
    {
      url,
      frequency,
      name,
      headers,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      customEmailErrors,
      customPushErrors,
    }: CreateRequestSettingArgs
  ): Promise<RequestSetting> {
    /*     const user = context.user as User;
    if (!user) throw Error("Unable to find user from global context"); */

    // Only for test purposes
    const dummyUser = await UserService.findByEmail("vianneyaccart@gmail.com");

    const createdRequestSetting =
      await RequestSettingService.createRequestSetting(
        dummyUser!,
        url,
        frequency,
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
