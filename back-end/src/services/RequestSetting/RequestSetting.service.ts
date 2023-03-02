import RequestSetting, {
  Frequency,
} from "../../entities/RequestSetting.entity";
import User, { Role } from "../../entities/User.entity";
import RequestSettingWithLastResult from "../../models/RequestSettingWithLastResult";
import RequestResultRepository from "../../repositories/RequestResult.repository";
import RequestSettingRepository from "../../repositories/RequestSetting.repository";
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
    // Check if the request belongs to the user
    const toUpdateRequestSetting = await RequestSettingService.getRequestSettingById(id);
    if (!toUpdateRequestSetting) throw Error("Request doesn't exist");
    if (toUpdateRequestSetting?.user.id !== user.id)
      throw Error("Unauthorized");

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
    toUpdateRequestSetting.name = name;
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
      const userSettingRequests = await RequestSettingRepository.getRequestSettingsByUserId(
        user.id
      );
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
    const userSettingRequests = await RequestSettingRepository.getRequestSettingsByUserId(
      user.id
    );

    // For request update case, we exclude current request
    const URLAlreadyExists = userSettingRequests
      .filter((request) => request.id !== id)
      .some((request: RequestSetting) => request.url === url);
    if (URLAlreadyExists) throw Error("This URL already exists");

    // For request update case, we exclude current request
    const nameAlreadyExists = userSettingRequests
      .filter((request) => request.id !== id)
      .some(
        (request: RequestSetting) =>
          request.name === name && request.name !== null
      );
    if (nameAlreadyExists) throw Error("This name already exists");
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
    if (!headersFormatIsCorrect) throw Error("Headers format is incorrect");
  };

  static checkIfNonPremiumUserTryToUsePremiumFrequency = async (
    user: User,
    frequency: Frequency
  ) => {
    if (
      user.role === Role.USER &&
      this.checkIfGivenFrequencyIsPremiumFrequency(frequency)
    )
      throw Error("This frequency is only useable by Premium users");
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
      throw Error("Non Premium users can't use custom error alerts");
  };

  public static getRequestSettingsByFrequency = async (
    frequency: Frequency
  ): Promise<RequestSetting[]> => {
    return await RequestSettingRepository.getRequestSettingsByFrequency(
      frequency
    );
  };

  public static getRequestSettingById = async (
    id: string
  ): Promise<RequestSetting | null> => {
    return await RequestSettingRepository.getRequestSettingById(id);
    };

  static getRequestSettingWithLastResultByRequestSettingId = async (
    id: string
  ): Promise<RequestSettingWithLastResult | void> => {
    const requestSetting = await RequestSettingRepository.getRequestSettingById(id);
    if (!requestSetting) throw Error("Request not found");

    const lastRequestResult =
      await RequestResultRepository.getMostRecentByRequestSettingId(id);

    if (lastRequestResult)
      return new RequestSettingWithLastResult(
        requestSetting,
        lastRequestResult
      );
    else return new RequestSettingWithLastResult(requestSetting, null);
  };
}
