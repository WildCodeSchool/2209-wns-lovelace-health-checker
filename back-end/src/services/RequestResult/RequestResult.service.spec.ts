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
const headersArrayString =
  '[{"property":"Content-Type","value":"application/json"}]';

let user: User;

beforeAll(async () => {
  await getDatabase();
  await initializeRepositories();
});

beforeEach(async () => {
  sendMessageOnAccountCreationEmailQueueSpy =
    sendMessageOnAccountCreationEmailQueue();
  sendMessageOnAlertEmailQueueSpy = sendMessageOnAlertEmailQueue();
  sendMessageOnAlertPushQueueSpy = sendMessageOnAlertPushQueue();
  Date.now = jest.fn(() => 1487076708000);

  await truncateAllTables();
  sendMessageOnAccountCreationEmailQueueSpy =
    sendMessageOnAccountCreationEmailQueue();
  user = await UserService.createUser(
    "John",
    "Doe",
    "johndoe@email.com",
    "password"
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
      const requestSetting = await RequestSettingService.createRequest(
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
      const requestSettingWithHeaders =
        await RequestSettingService.createRequest(
          url,
          Frequency.ONE_HOUR,
          "Test request",
          headersArrayString,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );
      const requestResult =
        await RequestResultService.checkUrlOfRequestSettingByRequestSetting(
          requestSettingWithHeaders
        );
      expect(requestResult).toBeInstanceOf(RequestResult);
      expect(requestResult.url).toEqual(url);
      expect(requestResult.statusCode).toEqual(200);
      expect(requestResult.duration).toEqual(0);
      expect(requestResult.headers).toEqual(headersArrayString);
      expect(fetch).toHaveBeenCalled();
    });

    it("should return a RequestResult object without status code nor duration if the fetch fails", async () => {
      global.fetch = jest.fn(() => {
        throw new TypeError("fetch failed");
      });
      const requestSetting = await RequestSettingService.createRequest(
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
    it("should call getRequestResultById() of RequestResultRepository with the right parameter", async () => {});

    describe("checkUrlOfAutomatedRequest", () => {
      it("should call getRequestResultById() of RequestResultRepository with the right parameter", async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve(
            new Response(JSON.stringify({}), {
              status: 502,
            })
          )
        );
        const requestSetting = await RequestSettingService.createRequest(
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
        const parsedRequestSetting = JSON.stringify(requestSetting);
        const requestResult = new RequestResult(
          requestSetting,
          url,
          undefined,
          502,
          0
        );
        requestResult.id = "c54e5a01-ea78-4f5c-9b40-9be8af47ea57";
        // créer des alert settings push & email

        // expect alert to be created
        // expect sendMessageOnAlertEmailQueueSpy to have been called
        // expect sendMessageOnAlertPushQueueSpy to have been called
      });
    });
  });
});
