import { Repository } from 'typeorm';

import { getRepository } from '../database/utils';
import AlertSetting from '../entities/AlertSetting.entity';

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
    this.repository.delete({});
  }
}
