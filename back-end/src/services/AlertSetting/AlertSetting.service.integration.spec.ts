/// <reference types="@types/jest" />;

import {
  closeConnection,
  getDatabase,
  initializeRepositories,
  truncateAllTables,
} from "../../database/utils";
import { Frequency } from "../../entities/RequestSetting.entity";
import User, { PremiumPlan, Role } from "../../entities/User.entity";
import UserService from "../User/User.service";
import * as provider from "../../rabbitmq/providers";
import RequestSettingService from "../RequestSetting/RequestSetting.service";
import AlertSettingService from "./AlertSetting.service";
import AlertSetting, { AlertType } from "../../entities/AlertSetting.entity";
import { UNAUTHORIZED } from "../../utils/info-and-error-messages";
import { HttpErrorStatusCode } from "../../utils/http-error-status-codes.enum";
import AlertSettingRepository from "../../repositories/AlertSetting.repository";
import UserRepository from "../../repositories/User.repository";

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
      it("calls setAllAlerts once with correct parameters", async () => {});
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
      const createdAlerts = await AlertSettingService.getRequestExistingAlerts(
        requestSetting
      );
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

  describe("updatePreventAlertDateByType", () => {
    it("calls getAlertSettingsByRequestSettingId once with correct requestSetting ID", async () => {
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
      await AlertSettingService.updatePreventAlertDateByType(
        new Date(),
        requestSetting,
        AlertType.EMAIL,
        400
      );
      expect(
        AlertSettingRepository.getAlertSettingsByRequestSettingId
      ).toBeCalledTimes(1);
      expect(
        AlertSettingRepository.getAlertSettingsByRequestSettingId
      ).toBeCalledWith(requestSetting.id);
    });
    describe("type and httpStatusCode exist for given requestSetting", () => {
      it("update given requestSetting with preventAlertUntil parameter value", async () => {
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

        const beforeUpdateAlerts =
          await AlertSettingService.getRequestExistingAlerts(requestSetting);

        expect(beforeUpdateAlerts[0].preventAlertUntil).toEqual(null);

        const preventAlertUntil = new Date();
        await AlertSettingService.updatePreventAlertDateByType(
          preventAlertUntil,
          requestSetting,
          AlertType.EMAIL,
          400
        );
        const afterUpdateAlerts =
          await AlertSettingService.getRequestExistingAlerts(requestSetting);

        expect(afterUpdateAlerts[0].preventAlertUntil).toEqual(
          preventAlertUntil
        );
      });
    });
  });

  describe("addGivenAlertsThatDontAlreadyExistByType", () => {
    describe("a not existing alert is given", () => {
      it("creates new alertSetting linked to requestSetting", async () => {
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

        const firstAlert = await AlertSettingService.createAlertSetting(
          400,
          requestSetting,
          AlertType.EMAIL
        );

        const secondAlert = await AlertSettingService.createAlertSetting(
          401,
          requestSetting,
          AlertType.EMAIL
        );

        const initialAlerts =
          await AlertSettingService.getRequestExistingAlerts(requestSetting);
        expect(initialAlerts).toHaveLength(2);

        const firstNewAlert = new AlertSetting(
          requestSetting,
          401,
          AlertType.EMAIL
        );
        const secondNewAlert = new AlertSetting(
          requestSetting,
          402,
          AlertType.EMAIL
        );
        const existingAlertList = [firstAlert, secondAlert];
        const alertList = [firstNewAlert, secondNewAlert];

        await AlertSettingService.addGivenAlertsThatDontAlreadyExistByType(
          alertList,
          existingAlertList,
          AlertType.EMAIL,
          requestSetting
        );

        const afterUpdateAlerts =
          await AlertSettingService.getRequestExistingAlerts(requestSetting);
        expect(afterUpdateAlerts).toHaveLength(3);
      });
    });
  });

  describe("getErrorCodesToAdd", () => {
    describe("there are errors that do not yet exist into incomingCustomErrors", () => {
      it("returns only error codes to add", async () => {
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
        const incomingCustomErrors = [400, 401, 402, 403];
        const firstExistingAlert = new AlertSetting(
          requestSetting,
          401,
          AlertType.EMAIL
        );
        const secondExistingAlert = new AlertSetting(
          requestSetting,
          402,
          AlertType.EMAIL
        );
        const existingCustomErrors = [firstExistingAlert, secondExistingAlert];

        const errorCodesToAdd = AlertSettingService.getErrorCodesToAdd(
          incomingCustomErrors,
          existingCustomErrors
        );
        expect(errorCodesToAdd).toEqual([400, 403]);
      });
    });
    describe("all incoming errors already exist", () => {
      it("returns an empty array", async () => {
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
        const incomingCustomErrors = [401, 402];
        const firstExistingAlert = new AlertSetting(
          requestSetting,
          401,
          AlertType.EMAIL
        );
        const secondExistingAlert = new AlertSetting(
          requestSetting,
          402,
          AlertType.EMAIL
        );
        const existingCustomErrors = [firstExistingAlert, secondExistingAlert];

        const errorCodesToAdd = AlertSettingService.getErrorCodesToAdd(
          incomingCustomErrors,
          existingCustomErrors
        );
        expect(errorCodesToAdd).toEqual([]);
      });
    });
  });

  describe("getErrorCodesToRemove", () => {
    describe("there are errors to remove into incomingCustomErrors", () => {
      it("returns a list of alertSetting to remove", async () => {
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
        const incomingCustomErrors = [400, 401];
        const firstExistingAlert = new AlertSetting(
          requestSetting,
          401,
          AlertType.EMAIL
        );
        const secondExistingAlert = new AlertSetting(
          requestSetting,
          402,
          AlertType.EMAIL
        );
        const existingCustomErrors = [firstExistingAlert, secondExistingAlert];

        const errorCodesToRemove = AlertSettingService.getErrorCodesToRemove(
          incomingCustomErrors,
          existingCustomErrors
        );
        expect(errorCodesToRemove).toHaveLength(1);
        expect(errorCodesToRemove[0].httpStatusCode).toEqual(402);
      });
    });
    describe("there's no error to remove", () => {
      it("return an empty array", async () => {
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
        const incomingCustomErrors: number[] = [];
        const firstExistingAlert = new AlertSetting(
          requestSetting,
          401,
          AlertType.EMAIL
        );
        const secondExistingAlert = new AlertSetting(
          requestSetting,
          402,
          AlertType.EMAIL
        );
        const existingCustomErrors = [firstExistingAlert, secondExistingAlert];

        const errorCodesToRemove = AlertSettingService.getErrorCodesToRemove(
          incomingCustomErrors,
          existingCustomErrors
        );
        expect(errorCodesToRemove).toEqual([]);
      });
    });
    describe("incoming errors are the same as existing erros", () => {
      it("returns an empty array", async () => {
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
        const incomingCustomErrors: number[] = [401, 402];
        const firstExistingAlert = new AlertSetting(
          requestSetting,
          401,
          AlertType.EMAIL
        );
        const secondExistingAlert = new AlertSetting(
          requestSetting,
          402,
          AlertType.EMAIL
        );
        const existingCustomErrors = [firstExistingAlert, secondExistingAlert];

        const errorCodesToRemove = AlertSettingService.getErrorCodesToRemove(
          incomingCustomErrors,
          existingCustomErrors
        );
        expect(errorCodesToRemove).toEqual([]);
      });
    });
  });

  describe("addErrorCodes", () => {
    describe("there are error codes to add", () => {
      it("creates corresponding alertSettings linked to requestSetting into database with correct type", async () => {
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
        const initialAlerts =
          await AlertSettingService.getRequestExistingAlerts(requestSetting);
        expect(initialAlerts).toHaveLength(0);

        const errorCodesToAdd = [400, 401, 402];
        await AlertSettingService.addErrorCodes(
          AlertType.EMAIL,
          errorCodesToAdd,
          requestSetting
        );

        const afterUpdateAlerts =
          await AlertSettingService.getRequestExistingAlerts(requestSetting);
        expect(afterUpdateAlerts).toHaveLength(3);

        expect(afterUpdateAlerts[0].type).toEqual(AlertType.EMAIL);
      });
    });
  });

  describe("updateAlerts", () => {
    const getRequestExistingAlertsSpy = jest.spyOn(
      AlertSettingService,
      "getRequestExistingAlerts"
    );
    const getRequestAlertsByTypeSpy = jest.spyOn(
      AlertSettingService,
      "getRequestAlertsByType"
    );
    const getErrorCodesToAddSpy = jest.spyOn(
      AlertSettingService,
      "getErrorCodesToAdd"
    );
    const getErrorCodesToRemoveSpy = jest.spyOn(
      AlertSettingService,
      "getErrorCodesToRemove"
    );
    const getCompleteAlertListByTypeForGivenRequestSettingSpy = jest.spyOn(
      AlertSettingService,
      "getCompleteAlertListByTypeForGivenRequestSetting"
    );
    const addGivenAlertsThatDontAlreadyExistByTypeSpy = jest.spyOn(
      AlertSettingService,
      "addGivenAlertsThatDontAlreadyExistByType"
    );
    const setAlertsByTypeSpy = jest.spyOn(
      AlertSettingService,
      "setAlertsByType"
    );
    const addErrorCodesSpy = jest.spyOn(AlertSettingService, "addErrorCodes");

    it("calls getRequestExistingAlerts once with given requestSetting", async () => {
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
      await AlertSettingService.updateAlerts(
        requestSetting,
        [],
        [],
        false,
        false
      );
      expect(getRequestExistingAlertsSpy).toBeCalledTimes(1);
      expect(getRequestExistingAlertsSpy).toBeCalledWith(requestSetting);
    });
    describe("there's no existing alerts", () => {
      it("calls setAlertsByType fourth, one time for type EMAIL and one time for type PUSH", async () => {
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
        await AlertSettingService.updateAlerts(
          requestSetting,
          [],
          [],
          false,
          false
        );
        // Two times in createRequest and two times in updateAlerts
        expect(setAlertsByTypeSpy).toHaveBeenCalledTimes(4);

        expect(setAlertsByTypeSpy).toHaveBeenCalledWith(
          requestSetting,
          AlertType.PUSH,
          allErrorsEnabledPush,
          customPushErrors
        );

        expect(setAlertsByTypeSpy).toHaveBeenCalledWith(
          requestSetting,
          AlertType.EMAIL,
          allErrorsEnabledEmail,
          customEmailErrors
        );
      });
    });
    describe("there are existing alerts", () => {
      it("calls getRequestAlertsByType twice, one time for type EMAIL and one time for type PUSH", async () => {
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

        await AlertSettingService.updateAlerts(
          requestSetting,
          [],
          [],
          false,
          false
        );

        expect(getRequestAlertsByTypeSpy).toHaveBeenCalledTimes(2);
      });
      // EMAIL
      describe("allErrorsEnabledEmail equals false", () => {
        it("calls getErrorCodesToAdd once", async () => {});
        it("calls getErrorCodesToRemove once", async () => {});
        describe("customEmailErrorsToAdd length > 0", () => {
          it("calls addErrorCodes once", async () => {
            const user = await UserService.createUser(
              "John",
              "Doe",
              "janedoe@email.com",
              "password"
            );
            user.premiumPlan = PremiumPlan.MONTHLY;
            await UserRepository.repository.save(user);

            const createdUser = await UserRepository.findByEmail(
              "janedoe@email.com"
            );

            if (createdUser) {
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
                createdUser
              );

              await AlertSettingService.createAlertSetting(
                400,
                requestSetting,
                AlertType.EMAIL
              );

              await AlertSettingService.updateAlerts(
                requestSetting,
                [400, 401],
                [],
                false,
                false
              );

              expect(addErrorCodesSpy).toHaveBeenCalledTimes(1);
            }
          });
        });
        describe("customEmailErrorsToDelete length > 0", () => {
          it("removes alertSettings from database", async () => {
            const user = await UserService.createUser(
              "John",
              "Doe",
              "janedoe@email.com",
              "password"
            );
            user.premiumPlan = PremiumPlan.MONTHLY;
            await UserRepository.repository.save(user);

            const createdUser = await UserRepository.findByEmail(
              "janedoe@email.com"
            );

            if (createdUser) {
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
                createdUser
              );

              await AlertSettingService.createAlertSetting(
                400,
                requestSetting,
                AlertType.EMAIL
              );

              await AlertSettingService.createAlertSetting(
                401,
                requestSetting,
                AlertType.EMAIL
              );

              await AlertSettingService.updateAlerts(
                requestSetting,
                [400],
                [],
                false,
                false
              );

              const afterUpdateAlerts =
                await AlertSettingService.getRequestExistingAlerts(
                  requestSetting
                );

              expect(afterUpdateAlerts).toHaveLength(1);
              expect(afterUpdateAlerts[0].httpStatusCode).toEqual(400);
            }
          });
        });
      });
      describe("allErrorsEnabledEmail equals true", () => {
        it("calls getCompleteAlertListByTypeForGivenRequestSetting once with correct parameters", () => {});
        it("calls addGivenAlertsThatDontAlreadyExistByType once with correct parameters", () => {});
      });
      // PUSH
      describe("allErrorsEnabledPush equals false", () => {
        it("calls getErrorCodesToAdd once", () => {});
        it("calls getErrorCodesToRemove once", () => {});
        describe("customPushErrorsToAdd length > 0", () => {
          it("calls addErrorCodes once", async () => {
            const user = await UserService.createUser(
              "John",
              "Doe",
              "janedoe@email.com",
              "password"
            );
            user.premiumPlan = PremiumPlan.MONTHLY;
            await UserRepository.repository.save(user);

            const createdUser = await UserRepository.findByEmail(
              "janedoe@email.com"
            );

            if (createdUser) {
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
                createdUser
              );

              await AlertSettingService.createAlertSetting(
                400,
                requestSetting,
                AlertType.PUSH
              );

              await AlertSettingService.updateAlerts(
                requestSetting,
                [],
                [400, 401],
                false,
                false
              );

              expect(addErrorCodesSpy).toHaveBeenCalledTimes(1);
            }
          });
        });
        describe("customPushErrorsToDelete length > 0", () => {
          it("removes alertSettings from database", async () => {
            const user = await UserService.createUser(
              "John",
              "Doe",
              "janedoe@email.com",
              "password"
            );
            user.premiumPlan = PremiumPlan.MONTHLY;
            await UserRepository.repository.save(user);

            const createdUser = await UserRepository.findByEmail(
              "janedoe@email.com"
            );

            if (createdUser) {
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
                createdUser
              );

              await AlertSettingService.createAlertSetting(
                400,
                requestSetting,
                AlertType.PUSH
              );

              await AlertSettingService.createAlertSetting(
                401,
                requestSetting,
                AlertType.PUSH
              );

              await AlertSettingService.updateAlerts(
                requestSetting,
                [],
                [400],
                false,
                false
              );

              const afterUpdateAlerts =
                await AlertSettingService.getRequestExistingAlerts(
                  requestSetting
                );

              expect(afterUpdateAlerts).toHaveLength(1);
              expect(afterUpdateAlerts[0].httpStatusCode).toEqual(400);
            }
          });
        });
      });
      describe("allErrorsEnabledPush equals true", () => {
        it("calls getCompleteAlertListByTypeForGivenRequestSetting once with correct parameters", () => {});
        it("calls addGivenAlertsThatDontAlreadyExistByType once with correct parameters", () => {});
      });
    });
  });
});
