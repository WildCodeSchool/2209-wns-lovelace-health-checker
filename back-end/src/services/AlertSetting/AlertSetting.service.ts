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

  // TODO : refactor code by trying to create reusable methods
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

    if (existingAlerts.length > 0) {
      const emailAlerts = existingAlerts.filter((alert) => {
        return alert.type === "email";
      });

      const pushAlerts = existingAlerts.filter((alert) => {
        return alert.type === "push";
      });

      let customEmailErrorsToAdd: number[] = [];
      let customEmailErrorsToDelete: AlertSetting[] = [];
      let customPushErrorsToAdd: any[] = [];
      let customPushErrorsToDelete: any[] = [];

      /* EMAIL */
      // Builds list of error codes to add to database
      customEmailErrors?.forEach((customEmailError: number) => {
        let isAlertSettingFound = emailAlerts.find(
          (alertSetting: AlertSetting) =>
            alertSetting.httpStatusCode === customEmailError
        );
        if (!isAlertSettingFound) customEmailErrorsToAdd.push(customEmailError);
      });

      // Build list or error codes to delete from database
      emailAlerts?.forEach((alertSetting: AlertSetting) => {
        let customEmailErrorsFound = customEmailErrors?.find(
          (customEmailError: number) =>
            customEmailError === alertSetting.httpStatusCode
        );
        if (!customEmailErrorsFound)
          customEmailErrorsToDelete.push(alertSetting);
      });

      // Delete and set again all error codes if allErrorEnablesEmail equals true
      if (allErrorsEnabledEmail) {
        for (const emailAlert of emailAlerts) {
          await AlertSettingRepository.deleteById(emailAlert.id);
        }
        await AlertSettingService.setAllAlerts(
          AlertType.EMAIL,
          updatedRequestSetting
        );
      }

      // Add error codes to database
      if (customEmailErrorsToAdd.length > 0) {
        for (const customEmailErrorToAdd of customEmailErrorsToAdd) {
          await AlertSettingService.createAlertSetting(
            customEmailErrorToAdd,
            updatedRequestSetting,
            AlertType.EMAIL
          );
        }
      }

      // Remove error codes to database (TODO : pass an array instead of many objects)
      if (customEmailErrorsToDelete.length > 0) {
        for (const customEmailErrorToDelete of customEmailErrorsToDelete) {
          await AlertSettingRepository.deleteById(customEmailErrorToDelete.id);
        }
      }

      /* PUSH */
      // Builds list of error codes to add to database
      customPushErrors?.forEach((customPushError: number) => {
        let isAlertSettingFound = pushAlerts.find(
          (alertSetting: AlertSetting) =>
            alertSetting.httpStatusCode === customPushError
        );
        if (!isAlertSettingFound) customPushErrorsToAdd.push(customPushError);
      });

      // Build list or error codes to delete from database
      pushAlerts?.forEach((alertSetting: AlertSetting) => {
        let customPushErrorsFound = customPushErrors?.find(
          (customPushError: number) =>
            customPushError === alertSetting.httpStatusCode
        );
        if (!customPushErrorsFound) customPushErrorsToDelete.push(alertSetting);
      });

      // Delete and set again all error codes if allErrorEnablesPush equals true
      if (allErrorsEnabledPush) {
        for (const pushAlert of pushAlerts) {
          await AlertSettingRepository.deleteById(pushAlert.id);
        }
        await AlertSettingService.setAllAlerts(
          AlertType.PUSH,
          updatedRequestSetting
        );
      }

      // Add error codes to database
      if (customPushErrorsToAdd.length > 0) {
        for (const customPushErrorToAdd of customPushErrorsToAdd) {
          await AlertSettingService.createAlertSetting(
            customPushErrorToAdd,
            updatedRequestSetting,
            AlertType.PUSH
          );
        }
      }

      // Remove error codes to database (TODO : pass an array instead of many objects)
      if (customPushErrorsToDelete.length > 0) {
        for (const customPushErrorToDelete of customPushErrorsToDelete) {
          await AlertSettingRepository.deleteById(customPushErrorToDelete.id);
        }
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
}
