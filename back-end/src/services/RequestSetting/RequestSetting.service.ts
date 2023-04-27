import RequestSetting, {
  Frequency,
} from "../../entities/RequestSetting.entity";
import User, { Role } from "../../entities/User.entity";
import PageOfRequestSettingWithLastResult from "../../models/PageOfRequestSettingWithLastResult";
import RequestSettingWithLastResult from "../../models/RequestSettingWithLastResult";
import RequestResultRepository from "../../repositories/RequestResult.repository";
import RequestSettingRepository from "../../repositories/RequestSetting.repository";
import {
  ALERTS_ONLY_FOR_PREMIUM_USERS,
  FREQUENCY_ONLY_FOR_PREMIUM_USERS,
  INCORRECT_HEADER_FORMAT,
  NAME_ALREADY_EXISTS,
  REQUEST_DOESNT_EXIST,
  UNAUTHORIZED,
  URL_ALREADY_EXISTS,
} from "../../utils/info-and-error-messages";
import AlertSettingService from "../AlertSetting/AlertSetting.service";

export default class RequestSettingService extends RequestSettingRepository {
  static createRequest = async (
    url: string,
    frequency: Frequency,
    name: string | undefined,
    headers: string | undefined,
    isActive: boolean,
    allErrorsEnabledEmail: boolean,
    allErrorsEnabledPush: boolean,
    customEmailErrors: number[] | undefined,
    customPushErrors: number[] | undefined,
    user: User
  ): Promise<RequestSetting> => {
    await this.checkForBlockingCases(
      user,
      url,
      name,
      headers,
      frequency,
      customEmailErrors,
      customPushErrors
    );

    const requestSetting: RequestSetting = new RequestSetting(
      user,
      url,
      frequency,
      isActive,
      name,
      headers
    );

    const savedRequestSetting = await this.saveRequestSetting(requestSetting);

    await AlertSettingService.setPushAlerts(
      customPushErrors,
      allErrorsEnabledPush,
      savedRequestSetting
    );

    await AlertSettingService.setEmailAlerts(
      customEmailErrors,
      allErrorsEnabledEmail,
      savedRequestSetting
    );

    return savedRequestSetting;
  };

  static checkForBlockingCases = async (
    user: User,
    url: string,
    name: string | undefined,
    headers: string | undefined,
    frequency: Frequency,
    customEmailErrors: number[] | undefined,
    customPushErrors: number[] | undefined,
    id?: string
  ) => {
    if (headers) {
      await this.checkIfHeadersAreRightFormatted(headers);
    }
    await this.checkIfNonPremiumUserTryToUsePremiumFrequency(user, frequency);
    await this.checkIfNonPremiumUserTryToUseCustomError(
      user,
      customEmailErrors,
      customPushErrors
    );
    await this.checkIfNonPremiumUserHasReachedMaxRequestsCount(user);
    await this.checkIfURLOrNameAreAlreadyUsed(user, url, name, id);
  };

  static checkIfRequestBelongsToUserByRequestSetting = async (
    user: User,
    requestSetting: RequestSetting
  ) => {
    if (requestSetting?.user.id !== user.id) throw Error(UNAUTHORIZED);
  };

  static checkIfRequestBelongsToUserByRequestSettingId = async (
    user: User,
    requestSettingId: string
  ) => {
    const requestSetting = await this.getRequestSettingByIdOrThrowNotFoundError(
      requestSettingId
    );
    await this.checkIfRequestBelongsToUserByRequestSetting(
      user,
      requestSetting
    );
  };

  static getRequestSettingByIdOrThrowNotFoundError = async (
    requestSettingId: string
  ) => {
    const requestSetting = await RequestSettingService.getRequestSettingById(
      requestSettingId
    );
    if (!requestSetting) throw Error(REQUEST_DOESNT_EXIST);
    return requestSetting;
  };

  public static getRequestSettingById = async (
    id: string
  ): Promise<RequestSetting | null> => {
    return await RequestSettingRepository.getRequestSettingById(id);
  };

  static updateRequest = async (
    id: string,
    url: string,
    frequency: Frequency,
    name: string | undefined,
    headers: string | undefined,
    isActive: boolean,
    allErrorsEnabledEmail: boolean,
    allErrorsEnabledPush: boolean,
    customEmailErrors: number[] | undefined,
    customPushErrors: number[] | undefined,
    user: User
  ): Promise<RequestSetting> => {
    const toUpdateRequestSetting =
      await this.getRequestSettingByIdOrThrowNotFoundError(id);

    this.checkIfRequestBelongsToUserByRequestSetting(
      user,
      toUpdateRequestSetting
    );

    await this.checkForBlockingCases(
      user,
      url,
      name,
      headers,
      frequency,
      customEmailErrors,
      customPushErrors,
      id
    );

    toUpdateRequestSetting.url = url;
    toUpdateRequestSetting.frequency = frequency;
    toUpdateRequestSetting.isActive = isActive;
    if (name === undefined) {
      toUpdateRequestSetting.name = "";
    } else toUpdateRequestSetting.name = name;
    if (headers === undefined) {
      toUpdateRequestSetting.headers = "";
    } else toUpdateRequestSetting.headers = headers;
    toUpdateRequestSetting.updatedAt = new Date();

    const updatedRequestSetting = await this.saveRequestSetting(
      toUpdateRequestSetting
    );

    await AlertSettingService.updateAlerts(
      updatedRequestSetting,
      customEmailErrors,
      customPushErrors,
      allErrorsEnabledEmail,
      allErrorsEnabledPush
    );

    return updatedRequestSetting;
  };

