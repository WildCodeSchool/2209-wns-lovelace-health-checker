import Alert from "../../entities/Alert.entity";
import AlertSetting, { AlertType } from "../../entities/AlertSetting.entity";
import RequestResult from "../../entities/RequestResult.entity";
import RequestSetting from "../../entities/RequestSetting.entity";
import User, { Role } from "../../entities/User.entity";
import { Status } from "../../entities/User.entity";
import {
  sendMessageOnAlertEmailQueue,
  sendMessageOnAlertPushQueue,
} from "../../rabbitmq/providers";
import RequestResultRepository from "../../repositories/RequestResult.repository";
import AlertService from "../Alert/Alert.service";
import AlertSettingService from "../AlertSetting/AlertSetting.service";
import RequestSettingService from "../RequestSetting/RequestSetting.service";

export default class RequestResultService extends RequestResultRepository {
  public static getRequestResultById = async (
    id: string
  ): Promise<RequestResult | null> => {
    return await RequestResultRepository.getRequestResultById(id);
  };

  private static checkUrl = async (
    requestSetting: RequestSetting,
    isHomepageRequest: boolean = false
  ) => {
    try {
      let response;
      const startTimer: number = Date.now();
      if (isHomepageRequest) {
        response = await this.fetchWithOptions(new URL(requestSetting.url));
      } else {
        // Is not a homepage request so timeout is set to 0 to deactivate it
        response = await this.fetchWithOptions(
          new URL(requestSetting.url),
          0,
          requestSetting.headers
        );
      }
      const endTimer: number = Date.now();
      return new RequestResult(
        requestSetting,
        requestSetting.url,
        requestSetting.headers,
        response.status,
        endTimer - startTimer
      );
    } catch (error) {
      if (error instanceof DOMException && error.name) {
        // This is only for homepage request
        switch (error.name) {
          case "AbortError":
            throw Error("Request Timeout");
        }
      } else if (error instanceof TypeError && error.message) {
        switch (error.message) {
          case "fetch failed":
            if (isHomepageRequest) {
              // Will be handled by web-app
              throw Error("Fetch Failed");
            } else {
              // Will be sent to be saved in db with no status code nor duration
              return new RequestResult(
                requestSetting,
                requestSetting.url,
                requestSetting.headers,
                undefined,
                undefined
              );
            }
          // It sould never reach this case since url is valided beforehand
          case "Invalid URL":
            throw Error("Invalid URL");
        }
      }
      throw error;
    }
  };

  private static fetchWithOptions = async (
    url: URL,
    timeout: number = process.env.REQUEST_TIMEOUT
      ? parseInt(process.env.REQUEST_TIMEOUT)
      : 15000,
    headersArrayString?: string
  ): Promise<Response> => {
    let response;
    // Timeout is for homepage request, should be set as parameter 0 for non homepage request so we don't enter this if
    if (timeout) {
      const options = { timeout };
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
    } else if (headersArrayString) {
      const headers =
        this.convertHeadersArrayStringToHeaders(headersArrayString);
      response = await fetch(url, { headers: headers });
    } else {
      response = await fetch(url);
    }
    return response;
  };

  private static convertHeadersArrayStringToHeaders = (
    headersArrayString: string
  ): any => {
    const parsedHeadersArray: any[] = JSON.parse(headersArrayString);
    const headers: any = {};
    parsedHeadersArray.forEach((e) => (headers[e.property] = e.value));
    return headers;
  };

  // Rabbit consumers will use this method
  public static checkUrlOfAutomatedRequest = async (
    message: any
  ): Promise<void> => {
    const toCheckForExistanceRequestSetting: RequestSetting =
      message as RequestSetting;
    const requestSetting = await RequestSettingService.getRequestSettingById(
      toCheckForExistanceRequestSetting.id
    );
    if (requestSetting && requestSetting.isActive) {
      // Return if user becomes inactive before message is consumed
      if (requestSetting.user.status !== Status.ACTIVE) {
        return;
      }
      // Return if user becomes non premium before message is consumed
      if (requestSetting.isRequestPremium()) {
        if (
          !(
            requestSetting.user.role === Role.PREMIUM ||
            requestSetting.user.role === Role.ADMIN
          )
        ) {
          return;
        }
      }
      const requestResult: RequestResult =
        await this.checkUrlOfRequestSettingByRequestSetting(requestSetting);
      // getIsAvailable() return false if status is 4xx or 5xx
      if (!requestResult.getIsAvailable() && requestResult.statusCode) {
        // We look for alertSettings linked to the requestSetting
        const alertSettings: AlertSetting[] =
          await AlertSettingService.getAlertSettingsByRequestSettingIdAndHttpStatusCode(
            requestSetting.id,
            requestResult.statusCode
          );
        // If we find at least 1 alertSetting
        if (alertSettings.length) {
          // We create an alert
          const alert: Alert = await AlertService.createAlert(requestResult);
          if (alert) {
            // Then we send a message for each alertSetting found
            alertSettings.forEach((alertSetting) => {
              if (alertSetting.type === AlertType.EMAIL) {
                // If preventAlertUntil is older than now
                if (
                  alertSetting.preventAlertUntil === null ||
                  alertSetting.preventAlertUntil.getTime() < Date.now()
                ) {
                  // Send requestResult as message to queue
                  sendMessageOnAlertEmailQueue(requestResult);
                }
              } else if (alertSetting.type === AlertType.PUSH) {
                // If preventAlertUntil is older than now
                if (
                  alertSetting.preventAlertUntil === null ||
                  alertSetting.preventAlertUntil.getTime() < Date.now()
                ) {
                  // Send requestResult as message to queue
                  sendMessageOnAlertPushQueue(requestResult);
                }
              }
            });
          }
        }
      }
    }
  };

  public static checkUrlOfRequestSettingByRequestSetting = async (
    requestSetting: RequestSetting
  ): Promise<RequestResult> => {
    // Not a homepage request so add false
    const requestResultToSave: RequestResult = await this.checkUrl(
      requestSetting,
      false
    );
    return await RequestResultRepository.saveRequestResult(requestResultToSave);
  };

  public static checkUrlForHomepage = async (
    url: string
  ): Promise<RequestResult> => {
    const dummyRequestSetting = new RequestSetting(
      new User("", "", "", ""),
      url,
      0,
      true
    );
    // Is homepage request : true
    // Send the result to web-app (front-end)
    return await this.checkUrl(dummyRequestSetting, true);
  };
}
