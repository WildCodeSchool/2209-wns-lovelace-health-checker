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
}