  static checkIfNonPremiumUserHasReachedMaxRequestsCount = async (
    user: User
  ) => {
    if (user.role === Role.USER) {
      const userSettingRequests =
        await RequestSettingRepository.getRequestSettingsByUserId(user.id);
      if (
        userSettingRequests.length ===
        parseInt(process.env.NON_PREMIUM_MAX_AUTHORIZED_REQUESTS!)
      )
        throw Error(
          `As a non-premium user you're limited to ${process.env.NON_PREMIUM_MAX_AUTHORIZED_REQUESTS} queries. Delete existing queries to create new ones or subscribe to Premium.`
        );
    }
    return false;
  };

  static checkIfURLOrNameAreAlreadyUsed = async (
    user: User,
    url: string,
    name: string | undefined,
    id?: string
  ) => {
    const userSettingRequests =
      await RequestSettingRepository.getRequestSettingsByUserId(user.id);

    // For request update case, we exclude current request
    const URLAlreadyExists = userSettingRequests
      .filter((request) => request.id !== id)
      .some((request: RequestSetting) => request.url === url);
    if (URLAlreadyExists) throw Error(URL_ALREADY_EXISTS);

    // For request update case, we exclude current request
    const nameAlreadyExists = userSettingRequests
      .filter((request) => request.id !== id)
      .some(
        (request: RequestSetting) =>
          request.name === name && request.name !== null
      );
    if (nameAlreadyExists) throw Error(NAME_ALREADY_EXISTS);
  };

  static checkIfGivenFrequencyIsPremiumFrequency = (
    frequency: number
  ): boolean => {
    return (
      frequency <= Frequency.THIRTY_MINUTES &&
      frequency >= Frequency.FIVE_SECONDS
    );
  };

  static headerHasAllHaveProperties = async (array: any[]) => {
    return array.every(function (element) {
      return (
        element.hasOwnProperty("property") && element.hasOwnProperty("value")
      );
    });
  };

  static checkIfHeadersAreRightFormatted = async (headers: string) => {
    const headersFormatIsCorrect = this.headerHasAllHaveProperties(
      JSON.parse(headers)
    );
    if (!headersFormatIsCorrect) throw Error(INCORRECT_HEADER_FORMAT);
  };

  static checkIfNonPremiumUserTryToUsePremiumFrequency = async (
    user: User,
    frequency: Frequency
  ) => {
    if (
      user.role === Role.USER &&
      this.checkIfGivenFrequencyIsPremiumFrequency(frequency)
    )
      throw Error(FREQUENCY_ONLY_FOR_PREMIUM_USERS);
  };

  static checkIfNonPremiumUserTryToUseCustomError = async (
    user: User,
    customEmailErrors: number[] | undefined,
    customPushErrors: number[] | undefined
  ) => {
    if (
      user.role === Role.USER &&
      (customEmailErrors?.length || customPushErrors?.length)
    )
      throw Error(ALERTS_ONLY_FOR_PREMIUM_USERS);
  };

  static getPageOfRequestSettingWithLastResult = async (
    pageSize: number,
    pageNumber: number,
    userId: string
  ): Promise<PageOfRequestSettingWithLastResult> => {
    const [requestSettings, totalCount] = await this.repository.findAndCount({
      where: { user: { id: userId } },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      order: {
        createdAt: "DESC",
      },
    });

    const numberOfRemainingItems = totalCount - pageNumber * pageSize;
    const requestSettingsWithLastResult = await Promise.all(
      requestSettings.map(async (requestSetting) => {
        const lastRequestResult =
          await RequestResultRepository.getMostRecentByRequestSettingId(
            requestSetting.id
          );
        if (lastRequestResult)
          return new RequestSettingWithLastResult(
            requestSetting,
            lastRequestResult
          );
        else return new RequestSettingWithLastResult(requestSetting, null);
      })
    );

    return {
      totalCount,
      nextPageNumber: numberOfRemainingItems > 0 ? pageNumber + 1 : null,
      requestSettingsWithLastResult,
    };
  };

  public static getRequestSettingsByFrequency = async (
    frequency: Frequency
  ): Promise<RequestSetting[]> => {
    return await RequestSettingRepository.getRequestSettingsByFrequency(
      frequency
    );
  };

  static getRequestSettingWithLastResultByRequestSettingId = async (
    id: string
  ): Promise<RequestSettingWithLastResult | void> => {
    const requestSetting = await RequestSettingRepository.getRequestSettingById(
      id
    );
    if (!requestSetting) throw Error(REQUEST_DOESNT_EXIST);

    const lastRequestResult =
      await RequestResultRepository.getMostRecentByRequestSettingId(id);

    if (lastRequestResult)
      return new RequestSettingWithLastResult(
        requestSetting,
        lastRequestResult
      );
    else return new RequestSettingWithLastResult(requestSetting, null);
  };

  static deleteRequestSettingById = async (
    user: User,
    requestId: string
  ): Promise<Boolean> => {
    const requestSetting = await this.getRequestSettingById(requestId);
    if (!requestSetting) throw Error(REQUEST_DOESNT_EXIST);
    this.checkIfRequestBelongsToUserByRequestSetting(user, requestSetting);
    await this.deleteRequestSetting(requestSetting);
    return true;
  };
}
