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
import {
  REQUEST_DOESNT_EXIST,
  UNABLE_TO_FIND_USER_FROM_CONTEXT,
  UNAUTHORIZED,
} from "../../utils/info-and-error-messages";

const PAGE_SIZE = 10;

interface DataTableFilterMeta {
  /**
   * Extra options.
   */
  [key: string]: DataTableFilterMetaData | DataTableOperatorFilterMetaData;
}

interface DataTableOperatorFilterMetaData {
  /**
   * Operator to use for filtering.
   */
  operator: string;
  /**
   * Operator to use for filtering.
   */
  constraints: DataTableFilterMetaData[];
}

interface DataTableFilterMetaData {
  /**
   * Value to filter against.
   */
  value: any;
  /**
   * Type of filter match.
   */
  matchMode:
    | "startsWith"
    | "contains"
    | "notContains"
    | "endsWith"
    | "equals"
    | "notEquals"
    | "in"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "between"
    | "dateIs"
    | "dateIsNot"
    | "dateBefore"
    | "dateAfter"
    | "custom"
    | undefined;
}

type lazyEvent = {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: 1 | 0 | -1 | null;
  filters: any;
};

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
    if (!user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);

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
      user
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
    const user = context.user as User;
    if (!user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);

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
      user
    );
  }

  @Query(() => PageOfRequestSettingWithLastResult)
  getPageOfRequestSettingWithLastResult(
    @Args() lazyEvent: LazyTableStateArgs,
    @Ctx() context: GlobalContext
    // @Arg("userId", () => String) userId: string
  ): Promise<PageOfRequestSettingWithLastResult> {
    // if (!context.user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);
    return RequestSettingService.getPageOfRequestSettingWithLastResult(
      "2dcce9e0-57b2-4f3c-baf5-7907ad164fb9", //context.user?.id,
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
    if (!user) throw Error(UNABLE_TO_FIND_USER_FROM_CONTEXT);

    const result =
      await RequestSettingService.getRequestSettingWithLastResultByRequestSettingId(
        id
      );

    if (result && result.requestSetting.user.id != user.id)
      throw Error(REQUEST_DOESNT_EXIST);
    else return result;
  }

  @Mutation(() => Boolean)
  deleteRequestSetting(
    @Arg("requestId") requestId: string,
    @Ctx() context: GlobalContext
  ): Promise<Boolean> {
    if (!context.user) throw Error(UNAUTHORIZED);
    return RequestSettingService.deleteRequestSettingById(
      context.user,
      requestId
    );
  }
}
