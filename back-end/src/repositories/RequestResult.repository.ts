import { Repository } from "typeorm";

import { getRepository } from "../database/utils";
import RequestResult from "../entities/RequestResult.entity";

export default class RequestResultRepository {
  private static repository: Repository<RequestResult>;

  static initializeRepository = async () => {
    this.repository = await getRepository(RequestResult);
  };

  static clearRepository = async (): Promise<void> => {
    await this.repository.delete({});
  };

  protected static saveRequestResult = (
    requestResult: RequestResult
  ): Promise<RequestResult> => {
    return this.repository.save(requestResult);
  };

  protected static getRequestResultById = async (
    id: string
  ): Promise<RequestResult | null> => {
    return this.repository.findOne({ where: { id: id } });
  };

  static async getMostRecentByRequestSettingId(
    requestSettingId: string
  ): Promise<RequestResult | null> {
    const results = await this.repository.find({
      where: { requestSetting: { id: requestSettingId } },
      order: { createdAt: "DESC" },
      take: 1,
    });

    if (results.length != 0) return results[0];
    else return null;
  }
}
