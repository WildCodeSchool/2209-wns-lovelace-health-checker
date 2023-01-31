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

  static async setPushAlerts(
    customPushErrors: number[] | undefined,
    allErrorsEnabledPush: boolean,
    createdRequestSetting: RequestSetting
  ) {
    if (customPushErrors && customPushErrors.length) {
      for (const customPushError of customPushErrors) {
        await AlertSettingService.createAlertSetting(
          customPushError,
          createdRequestSetting,
          AlertType.PUSH
        );
      }
    } else if (allErrorsEnabledPush) {
      for (const httpErrorStatusCode in HttpErrorStatusCode) {
        if (!isNaN(Number(httpErrorStatusCode))) {
          await AlertSettingService.createAlertSetting(
            parseInt(httpErrorStatusCode),
            createdRequestSetting,
            AlertType.PUSH
          );
        }
      }
    }
  }

  static async setEmailAlerts(
    customEmailErrors: number[] | undefined,
    allErrorsEnabledEmail: boolean,
    createdRequestSetting: RequestSetting
  ) {
    if (customEmailErrors && customEmailErrors.length) {
      for (const customEmailError of customEmailErrors)
        await AlertSettingService.createAlertSetting(
          customEmailError,
          createdRequestSetting,
          AlertType.EMAIL
        );
    } else if (allErrorsEnabledEmail) {
      for (const httpErrorStatusCode in HttpErrorStatusCode) {
        if (!isNaN(Number(httpErrorStatusCode))) {
          await AlertSettingService.createAlertSetting(
            parseInt(httpErrorStatusCode),
            createdRequestSetting,
            AlertType.EMAIL
          );
        }
      }
    }
  }
}
