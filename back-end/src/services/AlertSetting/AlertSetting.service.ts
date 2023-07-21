import AlertSetting, { AlertType } from "../../entities/AlertSetting.entity";
import RequestSetting from "../../entities/RequestSetting.entity";
import AlertSettingRepository from "../../repositories/AlertSetting.repository";
import { HttpErrorStatusCode } from "../../utils/http-error-status-codes.enum";
import { UNAUTHORIZED } from "../../utils/info-and-error-messages";

export default class AlertSettingService extends AlertSettingRepository {
  static async createAlertSetting(
    httpStatusCode: number,
    requestSetting: RequestSetting,
    type: AlertType
  ): Promise<AlertSetting> {
    const alertSetting = new AlertSetting(requestSetting, httpStatusCode, type);
    return await this.saveAlertSetting(alertSetting);
  }

  // TODO : A test is missing
  static setAlertsByType = async (
    requestSetting: RequestSetting,
    type: AlertType,
    allErrorsEnabled: boolean,
    customErrors: number[] | undefined
  ) => {
    if (customErrors && customErrors.length && allErrorsEnabled) {
      throw Error(UNAUTHORIZED);
    } else if (customErrors && customErrors.length) {
      this.setCustomAlerts(type, requestSetting, customErrors);
    } else if (allErrorsEnabled) {
      this.setAllAlerts(type, requestSetting);
    }
  };

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

  static getCompleteAlertListByTypeForGivenRequestSetting = async (
    type: AlertType,
    requestSetting: RequestSetting
  ) => {
    let alertList = [];
    for (const httpErrorStatusCode in HttpErrorStatusCode) {
      if (!isNaN(Number(httpErrorStatusCode))) {
        alertList.push(
          new AlertSetting(requestSetting, parseInt(httpErrorStatusCode), type)
        );
      }
    }
    return alertList;
  };

  static updatePreventAlertDateByType = async (
    preventAlertUntil: Date,
    requestSetting: RequestSetting,
    type: AlertType,
    httpStatusCode: number
  ): Promise<void> => {
    const alertSettings: AlertSetting[] =
      await AlertSettingRepository.getAlertSettingsByRequestSettingId(
        requestSetting.id
      );
    for (const alertSetting of alertSettings) {
      if (
        alertSetting.type === type &&
        alertSetting.httpStatusCode === httpStatusCode
      ) {
        alertSetting.preventAlertUntil = preventAlertUntil;
        await AlertSettingRepository.saveAlertSetting(alertSetting);
      }
    }
  };

  static getRequestExistingAlerts = async (requestSetting: RequestSetting) => {
    return await AlertSettingRepository.getAlertSettingsByRequestSettingId(
      requestSetting.id
    );
  };

  // Returns the list of all possible alerts filtered by type
  static getRequestAlertsByType = (alerts: AlertSetting[], type: AlertType) => {
    return alerts.filter((alert) => {
      return alert.type === type;
    });
  };

