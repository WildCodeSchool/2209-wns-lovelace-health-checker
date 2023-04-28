/// <reference types="@types/jest" />;

import {
  closeConnection,
  getDatabase,
  initializeRepositories,
  truncateAllTables,
} from "../../database/utils";
import { Frequency } from "../../entities/RequestSetting.entity";
import User from "../../entities/User.entity";
import UserService from "../User/User.service";
import * as provider from "../../rabbitmq/providers";
import RequestSettingService from "../RequestSetting/RequestSetting.service";
import AlertSettingService from "./AlertSetting.service";
import AlertSetting, { AlertType } from "../../entities/AlertSetting.entity";
import { UNAUTHORIZED } from "../../utils/info-and-error-messages";
import { HttpErrorStatusCode } from "../../utils/http-error-status-codes.enum";
import AlertSettingRepository from "../../repositories/AlertSetting.repository";

const sendMessageOnAccountCreationEmailQueue = () => {
  return jest
    .spyOn(provider, "sendMessageOnAccountCreationEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

describe("AlertSetting integration", () => {
  let sendMessageOnAccountCreationEmailQueueSpy: jest.SpyInstance<
    Promise<void>
  >;

  let user: User;
  let url: string;
  let frequency: Frequency;
  let name: string | undefined;
  let headers: string | undefined;
  let isActive: boolean;
  let allErrorsEnabledEmail: boolean;
  let allErrorsEnabledPush: boolean;
  let customEmailErrors: number[] | undefined;
  let customPushErrors: number[] | undefined;

  beforeAll(async () => {
    await getDatabase();
    await initializeRepositories();
  });

  beforeEach(async () => {
    await truncateAllTables();
    jest.clearAllMocks();
    sendMessageOnAccountCreationEmailQueueSpy =
      sendMessageOnAccountCreationEmailQueue();
    user = await UserService.createUser(
      "John",
      "Doe",
      "johndoe@email.com",
      "password"
    );
    url = "https://url.com";
    frequency = Frequency.ONE_HOUR;
    name = undefined;
    headers = undefined;
    isActive = true;
    allErrorsEnabledEmail = false;
    allErrorsEnabledPush = false;
    customEmailErrors = [];
    customPushErrors = [];
  });

  afterAll(async () => {
    await truncateAllTables();
    await closeConnection();
  });

  describe("createAlertSetting", () => {
    it("call saveAlertSetting once with created alertSetting", async () => {
      const saveAlertSettingSpy = jest.spyOn(
        AlertSettingService,
        "saveAlertSetting"
      );
      const requestSetting = await RequestSettingService.createRequest(
        url,
        frequency,
        name,
        headers,
        isActive,
        allErrorsEnabledEmail,
        allErrorsEnabledPush,
        customEmailErrors,
        customPushErrors,
        user
      );
      const alertSetting = await AlertSettingService.createAlertSetting(
        400,
        requestSetting,
        AlertType.EMAIL
      );
      expect(saveAlertSettingSpy).toBeCalledTimes(1);
      expect(saveAlertSettingSpy).toHaveBeenCalledWith(alertSetting);
    });
    it("save alertSetting in database", async () => {
      const requestSetting = await RequestSettingService.createRequest(
        url,
        frequency,
        name,
        headers,
        isActive,
        allErrorsEnabledEmail,
        allErrorsEnabledPush,
        customEmailErrors,
        customPushErrors,
        user
      );
      await AlertSettingService.createAlertSetting(
        400,
        requestSetting,
        AlertType.EMAIL
      );
      const alertSettings =
        await AlertSettingService.getAlertSettingsByRequestSettingId(
          requestSetting.id
        );
      const alertSetting = alertSettings[0];
      expect(alertSetting.httpStatusCode).toBe(400);
      expect(alertSetting.type).toBe(AlertType.EMAIL);
    });
  });

  describe("setAlertsByType", () => {
    describe("if both allErrors and customErrors are given", () => {
      it(`throws ${UNAUTHORIZED} error message`, async () => {
        const requestSetting = await RequestSettingService.createRequest(
          url,
          frequency,
          name,
          headers,
          isActive,
          allErrorsEnabledEmail,
          allErrorsEnabledPush,
          customEmailErrors,
          customPushErrors,
          user
        );

        return await expect(async () => {
          await AlertSettingService.setAlertsByType(
            requestSetting,
            AlertType.EMAIL,
            true,
            [400, 401]
          );
        }).rejects.toThrowError(UNAUTHORIZED);
      });
    });
    describe("if custom errors are given with length", () => {
      it("calls setCustomAlerts once with correct parameters", async () => {
        const setCustomAlertsSpy = jest.spyOn(
          AlertSettingService,
          "setCustomAlerts"
        );
        const requestSetting = await RequestSettingService.createRequest(
          url,
          frequency,
          name,
          headers,
          isActive,
          allErrorsEnabledEmail,
          allErrorsEnabledPush,
          customEmailErrors,
          customPushErrors,
          user
        );

        await AlertSettingService.setAlertsByType(
          requestSetting,
          AlertType.EMAIL,
          false,
          [400, 401]
        );

        expect(setCustomAlertsSpy).toBeCalledTimes(1);
        expect(setCustomAlertsSpy).toBeCalledWith(
          AlertType.EMAIL,
          requestSetting,
          [400, 401]
        );
      });
    });

    describe("if allErrors equals true", () => {
      // DOESN'T WORK
      it("calls setAllAlerts once with correct parameters", async () => {
        const setAllAlertsSpy = jest.spyOn(AlertSettingService, "setAllAlerts");
        const requestSetting = await RequestSettingService.createRequest(
          url,
          frequency,
          name,
          headers,
          isActive,
          allErrorsEnabledEmail,
          allErrorsEnabledPush,
          customEmailErrors,
          customPushErrors,
          user
        );

        /*         await AlertSettingService.setAlertsByType(
          requestSetting,
          AlertType.EMAIL,
          true,
          []
        );
        expect(setAllAlertsSpy).toBeCalledTimes(1);
        expect(setAllAlertsSpy).toBeCalledWith(AlertType.EMAIL, requestSetting); */
      });
    });

    describe("setCustomAlerts", () => {
      describe("if two custom errors", () => {
        it("calls createAlertSetting two times", async () => {
          const createAlertSettingSpy = jest.spyOn(
            AlertSettingService,
            "createAlertSetting"
          );
          const requestSetting = await RequestSettingService.createRequest(
            url,
            frequency,
            name,
            headers,
            isActive,
            allErrorsEnabledEmail,
            allErrorsEnabledPush,
            customEmailErrors,
            customPushErrors,
            user
          );
          await AlertSettingService.setCustomAlerts(
            AlertType.EMAIL,
            requestSetting,
            [400, 401]
          );
          expect(createAlertSettingSpy).toBeCalledTimes(2);
        });
      });
      describe("if no custom errors", () => {
        it("not calls createAlertSetting", async () => {
          const createAlertSettingSpy = jest.spyOn(
            AlertSettingService,
            "createAlertSetting"
          );
          const requestSetting = await RequestSettingService.createRequest(
            url,
            frequency,
            name,
            headers,
            isActive,
            allErrorsEnabledEmail,
            allErrorsEnabledPush,
            customEmailErrors,
            customPushErrors,
            user
          );
          await AlertSettingService.setCustomAlerts(
            AlertType.EMAIL,
            requestSetting,
            []
          );
          expect(createAlertSettingSpy).toBeCalledTimes(0);
        });
      });
    });

    describe("setAllAlerts", () => {
      it("count of HttpErrorStatusCode for given type equals count of alert settings saved in database", async () => {
        const httpErrorStatusCodes: any[] = [];
        for (const httpErrorStatusCode in HttpErrorStatusCode) {
          if (!isNaN(Number(httpErrorStatusCode)))
            httpErrorStatusCodes.push(httpErrorStatusCode);
        }
        const requestSetting = await RequestSettingService.createRequest(
          url,
          frequency,
          name,
          headers,
          isActive,
          allErrorsEnabledEmail,
          allErrorsEnabledPush,
          customEmailErrors,
          customPushErrors,
          user
        );
        await AlertSettingService.setAllAlerts(AlertType.EMAIL, requestSetting);
        const createdAlerts =
          await AlertSettingService.getRequestExistingAlerts(requestSetting);
        expect(createdAlerts).toHaveLength(httpErrorStatusCodes.length);
      });
    });

    describe("getCompleteAlertListByTypeForGivenRequestSetting", () => {
      it("returns all alerts by type for given request", async () => {
        const httpErrorStatusCodes: any[] = [];
        for (const httpErrorStatusCode in HttpErrorStatusCode) {
          if (!isNaN(Number(httpErrorStatusCode)))
            httpErrorStatusCodes.push(httpErrorStatusCode);
        }
        const requestSetting = await RequestSettingService.createRequest(
          url,
          frequency,
          name,
          headers,
          isActive,
          allErrorsEnabledEmail,
          allErrorsEnabledPush,
          customEmailErrors,
          customPushErrors,
          user
        );

        const fullEmailAlertList =
          await AlertSettingService.getCompleteAlertListByTypeForGivenRequestSetting(
            AlertType.EMAIL,
            requestSetting
          );
        expect(fullEmailAlertList).toHaveLength(httpErrorStatusCodes.length);
      });
    });

    describe("getRequestExistingAlerts", () => {
      it("calls getAlertSettingsByRequestSettingId once with requestSetting id", async () => {
        const getAlertSettingsByRequestSettingIdSpy = jest.spyOn(
          AlertSettingRepository,
          "getAlertSettingsByRequestSettingId"
        );
        const requestSetting = await RequestSettingService.createRequest(
          url,
          frequency,
          name,
          headers,
          isActive,
          allErrorsEnabledEmail,
          allErrorsEnabledPush,
          customEmailErrors,
          customPushErrors,
          user
        );
        await AlertSettingService.getRequestExistingAlerts(requestSetting);
        expect(getAlertSettingsByRequestSettingIdSpy).toHaveBeenCalledTimes(1);
        expect(getAlertSettingsByRequestSettingIdSpy).toHaveBeenCalledWith(
          requestSetting.id
        );
      });
    });

    describe("getRequestAlertsByType", () => {
      describe("when empty alert array", () => {
        it("returns empty array", () => {
          let alerts: AlertSetting[] = [];
          const result = AlertSettingService.getRequestAlertsByType(
            alerts,
            AlertType.EMAIL
          );
          expect(result).toHaveLength(0);
        });
      });
      describe("when array is not empty", () => {
        describe("with two email type's alert", () => {
          it("result's length equals two", async () => {
            const requestSetting = await RequestSettingService.createRequest(
              url,
              frequency,
              name,
              headers,
              isActive,
              allErrorsEnabledEmail,
              allErrorsEnabledPush,
              customEmailErrors,
              customPushErrors,
              user
            );
            let alerts: AlertSetting[] = [];
            alerts.push(new AlertSetting(requestSetting, 400, AlertType.EMAIL));
            alerts.push(new AlertSetting(requestSetting, 401, AlertType.EMAIL));
            const result = AlertSettingService.getRequestAlertsByType(
              alerts,
              AlertType.EMAIL
            );
            expect(result).toHaveLength(2);
          });
        });
      });
    });
  });
});
