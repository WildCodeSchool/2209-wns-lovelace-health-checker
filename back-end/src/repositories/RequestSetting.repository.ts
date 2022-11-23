import { Repository } from 'typeorm';

import { getRepository } from '../database/utils';
import RequestSetting from '../entities/RequestSetting.entity';

export default class RequestSettingRepository {
  protected static repository: Repository<RequestSetting>;

  static async initializeRepository() {
    this.repository = await getRepository(RequestSetting);
  }

  protected static saveRequestSetting(
    requestSetting: RequestSetting
  ): Promise<RequestSetting> {
    return this.repository.save(requestSetting);
  }

  static async clearRepository(): Promise<void> {
    this.repository.delete({});
  }
}
