import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Int,
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
} from "./RequestSetting.input";

const PAGE_SIZE = 10;
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
    const user = context.user as User;
    if (!user) throw Error("Unable to find user from global context");

    return await RequestSettingService.checkForErrorsAndCreateRequest(
      url,
      frequency,
      name,
      headers,
      isActive,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      customEmailErrors,
      customPushErrors,
      user
    );
  }

  @Query(() => PageOfRequestSettingWithLastResult)
  getPageOfRequestSettingWithLastResult(
    @Arg("pageNumber", () => Int) pageNumber: number,
    @Ctx() context: GlobalContext
    // @Arg("userId", () => String) userId: string
  ): Promise<PageOfRequestSettingWithLastResult> {
    if (!context.user) throw Error("Unable to find user from global context");
    return RequestSettingService.getPageOfRequestSettingWithLastResult(
      PAGE_SIZE,
      pageNumber,
      // userId
      context.user?.id
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
      throw Error("Request doesn't exist");
    else return result;
  }
}
