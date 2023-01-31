import { Repository } from "typeorm";

import { getRepository } from "../database/utils";
import Alert from "../entities/Alert.entity";

export default class AlertRepository {
  protected static repository: Repository<Alert>;

  static async initializeRepository() {
    this.repository = await getRepository(Alert);
  }

  protected static saveAlert(alert: Alert): Promise<Alert> {
    return this.repository.save(alert);
  }

  static async clearRepository(): Promise<void> {
    await this.repository.delete({});
  }
}
