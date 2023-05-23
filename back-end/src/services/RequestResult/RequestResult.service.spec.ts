/// <reference types="@types/jest" />;
import RequestResultService from "./RequestResult.service";
import {
  closeConnection,
  getDatabase,
  initializeRepositories,
  truncateAllTables,
} from "../../database/utils";
import RequestResult from "../../entities/RequestResult.entity";
import RequestSetting, {
  Frequency,
} from "../../entities/RequestSetting.entity";
import * as provider from "../../rabbitmq/providers";
import UserService from "../User/User.service";
import RequestSettingService from "../RequestSetting/RequestSetting.service";
import User from "../../entities/User.entity";
import AlertSettingService from "../AlertSetting/AlertSetting.service";
import { AlertType } from "../../entities/AlertSetting.entity";
import RequestResultRepository from "../../repositories/RequestResult.repository";

const sendMessageOnAccountCreationEmailQueue = () => {
  return jest
    .spyOn(provider, "sendMessageOnAccountCreationEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};
const sendMessageOnAlertEmailQueue = () => {
  return jest
    .spyOn(provider, "sendMessageOnAlertEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};
const sendMessageOnAlertPushQueue = () => {
  return jest
    .spyOn(provider, "sendMessageOnAlertPushQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};
let sendMessageOnAccountCreationEmailQueueSpy: jest.SpyInstance<Promise<void>>;
let sendMessageOnAlertEmailQueueSpy: jest.SpyInstance<Promise<void>>;
let sendMessageOnAlertPushQueueSpy: jest.SpyInstance<Promise<void>>;
const url = "https://www.youtube.com";
const urlWithHeaders = "https://www.youtube.fr";
const headersArrayString =
  '[{"property":"Content-Type","value":"application/json"}]';
const statusCode: number = 502;
let user: User;
let requestSetting: RequestSetting;
let requestSettingWithHeaders: RequestSetting;

beforeAll(async () => {
  await getDatabase();
  await initializeRepositories();
});

beforeEach(async () => {
  Date.now = jest.fn(() => 1487076708000);
  sendMessageOnAccountCreationEmailQueueSpy =
    sendMessageOnAccountCreationEmailQueue();
  sendMessageOnAlertEmailQueueSpy = sendMessageOnAlertEmailQueue();
  sendMessageOnAlertPushQueueSpy = sendMessageOnAlertPushQueue();
  sendMessageOnAccountCreationEmailQueueSpy =
    sendMessageOnAccountCreationEmailQueue();
  user = await UserService.createUser(
    "John",
    "Doe",
    "johndoe@email.com",
    "password"
  );
  requestSetting = await RequestSettingService.createRequest(
    url,
    Frequency.ONE_HOUR,
    "Test request",
    undefined,
    true,
    false,
    false,
    undefined,
    undefined,
    user
  );
  requestSettingWithHeaders = await RequestSettingService.createRequest(
    urlWithHeaders,
    Frequency.ONE_HOUR,
    "Test request with headers",
    headersArrayString,
    true,
    false,
    false,
    undefined,
    undefined,
    user
  );
});

afterEach(async () => {
  await truncateAllTables();
});

afterAll(async () => {
  await closeConnection();
});

describe("RequestResultService", () => {
  describe("checkUrlForHomepage", () => {
    it("should return a RequestResult object with an url, a 200 status code and a duration", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({}), {
            status: 200,
          })
        )
      );

      const requestResult = await RequestResultService.checkUrlForHomepage(url);
      expect(requestResult).toBeInstanceOf(RequestResult);
      expect(requestResult.url).toEqual(url);
      expect(requestResult.statusCode).toEqual(200);
      expect(requestResult.duration).toEqual(0);
      expect(fetch).toHaveBeenCalled();
    });

    it("should throw an error if the request times out", async () => {
      global.fetch = jest.fn(() => {
        throw new DOMException("", "AbortError");
      });

      await expect(
        RequestResultService.checkUrlForHomepage(url)
      ).rejects.toThrowError("Request Timeout");
      expect(fetch).toHaveBeenCalled();
    });

    it("should throw an error if the fetch fails", async () => {
      global.fetch = jest.fn(() => {
        throw new TypeError("fetch failed");
      });

      const url = "https://example.com";

      await expect(
        RequestResultService.checkUrlForHomepage(url)
      ).rejects.toThrow("Fetch Failed");
      expect(fetch).toHaveBeenCalled();
    });
  });

  describe("checkUrlOfRequestSettingByRequestSetting", () => {
    it("should return a RequestResult object with an url, a 200 status code and a duration", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({}), {
            status: 200,
          })
        )
      );

      const requestResult =
        await RequestResultService.checkUrlOfRequestSettingByRequestSetting(
          requestSetting
        );
      expect(requestResult).toBeInstanceOf(RequestResult);
      expect(requestResult.url).toEqual(url);
      expect(requestResult.statusCode).toEqual(200);
      expect(requestResult.duration).toEqual(0);
      expect(requestResult.headers).toBeNull();
      expect(fetch).toHaveBeenCalled();
    });

    it("should return a RequestResult object with headers if the RequestSetting has headers", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({}), {
            status: 200,
          })
        )
      );

      const requestResult =
        await RequestResultService.checkUrlOfRequestSettingByRequestSetting(
          requestSettingWithHeaders
        );
      expect(requestResult).toBeInstanceOf(RequestResult);
      expect(requestResult.url).toEqual(urlWithHeaders);
      expect(requestResult.statusCode).toEqual(200);
      expect(requestResult.duration).toEqual(0);
      expect(requestResult.headers).toEqual(headersArrayString);
      expect(fetch).toHaveBeenCalled();
    });

    it("should return a RequestResult object without status code nor duration if the fetch fails", async () => {
      global.fetch = jest.fn(() => {
        throw new TypeError("fetch failed");
      });

      const requestResult =
        await RequestResultService.checkUrlOfRequestSettingByRequestSetting(
          requestSetting
        );
      expect(requestResult).toBeInstanceOf(RequestResult);
      expect(requestResult.url).toEqual(url);
      expect(requestResult.statusCode).toBeNull();
      expect(requestResult.duration).toBeNull();
      expect(requestResult.headers).toBeNull();
      expect(fetch).toHaveBeenCalled();
    });
  });

  describe("getRequestResultById", () => {
    it("should call getRequestResultById() of RequestResultRepository with the right parameter", async () => {
      const uuid: string = "2bc99799-de46-4e1d-b2ff-da1c0fffd36c";
      const spy = jest.spyOn(RequestResultRepository, "getRequestResultById");
      expect(spy).toBeCalledTimes(0);
      await RequestResultService.getRequestResultById(uuid);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(uuid);
    });
  });

  describe("checkUrlOfAutomatedRequest", () => {
    it("should send request result to queues", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({}), {
            status: statusCode,
          })
        )
      );

      const alertEmail = await AlertSettingService.createAlertSetting(
        statusCode,
        requestSetting,
        AlertType.EMAIL
      );
      const alertPush = await AlertSettingService.createAlertSetting(
        statusCode,
        requestSetting,
        AlertType.PUSH
      );
      const parsedRequestSetting = JSON.stringify(requestSetting);
      expect(sendMessageOnAlertEmailQueueSpy).toBeCalledTimes(0);
      expect(sendMessageOnAlertPushQueueSpy).toBeCalledTimes(0);
      await RequestResultService.checkUrlOfAutomatedRequest(
        parsedRequestSetting
      );
      expect(sendMessageOnAlertEmailQueueSpy).toBeCalledTimes(1);
      expect(sendMessageOnAlertPushQueueSpy).toBeCalledTimes(1);
    });

    it("should not send request result to queues because delay isn't passed", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({}), {
            status: statusCode,
          })
        )
      );

      const alertEmail = await AlertSettingService.createAlertSetting(
        statusCode,
        requestSetting,
        AlertType.EMAIL
      );
      const alertPush = await AlertSettingService.createAlertSetting(
        statusCode,
        requestSetting,
        AlertType.PUSH
      );
      const parsedRequestSetting = JSON.stringify(requestSetting);
      expect(sendMessageOnAlertEmailQueueSpy).toBeCalledTimes(0);
      expect(sendMessageOnAlertPushQueueSpy).toBeCalledTimes(0);
      await AlertSettingService.updatePreventAlertUntilOfAlertSettingByTypeAndHttpStatusCode(
        new Date(new Date().getTime() + 30 * 60 * 1000),
        requestSetting,
        AlertType.EMAIL,
        statusCode
      );
      await AlertSettingService.updatePreventAlertUntilOfAlertSettingByTypeAndHttpStatusCode(
        new Date(new Date().getTime() + 30 * 60 * 1000),
        requestSetting,
        AlertType.PUSH,
        statusCode
      );
      const updatedAlerts = await AlertSettingService.getRequestExistingAlerts(
        requestSetting
      );
      await RequestResultService.checkUrlOfAutomatedRequest(
        parsedRequestSetting
      );
      expect(sendMessageOnAlertEmailQueueSpy).toBeCalledTimes(0);
      expect(sendMessageOnAlertPushQueueSpy).toBeCalledTimes(0);
    });
  });
});
