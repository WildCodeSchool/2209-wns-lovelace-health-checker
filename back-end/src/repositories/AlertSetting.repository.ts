import { Repository } from "typeorm";

import { getRepository } from "../database/utils";
import AlertSetting from "../entities/AlertSetting.entity";

export default class AlertSettingRepository {
  protected static repository: Repository<AlertSetting>;

  static async initializeRepository() {
    this.repository = await getRepository(AlertSetting);
  }

  protected static saveAlertSetting(
    alertSetting: AlertSetting
  ): Promise<AlertSetting> {
    return this.repository.save(alertSetting);
  }

  static async clearRepository(): Promise<void> {
    await this.repository.delete({});
  }

  static async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }

  static async getAlertsByRequestSettingId(
    id: string
  ): Promise<AlertSetting[]> {
    return this.repository.find({
      where: { requestSetting: { id: id } },
    });
  }
}
