import { Raw } from "typeorm";
import Alert from "../../entities/Alert.entity";
import AlertSetting, { AlertType } from "../../entities/AlertSetting.entity";
import RequestResult from "../../entities/RequestResult.entity";
import RequestSetting from "../../entities/RequestSetting.entity";
import User, { Role } from "../../entities/User.entity";
import { Status } from "../../entities/User.entity";
import PageOfRequestResult from "../../models/PageOfRequestResult";
import {
  sendMessageOnAlertEmailQueue,
  sendMessageOnAlertPushQueue,
} from "../../rabbitmq/providers";
import RequestResultRepository from "../../repositories/RequestResult.repository";
import { LazyTableStateArgs } from "../../resolvers/RequestSetting/RequestSetting.input";
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
    isHomepageRequest: boolean = true
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
      const parsedHeadersArray: any[] = JSON.parse(headersArrayString);
      const headers: any = {};
      parsedHeadersArray.forEach((e) => (headers[e.property] = e.value));
      response = await fetch(url, { headers: headers });
    } else {
      response = await fetch(url);
    }
    return response;
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

  static getPageOfRequestResult = async (
    requestSettingId: string,
    userId: string,
    lazyTableState: LazyTableStateArgs
  ): Promise<PageOfRequestResult> => {
    let { rows, page, sortField, sortOrder, filters } = lazyTableState;
    let where = {
      requestSetting: {
        id: requestSettingId,
        user: {
          id: userId,
        },
      },
    };

    const take = rows;
    const skip = (page - 1) * rows;
    const order: { [key: string]: string } = {};
    if (sortField) {
      order[sortField] = sortOrder === 1 ? "ASC" : "DESC";
    }

    if (filters) {
      for (const filter of filters) {
        if (filter.operator === "or") {
          where = {
            ...where,
            [filter.field]: Raw((alias) => {
              return filter.constraints
                .map((constraint) => {
                  switch (constraint.matchMode) {
                    case "contains":
                      return `${alias} LIKE '%${constraint.value}%'`;
                    case "notContains":
                      return `${alias} NOT LIKE '%${constraint.value}%'`;
                    case "startsWith":
                      return `${alias} LIKE '${constraint.value}%'`;
                    case "endsWith":
                      return `${alias} LIKE '%${constraint.value}'`;
                    case "equals":
                      return `${alias} = '${constraint.value}'`;
                    case "notEquals":
                      return `${alias} <> '${constraint.value}'`;
                    case "in":
                      return `${alias} IN (${constraint.value})`;
                    case "lt":
                      return `${alias} < ${constraint.value}`;
                    case "lte":
                      return `${alias} <= ${constraint.value}`;
                    case "gt":
                      return `${alias} > ${constraint.value}`;
                    case "gte":
                      return `${alias} >= ${constraint.value}`;
                    case "dateIs":
                      return `${alias} = '${constraint.value}'`;
                    case "dateAfter":
                      return `${alias} > '${constraint.value}'`;
                    case "dateBefore":
                      return `${alias} < '${constraint.value}'`;
                    case "dateIsNot":
                      return `${alias} <> '${constraint.value}'`;
                    default:
                      throw new Error(
                        `Invalid matchMode: ${constraint.matchMode}`
                      );
                  }
                })
                .join(" OR ");
            }),
          };
        } else if (filter.operator === "and") {
          where = {
            ...where,
            [filter.field]: Raw((alias) => {
              return filter.constraints
                .map((constraint) => {
                  switch (constraint.matchMode) {
                    case "contains":
                      return `${alias} LIKE '%${constraint.value}%'`;
                    case "notContains":
                      return `${alias} NOT LIKE '%${constraint.value}%'`;
                    case "startsWith":
                      return `${alias} LIKE '${constraint.value}%'`;
                    case "endsWith":
                      return `${alias} LIKE '%${constraint.value}'`;
                    case "equals":
                      return `${alias} = '${constraint.value}'`;
                    case "notEquals":
                      return `${alias} <> '${constraint.value}'`;
                    case "in":
                      return `${alias} IN (${constraint.value})`;
                    case "lt":
                      return `${alias} < ${constraint.value}`;
                    case "lte":
                      return `${alias} <= ${constraint.value}`;
                    case "gt":
                      return `${alias} > ${constraint.value}`;
                    case "gte":
                      return `${alias} >= ${constraint.value}`;
                    case "dateIs":
                      const startOfDate = new Date(constraint.value);
                      const endOfDate = new Date(constraint.value);
                      endOfDate.setDate(endOfDate.getDate() + 1);
                      return `${alias} >= '${startOfDate.toISOString()}' AND ${alias} < '${endOfDate.toISOString()}'`;

                    case "dateAfter":
                      const startOfNextDay = new Date(constraint.value);
                      startOfNextDay.setDate(startOfNextDay.getDate() + 1);
                      return `${alias} > '${startOfNextDay.toISOString()}'`;

                    case "dateBefore":
                      const startOfCurrentDay = new Date(constraint.value);
                      return `${alias} < '${startOfCurrentDay.toISOString()}'`;

                    case "dateIsNot":
                      const startOfDateNot = new Date(constraint.value);
                      const endOfDateNot = new Date(constraint.value);
                      endOfDateNot.setDate(endOfDateNot.getDate() + 1);
                      return `(${alias} < '${startOfDateNot.toISOString()}' OR ${alias} >= '${endOfDateNot.toISOString()}')`;
                    default:
                      throw new Error(
                        `Invalid matchMode: ${constraint.matchMode}`
                      );
                  }
                })
                .join(" AND ");
            }),
          };
        }
      }
    }

    const [requestResults, totalCount] = await this.repository.findAndCount({
      where,
      take,
      skip,
      order,
    });

    return {
      totalCount,
      requestResults,
    };
  };
}
