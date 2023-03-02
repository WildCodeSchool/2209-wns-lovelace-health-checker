import AlertSetting, { AlertType } from "../../entities/AlertSetting.entity";
import RequestSetting from "../../entities/RequestSetting.entity";
import AlertSettingRepository from "../../repositories/AlertSetting.repository";
import { HttpErrorStatusCode } from "../../utils/http-error-status-codes.enum";

export default class AlertSettingService extends AlertSettingRepository {
  static async createAlertSetting(
    httpStatusCode: number,
    requestSetting: RequestSetting,
    type: AlertType
  ): Promise<AlertSetting> {
    const alertSetting = new AlertSetting(requestSetting, httpStatusCode, type);
    return await this.saveAlertSetting(alertSetting);
  }

  static async setEmailAlerts(
    customEmailErrors: number[] | undefined,
    allErrorsEnabledEmail: boolean,
    createdRequestSetting: RequestSetting
  ) {
    if (customEmailErrors && customEmailErrors.length) {
      this.setCustomAlerts(
        AlertType.EMAIL,
        createdRequestSetting,
        customEmailErrors
      );
    } else if (allErrorsEnabledEmail) {
      this.setAllAlerts(AlertType.EMAIL, createdRequestSetting);
    }
  }

  static async setPushAlerts(
    customPushErrors: number[] | undefined,
    allErrorsEnabledPush: boolean,
    createdRequestSetting: RequestSetting
  ) {
    if (customPushErrors && customPushErrors.length) {
      this.setCustomAlerts(
        AlertType.PUSH,
        createdRequestSetting,
        customPushErrors
      );
    } else if (allErrorsEnabledPush) {
      this.setAllAlerts(AlertType.PUSH, createdRequestSetting);
    }
  }

  static setCustomAlerts = async (
    type: AlertType,
    requestSetting: RequestSetting,
    errors: number[]
  ) => {
    for (const error of errors) {
      await AlertSettingService.createAlertSetting(error, requestSetting, type);
    }
  };

  static setAllAlerts = async (
    type: AlertType,
    requestSetting: RequestSetting
  ) => {
    for (const httpErrorStatusCode in HttpErrorStatusCode) {
      if (!isNaN(Number(httpErrorStatusCode))) {
        await AlertSettingService.createAlertSetting(
          parseInt(httpErrorStatusCode),
          requestSetting,
          type
        );
      }
    }
  };

  static updateAlerts = async (
    updatedRequestSetting: RequestSetting,
    customEmailErrors: number[] | undefined,
    customPushErrors: number[] | undefined,
    allErrorsEnabledEmail: boolean,
    allErrorsEnabledPush: boolean
  ) => {
    const existingAlerts: AlertSetting[] =
      await AlertSettingRepository.getAlertsByRequestSettingId(
        updatedRequestSetting.id
      );

    // In case there's existing alerts for the given request
    if (existingAlerts.length > 0) {
      const emailAlerts = existingAlerts.filter((alert) => {
        return alert.type === AlertType.EMAIL;
      });

      const pushAlerts = existingAlerts.filter((alert) => {
        return alert.type === AlertType.PUSH;
      });

      // We check if user wants to activate all alerts by type
      if (allErrorsEnabledEmail) {
        await this.removeAllAlertsAndSetAgain(
          AlertType.EMAIL,
          emailAlerts,
          updatedRequestSetting
        );
      }

      if (allErrorsEnabledPush) {
        await this.removeAllAlertsAndSetAgain(
          AlertType.PUSH,
          pushAlerts,
          updatedRequestSetting
        );
      }

      // Then, we check if custom errors are given and we split them into toAdd/toRemove errors by type.
      let customEmailErrorsToAdd = this.getErrorCodesToAdd(
        customEmailErrors,
        emailAlerts
      );
      let customEmailErrorsToDelete = this.getErrorCodesToRemove(
        customEmailErrors,
        emailAlerts
      );
      let customPushErrorsToAdd = this.getErrorCodesToAdd(
        customPushErrors,
        pushAlerts
      );
      let customPushErrorsToDelete = this.getErrorCodesToRemove(
        customPushErrors,
        pushAlerts
      );

      // Then, we add custom errors
      if (customEmailErrorsToAdd.length > 0) {
        await this.addErrorCodes(
          AlertType.EMAIL,
          customEmailErrorsToAdd,
          updatedRequestSetting
        );
      }

      if (customPushErrorsToAdd.length > 0) {
        await this.addErrorCodes(
          AlertType.PUSH,
          customPushErrorsToAdd,
          updatedRequestSetting
        );
      }

      // And to conclude, we remove expected errors
      if (customEmailErrorsToDelete.length > 0) {
        await AlertSettingRepository.remove(customEmailErrorsToDelete);
      }

      if (customPushErrorsToDelete.length > 0) {
        await AlertSettingRepository.remove(customPushErrorsToDelete);
      }
    }
    // If there's no existing alerts for updated request, just use same methods than request creation
    else {
      await AlertSettingService.setPushAlerts(
        customPushErrors,
        allErrorsEnabledPush,
        updatedRequestSetting
      );

      await AlertSettingService.setEmailAlerts(
        customEmailErrors,
        allErrorsEnabledEmail,
        updatedRequestSetting
      );
    }
  };

  static getErrorCodesToAdd = (
    incomingCustomErrors: number[] | undefined,
    existingCustomErrors: AlertSetting[]
  ): number[] => {
    let errorCodesToAdd: number[] = [];

    incomingCustomErrors?.forEach((incomingCustomError: number) => {
      let isAlertSettingFound = existingCustomErrors.find(
        (alertSetting: AlertSetting) =>
          alertSetting.httpStatusCode === incomingCustomError
      );
      if (!isAlertSettingFound) errorCodesToAdd.push(incomingCustomError);
    });
    return errorCodesToAdd;
  };

  static getErrorCodesToRemove = (
    incomingCustomErrors: number[] | undefined,
    existingCustomErrors: AlertSetting[]
  ): AlertSetting[] => {
    let errorCodesToDelete: AlertSetting[] = [];

    existingCustomErrors?.forEach((alertSetting: AlertSetting) => {
      let customErrorFound = incomingCustomErrors?.find(
        (incomingCustomError: number) =>
          incomingCustomError === alertSetting.httpStatusCode
      );
      if (!customErrorFound) errorCodesToDelete.push(alertSetting);
    });
    return errorCodesToDelete;
  };

  static removeAllAlertsAndSetAgain = async (
    type: AlertType,
    existingAlerts: AlertSetting[],
    requestSetting: RequestSetting
  ) => {
    for (const existingAlert of existingAlerts) {
      await AlertSettingRepository.deleteById(existingAlert.id);
    }
    await AlertSettingService.setAllAlerts(type, requestSetting);
  };

  static addErrorCodes = async (
    type: AlertType,
    errorCodesToAdd: number[],
    requestSetting: RequestSetting
  ) => {
    for (const errorCodeToAdd of errorCodesToAdd) {
      await AlertSettingService.createAlertSetting(
        errorCodeToAdd,
        requestSetting,
        type
      );
    }
  };
}
