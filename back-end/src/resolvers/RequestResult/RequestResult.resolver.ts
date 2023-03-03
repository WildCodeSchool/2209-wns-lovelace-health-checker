import { Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GlobalContext } from "../..";

import RequestResult from "../../entities/RequestResult.entity";
import User from "../../entities/User.entity";
import RequestResultService from "../../services/RequestResult/RequestResult.service";
import RequestSettingService from "../../services/RequestSetting/RequestSetting.service";

import {
  checkUrlArgs,
  checkUrlLaunchedManuallyArgs,
} from "./RequestResult.input";

@Resolver(RequestResult)
export default class RequestResultResolver {
  /* TODO: rename for more comprehensive */
  @Mutation(() => RequestResult)
  async checkUrl(
    @Args()
    { url }: checkUrlArgs
  ): Promise<RequestResult> {
    return await RequestResultService.checkUrlForHomepage(url);
  }

  @Authorized()
  @Query(() => RequestResult)
  async checkUrlLaunchedManually(
    @Args() { id }: checkUrlLaunchedManuallyArgs,
    @Ctx() context: GlobalContext
  ): Promise<RequestResult> {
    const user = context.user as User;
    if (!user) throw Error("Unable to find user from global context");

    const requestSetting =
      await RequestSettingService.getRequestSettingByIdOrThrowNotFoundError(id);
    await RequestSettingService.checkIfRequestBelongsToUserByRequestSetting(
      user,
      requestSetting
    );
    return await RequestResultService.checkUrlOfRequestSettingByRequestSetting(
      requestSetting
    );
  }
}
