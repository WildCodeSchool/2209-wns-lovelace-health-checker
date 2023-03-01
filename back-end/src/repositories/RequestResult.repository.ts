import { Repository } from "typeorm";

import { getRepository } from "../database/utils";
import RequestResult from "../entities/RequestResult.entity";

export default class RequestResultRepository {
  protected static repository: Repository<RequestResult>;

  static async initializeRepository() {
    this.repository = await getRepository(RequestResult);
  }

  protected static saveRequestResult(
    requestResult: RequestResult
  ): Promise<RequestResult> {
    return this.repository.save(requestResult);
  }

  static async clearRepository(): Promise<void> {
    await this.repository.delete({});
  }

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
