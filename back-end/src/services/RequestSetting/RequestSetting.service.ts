import RequestSetting, {
  Frequency,
} from "../../entities/RequestSetting.entity";
import User, { Role } from "../../entities/User.entity";
import RequestSettingRepository from "../../repositories/RequestSetting.repository";

export default class RequestSettingService extends RequestSettingRepository {
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

    let requestSetting: RequestSetting = new RequestSetting(
      user,
      url,
      frequency,
      isActive,
      name,
      headers
    );
    const savedRequestSetting = await this.saveRequestSetting(requestSetting);
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
}
