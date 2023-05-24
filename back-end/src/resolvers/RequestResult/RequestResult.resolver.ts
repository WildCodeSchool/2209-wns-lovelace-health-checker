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

import RequestResult from "../../entities/RequestResult.entity";
import User from "../../entities/User.entity";
import RequestResultService from "../../services/RequestResult/RequestResult.service";
import RequestSettingService from "../../services/RequestSetting/RequestSetting.service";

import {
  checkUrlArgs,
  checkUrlLaunchedManuallyArgs,
} from "./RequestResult.input";
import PageOfRequestResult from "../../models/PageOfRequestResult";
import { LazyTableStateArgs } from "../RequestSetting/RequestSetting.input";

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
    const requestSetting =
      await RequestSettingService.getRequestSettingByIdOrThrowNotFoundError(id);
    await RequestSettingService.checkIfRequestBelongsToUserByRequestSetting(
      context.user as User,
      requestSetting
    );
    return await RequestResultService.checkUrlOfRequestSettingByRequestSetting(
      requestSetting
    );
  }

  @Query(() => PageOfRequestResult)
  getPageOfRequestResult(
    @Arg("settingId") settingId: string,
    @Args() lazyEvent: LazyTableStateArgs,
    @Ctx() context: GlobalContext
  ): Promise<PageOfRequestResult> {
    return RequestResultService.getPageOfRequestResult(
      settingId,
      context.user?.id as string,
      lazyEvent
    );
  }
}
