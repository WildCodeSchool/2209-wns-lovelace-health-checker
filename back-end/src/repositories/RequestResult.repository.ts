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
}
