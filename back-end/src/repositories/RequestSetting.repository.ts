import { Repository } from "typeorm";

import { getRepository } from "../database/utils";
import RequestSetting, { Frequency } from "../entities/RequestSetting.entity";

export default class RequestSettingRepository {
  static repository: Repository<RequestSetting>;

  static initializeRepository = async () => {
    this.repository = await getRepository(RequestSetting);
  };

  static clearRepository = async (): Promise<void> => {
    await this.repository.delete({});
  };

  static saveRequestSetting = (
    requestSetting: RequestSetting
  ): Promise<RequestSetting> => {
    return this.repository.save(requestSetting);
  };

  static getRequestSettingsByFrequency = async (
    frequency: Frequency
  ): Promise<RequestSetting[]> => {
    return this.repository.find({
      where: {
        frequency: frequency,
        isActive: true,
      },
    });
  };

  protected static getRequestSettingsByUserId = async (
    id: string
  ): Promise<RequestSetting[]> => {
    return this.repository.find({ where: { user: { id: id } } });
  };

  static getRequestSettingById = async (
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
