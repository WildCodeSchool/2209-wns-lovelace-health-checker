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
import RequestSetting from "../../entities/RequestSetting.entity";
import User from "../../entities/User.entity";
import PageOfRequestSettingWithLastResult from "../../models/PageOfRequestSettingWithLastResult";
import RequestSettingWithLastResult from "../../models/RequestSettingWithLastResult";
import RequestSettingService from "../../services/RequestSetting/RequestSetting.service";

import {
  CreateRequestSettingArgs,
  GetRequestSettingByIdArgs,
  LazyTableStateArgs,
  UpdateRequestSettingArgs,
} from "./RequestSetting.input";
import { REQUEST_DOESNT_EXIST } from "../../utils/info-and-error-messages";

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
    return await RequestSettingService.createRequest(
      url,
      frequency,
      name,
      headers,
      isActive,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      customEmailErrors,
      customPushErrors,
      context.user as User
    );
  }

  @Authorized()
  @Mutation(() => RequestSetting)
  async updateRequestSetting(
    @Args()
    {
      id,
      url,
      frequency,
      name,
      headers,
      isActive,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      customEmailErrors,
      customPushErrors,
    }: UpdateRequestSettingArgs,
    @Ctx() context: GlobalContext
  ): Promise<RequestSetting> {
    return await RequestSettingService.updateRequest(
      id,
      url,
      frequency,
      name,
      headers,
      isActive,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      customEmailErrors,
      customPushErrors,
      context.user as User
    );
  }

  @Authorized()
  @Query(() => PageOfRequestSettingWithLastResult)
  getPageOfRequestSettingWithLastResult(
    @Args() lazyEvent: LazyTableStateArgs,
    @Ctx() context: GlobalContext
  ): Promise<PageOfRequestSettingWithLastResult> {
    // if (!context.user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);
    return RequestSettingService.getPageOfRequestSettingWithLastResult(
      context.user?.id as string,
      lazyEvent
    );
  }

  @Authorized()
  @Query(() => RequestSettingWithLastResult)
  async getRequestSettingById(
    @Args() { id }: GetRequestSettingByIdArgs,
    @Ctx() context: GlobalContext
  ) {
    const user = context.user as User;
    const result =
      await RequestSettingService.getRequestSettingWithLastResultByRequestSettingId(
        id
      );

    if (result && result.requestSetting.user.id != user.id)
      throw Error(REQUEST_DOESNT_EXIST);
    else return result;
  }

  @Authorized()
  @Mutation(() => Boolean)
  deleteRequestSetting(
    @Arg("requestId") requestId: string,
    @Ctx() context: GlobalContext
  ): Promise<Boolean> {
    return RequestSettingService.deleteRequestSettingById(
      context.user as User,
      requestId
    );
  }
}
