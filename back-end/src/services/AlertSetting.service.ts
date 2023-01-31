import AlertSetting, { AlertType } from "../entities/AlertSetting.entity";
import RequestSetting from "../entities/RequestSetting.entity";
import AlertSettingRepository from "../repositories/AlertSetting.repository";
import { HttpErrorStatusCode } from "../utils/http-error-status-codes.enum";

export default class AlertSettingService extends AlertSettingRepository {
  static async createAlertSetting(
    httpStatusCode: number,
    requestSetting: RequestSetting,
    type: AlertType
  ): Promise<AlertSetting> {
    const alertSetting = new AlertSetting(requestSetting, httpStatusCode, type);
    return await this.saveAlertSetting(alertSetting);
  }
}