  // TODO : Some tests are missing
  static updateAlerts = async (
    updatedRequestSetting: RequestSetting,
    customEmailErrors: number[] | undefined,
    customPushErrors: number[] | undefined,
    allErrorsEnabledEmail: boolean,
    allErrorsEnabledPush: boolean
  ) => {
    const existingAlerts = await this.getRequestExistingAlerts(
      updatedRequestSetting
    );

    if (existingAlerts && existingAlerts.length > 0) {
      const emailAlerts = this.getRequestAlertsByType(
        existingAlerts,
        AlertType.EMAIL
      );
      const pushAlerts = this.getRequestAlertsByType(
        existingAlerts,
        AlertType.PUSH
      );

      let customEmailErrorsToAdd: number[] = [];
      let customEmailErrorsToRemove: AlertSetting[] = [];
      let customPushErrorsToAdd: number[] = [];
      let customPushErrorsToDelete: AlertSetting[] = [];

      // If not all errors are set, check if custom errors are given and we split them into toAdd/toRemove errors by type.
      if (!allErrorsEnabledEmail) {
        customEmailErrorsToAdd = this.getErrorCodesToAdd(
          customEmailErrors,
          emailAlerts
        );
        customEmailErrorsToRemove = this.getErrorCodesToRemove(
          customEmailErrors,
          emailAlerts
        );
      }
      if (!allErrorsEnabledPush) {
        customPushErrorsToAdd = this.getErrorCodesToAdd(
          customPushErrors,
          pushAlerts
        );
        customPushErrorsToDelete = this.getErrorCodesToRemove(
          customPushErrors,
          pushAlerts
        );
      }

      // Check if user wants to activate all email alerts
      if (allErrorsEnabledEmail) {
        // Get all possible alerts
        const emailAlertFullList =
          await this.getCompleteAlertListByTypeForGivenRequestSetting(
            AlertType.EMAIL,
            updatedRequestSetting
          );
        this.addGivenAlertsThatDontAlreadyExistByType(
          emailAlertFullList,
          emailAlerts,
          AlertType.EMAIL,
          updatedRequestSetting
        );
      } else {
        // Then, we add custom errors
        if (customEmailErrorsToAdd.length > 0) {
          await this.addErrorCodes(
            AlertType.EMAIL,
            customEmailErrorsToAdd,
            updatedRequestSetting
          );
        }
        // And to conclude, we remove expected errors
        if (customEmailErrorsToRemove.length > 0) {
          await AlertSettingRepository.remove(customEmailErrorsToRemove);
        }
      }

      // Check if user wants to activate all push alerts
      if (allErrorsEnabledPush) {
        const pushAlertFullList =
          await this.getCompleteAlertListByTypeForGivenRequestSetting(
            AlertType.PUSH,
            updatedRequestSetting
          );
        this.addGivenAlertsThatDontAlreadyExistByType(
          pushAlertFullList,
          pushAlerts,
          AlertType.PUSH,
          updatedRequestSetting
        );
      } else {
        if (customPushErrorsToAdd.length > 0) {
          await this.addErrorCodes(
            AlertType.PUSH,
            customPushErrorsToAdd,
            updatedRequestSetting
          );
        }
        if (customPushErrorsToDelete.length > 0) {
          await AlertSettingRepository.remove(customPushErrorsToDelete);
        }
      }
    }
    // If there's no existing alerts for updated request, just use same methods than request creation
    else {
      await AlertSettingService.setAlertsByType(
        updatedRequestSetting,
        AlertType.PUSH,
        allErrorsEnabledPush,
        customPushErrors
      );

      await AlertSettingService.setAlertsByType(
        updatedRequestSetting,
        AlertType.EMAIL,
        allErrorsEnabledEmail,
        customEmailErrors
      );
    }
  };

  static addGivenAlertsThatDontAlreadyExistByType = async (
    alertList: AlertSetting[],
    existingAlertList: AlertSetting[],
    type: AlertType,
    requestSetting: RequestSetting
  ) => {
    for (const alert of alertList) {
      const isAlreadySet = existingAlertList.find(
        (alreadySetAlert: AlertSetting) =>
          alert.httpStatusCode === alreadySetAlert.httpStatusCode
      );
      if (isAlreadySet == undefined) {
        await this.createAlertSetting(
          alert.httpStatusCode,
          requestSetting,
          type
        );
      }
    }
  };

  static getErrorCodesToAdd = (
    incomingCustomErrors: number[] | undefined,
    existingCustomErrors: AlertSetting[]
  ): number[] => {
    let errorCodesToAdd: number[] = [];

    if (incomingCustomErrors && !incomingCustomErrors.length) return [];

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
    let errorCodesToRemove: AlertSetting[] = [];

    if (incomingCustomErrors && !incomingCustomErrors.length) return [];

    existingCustomErrors?.forEach((alertSetting: AlertSetting) => {
      let customErrorFound = incomingCustomErrors?.find(
        (incomingCustomError: number) =>
          incomingCustomError === alertSetting.httpStatusCode
      );
      if (!customErrorFound) errorCodesToRemove.push(alertSetting);
    });
    return errorCodesToRemove;
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
