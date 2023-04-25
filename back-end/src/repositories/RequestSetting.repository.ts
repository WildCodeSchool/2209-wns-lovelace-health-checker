import { Repository } from "typeorm";

import { getRepository } from "../database/utils";
import RequestSetting, { Frequency } from "../entities/RequestSetting.entity";
import { Role, Status } from "../entities/User.entity";

export default class RequestSettingRepository {
  static repository: Repository<RequestSetting>;

  static initializeRepository = async () => {
    this.repository = await getRepository(RequestSetting);
  };

  static clearRepository = async (): Promise<void> => {
    await this.repository.delete({});
  };

  protected static saveRequestSetting = (
    requestSetting: RequestSetting
  ): Promise<RequestSetting> => {
    return this.repository.save(requestSetting);
  };

  // get a RequestSetting array by frequency, isActive, where user is ACTIVE (and is PREMIUM if applicable)
  protected static getRequestSettingsByFrequency = async (
    frequency: Frequency
  ): Promise<RequestSetting[]> => {
    const premiumFrequencies: Frequency[] = [
      Frequency.FIVE_SECONDS,
      Frequency.FIFTEEN_SECONDS,
      Frequency.THIRTY_SECONDS,
      Frequency.ONE_MINUTE,
      Frequency.FIFTEEN_MINUTES,
      Frequency.THIRTY_MINUTES,
    ];
    if (premiumFrequencies.includes(frequency)) {
      return this.repository.find({
        where: {
          frequency: frequency,
          isActive: true,
          user: { status: Status.ACTIVE, role: Role.PREMIUM },
        },
      });
    } else {
      return this.repository.find({
        where: {
          frequency: frequency,
          isActive: true,
          user: { status: Status.ACTIVE },
        },
      });
    }
  };

  protected static getRequestSettingsByUserId = async (
    id: string
  ): Promise<RequestSetting[]> => {
    return this.repository.find({ where: { user: { id: id } } });
  };

  protected static getRequestSettingById = async (
    id: string
  ): Promise<RequestSetting | null> => {
    return this.repository.findOne({ where: { id: id } });
  };

  static async deleteRequestSetting(
    requestSetting: RequestSetting
  ): Promise<void> {
    await this.repository.remove(requestSetting);
  }
}
