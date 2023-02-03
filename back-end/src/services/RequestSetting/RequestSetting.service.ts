import RequestSetting, {
  Frequency,
} from "../../entities/RequestSetting.entity";
import User, { Role } from "../../entities/User.entity";
import RequestSettingRepository from "../../repositories/RequestSetting.repository";
import AlertSettingService from "../AlertSetting/AlertSetting.service";

export default class RequestSettingService extends RequestSettingRepository {
  static checkForErrorsAndCreateRequest = async (
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
    if (headers) {
      this.checkIfHeadersAreRightFormatted(headers);
    }

    this.checkIfNonPremiumUserTryToUsePremiumFrequency(user, frequency);

    this.checkIfNonPremiumUserTryToUseCustomError(
      user,
      customEmailErrors,
      customPushErrors
    );

    const createdRequestSetting = await this.createRequestSetting(
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
  };

  static async createRequestSetting(
    user: User,
    url: string,
    frequency: Frequency,
    isActive: boolean,
    name?: string,
    headers?: string
  ): Promise<RequestSetting> {
    await this.checkIfNonPremiumUserHasReachedMaxRequestsCount(user);
    await this.checkIfURLOrNameAreAlreadyUsed(user, url, name);

    const requestSetting: RequestSetting = new RequestSetting(
      user,
      url,
      frequency,
      isActive,
      name,
      headers
    );

    const savedRequestSetting = await this.saveRequestSetting(requestSetting);
    console.log({ savedRequestSetting });
    return savedRequestSetting;
  }

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

  static async checkIfURLOrNameAreAlreadyUsed(
    user: User,
    url: string,
    name: string | undefined
  ) {
    const userSettingRequests =
      await RequestSettingRepository.getRequestSettingsByUserId(user.id);

    const URLAlreadyExists = userSettingRequests.some(
      (request: RequestSetting) => request.url === url
    );
    if (URLAlreadyExists) throw Error("This URL already exists");

    const nameAlreadyExists = userSettingRequests.some(
      (request: RequestSetting) =>
        request.name === name && request.name !== null
    );
    if (nameAlreadyExists) throw Error("This name already exists");
  }

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

  static checkIfHeadersAreRightFormatted = (headers: string) => {
    const headersFormatIsCorrect = this.headerHasAllHaveProperties(
      JSON.parse(headers)
    );
    if (!headersFormatIsCorrect) throw Error("Headers format is incorrect");
  };

  static checkIfNonPremiumUserTryToUsePremiumFrequency = (
    user: User,
    frequency: Frequency
  ) => {
    if (
      user.role === Role.USER &&
      this.checkIfGivenFrequencyIsPremiumFrequency(frequency)
    )
      throw Error("This frequency is only useable by Premium users");
  };

  static checkIfNonPremiumUserTryToUseCustomError = (
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
}
