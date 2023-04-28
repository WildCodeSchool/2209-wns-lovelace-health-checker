/// <reference types="@types/jest" />;
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
import User, { Role } from "../../entities/User.entity";
import { HeaderElement } from "../../models/header-element.model";
import RequestResultRepository from "../../repositories/RequestResult.repository";
import RequestSettingRepository from "../../repositories/RequestSetting.repository";
import {
  ALERTS_ONLY_FOR_PREMIUM_USERS,
  FREQUENCY_ONLY_FOR_PREMIUM_USERS,
  INCORRECT_HEADER_FORMAT,
  NAME_ALREADY_EXISTS,
  REQUEST_DOESNT_EXIST,
  UNAUTHORIZED,
  URL_ALREADY_EXISTS,
} from "../../utils/info-and-error-messages";
import UserService from "../User/User.service";
import RequestSettingService from "./RequestSetting.service";
import * as provider from "../../rabbitmq/providers";
import RequestSettingWithLastResult from "../../models/RequestSettingWithLastResult";
import RequestResultService from "../RequestResult/RequestResult.service";
import AlertSettingService from "../AlertSetting/AlertSetting.service";

const sendMessageOnAccountCreationEmailQueue = () => {
  return jest
    .spyOn(provider, "sendMessageOnAccountCreationEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

describe("RequestService integration", () => {
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

  describe("createRequest", () => {
    it("calls checkForBlockingCases once", async () => {
      const checkForBlockingCasesSpy = jest.spyOn(
        RequestSettingService,
        "checkForBlockingCases"
      );
      await RequestSettingService.createRequest(
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
      expect(checkForBlockingCasesSpy).toBeCalledTimes(1);
    });
    describe("if there's no validation error", () => {
      it("calls saveRequestSetting once", async () => {
        const saveRequestSettingSpy = jest.spyOn(
          RequestSettingService,
          "saveRequestSetting"
        );
        await RequestSettingService.createRequest(
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
        expect(saveRequestSettingSpy).toBeCalledTimes(1);
      });
      it("creates a new request in database", async () => {
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

        const existingRequestResult =
          await RequestSettingService.repository.findOne({
            where: { id: requestSetting.id },
          });

        expect(existingRequestResult?.url).toBe("https://url.com");
      });
      it("calls setPushAlerts once", async () => {
        const setPushAlertsSpy = jest.spyOn(
          AlertSettingService,
          "setPushAlerts"
        );
        await RequestSettingService.createRequest(
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
        expect(setPushAlertsSpy).toBeCalledTimes(1);
      });
      it("calls setEmailAlerts once", async () => {
        const setEmailAlertsSpy = jest.spyOn(
          AlertSettingService,
          "setEmailAlerts"
        );
        await RequestSettingService.createRequest(
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
        expect(setEmailAlertsSpy).toBeCalledTimes(1);
      });
      it("returns created request setting", async () => {
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

        const createdRequestResult =
          await RequestSettingService.repository.findOne({
            where: { id: requestSetting.id },
          });

        expect(createdRequestResult?.url).toBe("https://url.com");
        expect(createdRequestResult).toBeInstanceOf(RequestSetting);
      });
    });
  });

  describe("checkForBlockingCases", () => {
    describe("if there's headers", () => {
      it("call throwErrorIfHeadersAreBadlyFormatted once with given headers", async () => {
        const throwErrorIfHeadersAreBadlyFormattedSpy = jest.spyOn(
          RequestSettingService,
          "throwErrorIfHeadersAreBadlyFormatted"
        );
        headers =
          '[{"property":"Authorization","value":"Bearer dhYhekd67Jkkjeu787lkdhYh"}]';
        await RequestSettingService.checkForBlockingCases(
          user,
          url,
          name,
          headers,
          frequency,
          customEmailErrors,
          customPushErrors
        );
        expect(throwErrorIfHeadersAreBadlyFormattedSpy).toBeCalledTimes(1);
        expect(throwErrorIfHeadersAreBadlyFormattedSpy).toBeCalledWith(headers);
      });
    });
    it("call checkIfNonPremiumUserTryToUsePremiumFrequency once with given user and frequency", async () => {
      const checkIfNonPremiumUserTryToUsePremiumFrequencySpy = jest.spyOn(
        RequestSettingService,
        "checkIfNonPremiumUserTryToUsePremiumFrequency"
      );
      await RequestSettingService.checkForBlockingCases(
        user,
        url,
        name,
        headers,
        frequency,
        customEmailErrors,
        customPushErrors
      );
      expect(checkIfNonPremiumUserTryToUsePremiumFrequencySpy).toBeCalledTimes(
        1
      );
      expect(checkIfNonPremiumUserTryToUsePremiumFrequencySpy).toBeCalledWith(
        user,
        frequency
      );
    });
    it("call checkIfNonPremiumUserTryToUseCustomError once with given parameters", async () => {
      const checkIfNonPremiumUserTryToUseCustomErrorSpy = jest.spyOn(
        RequestSettingService,
        "checkIfNonPremiumUserTryToUseCustomError"
      );
      await RequestSettingService.checkForBlockingCases(
        user,
        url,
        name,
        headers,
        frequency,
        customEmailErrors,
        customPushErrors
      );
      expect(checkIfNonPremiumUserTryToUseCustomErrorSpy).toBeCalledTimes(1);
      expect(checkIfNonPremiumUserTryToUseCustomErrorSpy).toBeCalledWith(
        user,
        customEmailErrors,
        customPushErrors
      );
    });
    it("call checkIfNonPremiumUserHasReachedMaxRequestsCount once with given user", async () => {
      const checkIfNonPremiumUserHasReachedMaxRequestsCountSpy = jest.spyOn(
        RequestSettingService,
        "checkIfNonPremiumUserHasReachedMaxRequestsCount"
      );
      await RequestSettingService.checkForBlockingCases(
        user,
        url,
        name,
        headers,
        frequency,
        customEmailErrors,
        customPushErrors
      );
      expect(
        checkIfNonPremiumUserHasReachedMaxRequestsCountSpy
      ).toBeCalledTimes(1);
      expect(checkIfNonPremiumUserHasReachedMaxRequestsCountSpy).toBeCalledWith(
        user
      );
    });
    it("call checkIfURLOrNameAreAlreadyUsed once with given parameters", async () => {
      const checkIfURLOrNameAreAlreadyUsedSpy = jest.spyOn(
        RequestSettingService,
        "checkIfURLOrNameAreAlreadyUsed"
      );
      const id = "249f8ef2-cb37-4bb0-99c0-23856bd48f1c";
      await RequestSettingService.checkForBlockingCases(
        user,
        url,
        name,
        headers,
        frequency,
        customEmailErrors,
        customPushErrors,
        id
      );
      expect(checkIfURLOrNameAreAlreadyUsedSpy).toBeCalledTimes(1);
      expect(checkIfURLOrNameAreAlreadyUsedSpy).toBeCalledWith(
        user,
        url,
        name,
        id
      );
    });
  });

  describe("checkIfRequestBelongsToUserByRequestSetting", () => {
    describe("if user is not request's owner", () => {
      it(`throws ${UNAUTHORIZED} error message`, async () => {
        const otherUser = await UserService.createUser(
          "Jane",
          "Doe",
          "janedoe@email.com",
          "password"
        );
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );
        const otherRequestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          otherUser
        );
        return await expect(async () => {
          await RequestSettingService.checkIfRequestBelongsToUserByRequestSetting(
            user,
            otherRequestSetting
          );
        }).rejects.toThrowError(UNAUTHORIZED);
      });
    });
  });

  describe("checkIfRequestBelongsToUserByRequestSettingId", () => {
    it("call getRequestSettingByIdOrThrowNotFoundError once with given requestSettingId", async () => {
      const getRequestSettingByIdOrThrowNotFoundErrorSpy = jest.spyOn(
        RequestSettingService,
        "getRequestSettingByIdOrThrowNotFoundError"
      );
      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );
      await RequestSettingService.checkIfRequestBelongsToUserByRequestSettingId(
        user,
        requestSetting.id
      );
      expect(getRequestSettingByIdOrThrowNotFoundErrorSpy).toBeCalledTimes(1);
      expect(getRequestSettingByIdOrThrowNotFoundErrorSpy).toBeCalledWith(
        requestSetting.id
      );
    });
    it("call checkIfRequestBelongsToUserByRequestSetting once with given user and retrieved requestSetting", async () => {
      const checkIfRequestBelongsToUserByRequestSettingSpy = jest.spyOn(
        RequestSettingService,
        "checkIfRequestBelongsToUserByRequestSetting"
      );
      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );
      await RequestSettingService.checkIfRequestBelongsToUserByRequestSettingId(
        user,
        requestSetting.id
      );
      expect(checkIfRequestBelongsToUserByRequestSettingSpy).toBeCalledTimes(1);
      expect(checkIfRequestBelongsToUserByRequestSettingSpy).toBeCalledWith(
        user,
        requestSetting
      );
    });
  });

  describe("checkIfNonPremiumUserHasReachedMaxRequestsCount", () => {
    describe("user doesn't have 'user' role", () => {
      it("returns false", async () => {
        user.role = Role.PREMIUM;
        const result =
          await RequestSettingService.checkIfNonPremiumUserHasReachedMaxRequestsCount(
            user
          );
        expect(result).toBe(false);
      });
    });
    describe("if user have 'user' role", () => {
      it("call getRequestSettingsByUserId once with correct user id", async () => {
        const getRequestSettingsByUserIdSpy = jest.spyOn(
          RequestSettingRepository,
          "getRequestSettingsByUserId"
        );
        await RequestSettingService.checkIfNonPremiumUserHasReachedMaxRequestsCount(
          user
        );
        expect(getRequestSettingsByUserIdSpy).toBeCalledTimes(1);
      });
      describe("if user has reached max requests count", () => {
        it(`throws 'As a non-premium user you're limited to ${process.env.NON_PREMIUM_MAX_AUTHORIZED_REQUESTS} queries. Delete existing queries to create new ones or subscribe to Premium.'`, async () => {
          const elements = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ];
          for (let element in elements) {
            const requestSetting = await RequestSettingService.createRequest(
              `https://url${element}.com`,
              Frequency.ONE_HOUR,
              undefined,
              undefined,
              true,
              false,
              false,
              undefined,
              undefined,
              user
            );
          }
          return await expect(async () => {
            await RequestSettingService.createRequest(
              "https://url21.com",
              Frequency.ONE_HOUR,
              undefined,
              undefined,
              true,
              false,
              false,
              undefined,
              undefined,
              user
            );
          }).rejects.toThrowError(
            `As a non-premium user you're limited to ${process.env.NON_PREMIUM_MAX_AUTHORIZED_REQUESTS} queries. Delete existing queries to create new ones or subscribe to Premium.`
          );
        });
      });
      describe("if user have no reached max requests count", () => {
        it("returns false", async () => {
          const result =
            await RequestSettingService.checkIfNonPremiumUserHasReachedMaxRequestsCount(
              user
            );
          expect(result).toBe(false);
        });
      });
    });
  });

  describe("checkIfURLOrNameAreAlreadyUsed", () => {
    it("calls getRequestSettingsByUserId once with correct user id", async () => {
      const getRequestSettingsByUserIdSpy = jest.spyOn(
        RequestSettingService,
        "getRequestSettingsByUserId"
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
      await RequestSettingService.checkIfURLOrNameAreAlreadyUsed(
        user,
        url,
        name,
        requestSetting.id
      );
      expect(getRequestSettingsByUserIdSpy).toBeCalledTimes(3);
      expect(getRequestSettingsByUserIdSpy).toBeCalledWith(user.id);
    });
    describe("URL is already used by another request", () => {
      it(`throws ${URL_ALREADY_EXISTS} error message`, async () => {
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
          await RequestSettingService.checkIfURLOrNameAreAlreadyUsed(
            user,
            url,
            name
          );
        }).rejects.toThrowError(URL_ALREADY_EXISTS);
      });
    });
    describe("URL already exists but it's current request", () => {
      it("does nothing", async () => {
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

        await RequestSettingService.checkIfURLOrNameAreAlreadyUsed(
          user,
          url,
          name,
          requestSetting.id
        );
      });
    });
    describe("name is already used by another request", () => {
      it(`throws ${NAME_ALREADY_EXISTS} error message`, async () => {
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
          await RequestSettingService.checkIfURLOrNameAreAlreadyUsed(
            user,
            url,
            name
          );
        }).rejects.toThrowError(URL_ALREADY_EXISTS);
      });
    });
    describe("URL already exists but it's current request", () => {
      it("does nothing", async () => {
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

        await RequestSettingService.checkIfURLOrNameAreAlreadyUsed(
          user,
          url,
          name,
          requestSetting.id
        );
      });
    });
  });

  describe("failIfHeadersNotHaveKeysPropertyAndValue", () => {
    describe("headers format is incorrect", () => {
      it("returns false", () => {
        const headers: any = [
          {
            property: "Authorization",
            value: "Bearer dhYhekd67Jkkjeu787lkdhYh",
          },
          { Authorization: "Bearer dhYhekd67Jkkjeu787lkdhYh" },
        ];
        expect(
          RequestSettingService.failIfHeadersNotHaveKeysPropertyAndValue(
            headers
          )
        ).toEqual(false);
      });
    });
    describe("headers format is correct", () => {
      it("returns true", () => {
        const headers: HeaderElement[] = [
          {
            property: "Authorization",
            value: "Bearer dhYhekd67Jkkjeu787lkdhYh",
          },
        ];
        expect(
          RequestSettingService.failIfHeadersNotHaveKeysPropertyAndValue(
            headers
          )
        ).toEqual(true);
      });
    });
  });

  describe("throwErrorIfHeadersAreBadlyFormatted", () => {
    it("calls failIfHeadersNotHaveKeysPropertyAndValue once", () => {
      const failIfHeadersNotHaveKeysPropertyAndValueSpy = jest.spyOn(
        RequestSettingService,
        "failIfHeadersNotHaveKeysPropertyAndValue"
      );
      const headers: string =
        '[{"property":"Authorization","value":"Bearer dhYhekd67Jkkjeu787lkdhYh"}]';
      RequestSettingService.throwErrorIfHeadersAreBadlyFormatted(headers);
      expect(failIfHeadersNotHaveKeysPropertyAndValueSpy).toBeCalledTimes(1);
    });
    it("calls failIfHeadersNotHaveKeysPropertyAndValue with given headers", () => {
      const failIfHeadersNotHaveKeysPropertyAndValueSpy = jest.spyOn(
        RequestSettingService,
        "failIfHeadersNotHaveKeysPropertyAndValue"
      );
      const headers: string =
        '[{"property":"Authorization","value":"Bearer dhYhekd67Jkkjeu787lkdhYh"}]';
      RequestSettingService.throwErrorIfHeadersAreBadlyFormatted(headers);
      expect(failIfHeadersNotHaveKeysPropertyAndValueSpy).toBeCalledWith(
        JSON.parse(headers)
      );
    });
    describe("headers aren't right formatted", () => {
      it(`throws ${INCORRECT_HEADER_FORMAT} error message`, async () => {
        const headers: string = `[{"property": "Authorization","value": "Bearer dhYhekd67Jkkjeu787lkdhYh"},{ "Authorization": "Bearer dhYhekd67Jkkjeu787lkdhYh" }]`;
        await expect(
          RequestSettingService.throwErrorIfHeadersAreBadlyFormatted(headers)
        ).rejects.toThrowError(INCORRECT_HEADER_FORMAT);
      });
    });
  });

  describe("checkIfNonPremiumUserTryToUsePremiumFrequency", () => {
    describe("if user's role is 'user'", () => {
      it("calls checkIfGivenFrequencyIsPremiumFrequency once", () => {
        const checkIfGivenFrequencyIsPremiumFrequencySpy = jest.spyOn(
          RequestSettingService,
          "checkIfGivenFrequencyIsPremiumFrequency"
        );
        RequestSettingService.checkIfNonPremiumUserTryToUsePremiumFrequency(
          user,
          Frequency.SEVEN_DAYS
        );
        expect(checkIfGivenFrequencyIsPremiumFrequencySpy).toBeCalledTimes(1);
      });
      describe("user tries to use Premium frequency", () => {
        it(`throws ${FREQUENCY_ONLY_FOR_PREMIUM_USERS} error message`, async () => {
          await expect(
            RequestSettingService.checkIfNonPremiumUserTryToUsePremiumFrequency(
              user,
              Frequency.FIVE_SECONDS
            )
          ).rejects.toThrowError(FREQUENCY_ONLY_FOR_PREMIUM_USERS);
        });
      });
    });
  });

  describe("checkIfNonPremiumUserTryToUseCustomError", () => {
    describe("if user's role is 'user' and there's Premium custom errors", () => {
      const customEmailErrors: number[] = [400];
      it(`throws ${ALERTS_ONLY_FOR_PREMIUM_USERS}`, async () => {
        await expect(
          RequestSettingService.checkIfNonPremiumUserTryToUseCustomError(
            user,
            customEmailErrors,
            undefined
          )
        ).rejects.toThrowError(ALERTS_ONLY_FOR_PREMIUM_USERS);
      });
    });
    describe("if user's role is 'premium' and there's Premium custom errors", () => {
      const user = new User("John", "Doe", "johndoe@email.com", "password");
      user.role = Role.PREMIUM;
      const customEmailErrors: number[] = [400];
      it(`not throws any error`, async () => {
        expect(
          RequestSettingService.checkIfNonPremiumUserTryToUseCustomError(
            user,
            customEmailErrors,
            undefined
          )
        ).resolves;
      });
    });
  });

  describe("checkIfGivenFrequencyIsPremiumFrequency", () => {
    describe("with Premium frequency", () => {
      it("returns true", () => {
        expect(
          RequestSettingService.checkIfGivenFrequencyIsPremiumFrequency(
            Frequency.FIVE_SECONDS
          )
        ).toEqual(true);
      });
    });
    describe("with non-Premium frequency", () => {
      it("returns false", () => {
        expect(
          RequestSettingService.checkIfGivenFrequencyIsPremiumFrequency(
            Frequency.SEVEN_DAYS
          )
        ).toEqual(false);
      });
    });
  });

  describe("getRequestSettingsByFrequency", () => {
    it("call getRequestSettingsByFrequency once with given frequency", () => {
      const getRequestSettingsByFrequencySpy = jest.spyOn(
        RequestSettingRepository,
        "getRequestSettingsByFrequency"
      );
      const frequency = Frequency.FIVE_SECONDS;
      RequestSettingService.getRequestSettingsByFrequency(frequency);
      expect(getRequestSettingsByFrequencySpy).toBeCalledTimes(1);
      expect(getRequestSettingsByFrequencySpy).toBeCalledWith(frequency);
    });
  });

  describe("getRequestSettingWithLastResultByRequestSettingId", () => {
    it("call getRequestSettingById once", () => {
      const getRequestSettingByIdSpy = jest.spyOn(
        RequestSettingRepository,
        "getRequestSettingById"
      );
      RequestSettingService.getRequestSettingWithLastResultByRequestSettingId(
        "5f4a0184-2628-42cf-b16a-293a3fad9ed8"
      );
      expect(getRequestSettingByIdSpy).toBeCalledTimes(1);
    });
    describe("if request setting exists", () => {
      it("call getMostRecentByRequestSettingId once", async () => {
        const getMostRecentByRequestSettingIdSpy = jest.spyOn(
          RequestResultRepository,
          "getMostRecentByRequestSettingId"
        );
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );

        await RequestSettingService.getRequestSettingWithLastResultByRequestSettingId(
          requestSetting.id
        );
        expect(getMostRecentByRequestSettingIdSpy).toBeCalledTimes(1);
      });
      describe("lastRequestResult is null", () => {
        it("returns RequestSettingWithLastResult object with null as requestResult", async () => {
          const requestSetting = await RequestSettingService.createRequest(
            "https://url.com",
            Frequency.ONE_HOUR,
            undefined,
            undefined,
            true,
            false,
            false,
            undefined,
            undefined,
            user
          );
          const requestSettingWithLastResult =
            await RequestSettingService.getRequestSettingWithLastResultByRequestSettingId(
              requestSetting.id
            );
          if (requestSettingWithLastResult) {
            expect(requestSettingWithLastResult).toBeInstanceOf(
              RequestSettingWithLastResult
            );
            expect(requestSettingWithLastResult.requestResult).toBe(null);
          }
        });
      });
      describe("lastRequestResult is not null", () => {
        it("returns RequestSettingWithLastResult object with existing requestResult", async () => {
          const requestSetting = await RequestSettingService.createRequest(
            "https://url.com",
            Frequency.ONE_HOUR,
            undefined,
            undefined,
            true,
            false,
            false,
            undefined,
            undefined,
            user
          );

          const requestResult = new RequestResult(
            requestSetting,
            requestSetting.url,
            undefined,
            200,
            1600
          );

          await RequestResultService.saveRequestResult(requestResult);

          const requestSettingWithLastResult =
            await RequestSettingService.getRequestSettingWithLastResultByRequestSettingId(
              requestSetting.id
            );
          if (requestSettingWithLastResult) {
            expect(requestSettingWithLastResult).toBeInstanceOf(
              RequestSettingWithLastResult
            );
            expect(
              requestSettingWithLastResult.requestResult?.duration
            ).toEqual(1600);
          }
        });
      });
    });
  });

  describe("deleteRequestSettingById", () => {
    it("call getRequestSettingById once", async () => {
      const getRequestSettingByIdSpy = jest.spyOn(
        RequestSettingRepository,
        "getRequestSettingById"
      );
      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );
      await RequestSettingService.deleteRequestSettingById(
        user,
        requestSetting.id
      );
      expect(getRequestSettingByIdSpy).toBeCalledTimes(1);
    });
    describe("if requestSetting not exists", () => {
      it(`throws ${REQUEST_DOESNT_EXIST} error message`, async () => {
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );
        return await expect(async () => {
          await RequestSettingService.deleteRequestSettingById(
            user,
            "6fb4ab78-83d3-4a73-ade8-619ebdb79134"
          );
        }).rejects.toThrowError(REQUEST_DOESNT_EXIST);
      });
    });
    describe("if requestSetting exists", () => {
      it("call checkIfRequestBelongsToUserByRequestSetting once", async () => {
        const checkIfRequestBelongsToUserByRequestSettingSpy = jest.spyOn(
          RequestSettingService,
          "checkIfRequestBelongsToUserByRequestSetting"
        );
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );
        await RequestSettingService.deleteRequestSettingById(
          user,
          requestSetting.id
        );
        expect(checkIfRequestBelongsToUserByRequestSettingSpy).toBeCalledTimes(
          1
        );
      });
      it("call deleteRequestSetting once", async () => {
        const deleteRequestSettingSpy = jest.spyOn(
          RequestSettingService,
          "deleteRequestSetting"
        );
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );
        await RequestSettingService.deleteRequestSettingById(
          user,
          requestSetting.id
        );
        expect(deleteRequestSettingSpy).toBeCalledTimes(1);
      });
      it("remove existing request setting from database and return true", async () => {
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );

        const requestSettings =
          await RequestSettingRepository.repository.find();
        expect(requestSettings).toHaveLength(1);

        const isDeleted = await RequestSettingService.deleteRequestSettingById(
          user,
          requestSetting.id
        );

        const requestSettingsAfterDeletion =
          await RequestSettingRepository.repository.find();
        expect(requestSettingsAfterDeletion).toHaveLength(0);
        expect(isDeleted).toEqual(true);
      });
    });
  });

  describe("getRequestSettingByIdOrThrowNotFoundError", () => {
    it("call getRequestSettingById once with given requestSettingId", async () => {
      const getRequestSettingByIdSpy = jest.spyOn(
        RequestSettingService,
        "getRequestSettingById"
      );
      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );
      await RequestSettingService.getRequestSettingByIdOrThrowNotFoundError(
        requestSetting.id
      );
      expect(getRequestSettingByIdSpy).toBeCalledTimes(1);
      expect(getRequestSettingByIdSpy).toBeCalledWith(requestSetting.id);
    });
    describe("if request setting not exists", () => {
      it(`throws ${REQUEST_DOESNT_EXIST} error`, async () => {
        return await expect(async () => {
          await RequestSettingService.getRequestSettingByIdOrThrowNotFoundError(
            "249f8ef2-cb37-4bb0-99c0-23856bd48f1c"
          );
        }).rejects.toThrowError(REQUEST_DOESNT_EXIST);
      });
    });
    describe("if request setting exists", () => {
      it("returns existing request setting", async () => {
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );
        const result =
          await RequestSettingService.getRequestSettingByIdOrThrowNotFoundError(
            requestSetting.id
          );
        expect(result).toBeInstanceOf(RequestSetting);
        expect(result.user.lastname).toBe("Doe");
      });
    });
  });

  describe("updateRequest", () => {
    it("call getRequestSettingByIdOrThrowNotFoundError once with given id", async () => {
      const getRequestSettingByIdOrThrowNotFoundErrorSpy = jest.spyOn(
        RequestSettingService,
        "getRequestSettingByIdOrThrowNotFoundError"
      );

      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );

      await RequestSettingService.updateRequest(
        requestSetting.id,
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

      expect(getRequestSettingByIdOrThrowNotFoundErrorSpy).toBeCalledTimes(1);
      expect(getRequestSettingByIdOrThrowNotFoundErrorSpy).toBeCalledWith(
        requestSetting.id
      );
    });
    it("call checkIfRequestBelongsToUserByRequestSetting once", async () => {
      const checkIfRequestBelongsToUserByRequestSettingSpy = jest.spyOn(
        RequestSettingService,
        "checkIfRequestBelongsToUserByRequestSetting"
      );

      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );

      await RequestSettingService.updateRequest(
        requestSetting.id,
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

      expect(checkIfRequestBelongsToUserByRequestSettingSpy).toBeCalledTimes(1);
    });
    it("call checkForBlockingCases once with correct parameters", async () => {
      const checkForBlockingCasesSpy = jest.spyOn(
        RequestSettingService,
        "checkForBlockingCases"
      );

      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );

      expect(checkForBlockingCasesSpy).toBeCalledTimes(1);

      await RequestSettingService.updateRequest(
        requestSetting.id,
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

      expect(checkForBlockingCasesSpy).toBeCalledTimes(2);
      expect(checkForBlockingCasesSpy).toBeCalledWith(
        user,
        url,
        name,
        headers,
        frequency,
        customEmailErrors,
        customPushErrors,
        requestSetting.id
      );
    });
    it("save updated request in database with correct values", async () => {
      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );

      await RequestSettingService.updateRequest(
        requestSetting.id,
        "https://url-2.com",
        Frequency.THIRTY_DAYS,
        "My URL",
        headers,
        false,
        allErrorsEnabledEmail,
        allErrorsEnabledPush,
        customEmailErrors,
        customPushErrors,
        user
      );

      const updatedRequestSetting =
        await RequestSettingService.getRequestSettingById(requestSetting.id);

      expect(updatedRequestSetting?.url).toBe("https://url-2.com");
      expect(updatedRequestSetting?.frequency).toBe(Frequency.THIRTY_DAYS);
      expect(updatedRequestSetting?.name).toBe("My URL");
      expect(updatedRequestSetting?.isActive).toBe(false);
    });
    describe("if given name is undefined", () => {
      it("set request's name to empty string in database", async () => {
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );

        await RequestSettingService.updateRequest(
          requestSetting.id,
          url,
          frequency,
          undefined,
          headers,
          isActive,
          allErrorsEnabledEmail,
          allErrorsEnabledPush,
          customEmailErrors,
          customPushErrors,
          user
        );

        const updatedRequestSetting =
          await RequestSettingService.getRequestSettingById(requestSetting.id);

        expect(updatedRequestSetting?.name).toBe("");
        expect(updatedRequestSetting?.name).toHaveLength(0);
      });
    });
    describe("if given headers are undefined", () => {
      it("set request's headers to empty string in database", async () => {
        const requestSetting = await RequestSettingService.createRequest(
          "https://url.com",
          Frequency.ONE_HOUR,
          undefined,
          undefined,
          true,
          false,
          false,
          undefined,
          undefined,
          user
        );

        await RequestSettingService.updateRequest(
          requestSetting.id,
          url,
          frequency,
          name,
          undefined,
          isActive,
          allErrorsEnabledEmail,
          allErrorsEnabledPush,
          customEmailErrors,
          customPushErrors,
          user
        );

        const updatedRequestSetting =
          await RequestSettingService.getRequestSettingById(requestSetting.id);

        expect(updatedRequestSetting?.headers).toBe("");
        expect(updatedRequestSetting?.headers).toHaveLength(0);
      });
    });
    it("call updateAlerts once with correct parameters", async () => {
      const updateAlertsSpy = jest.spyOn(AlertSettingService, "updateAlerts");

      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );

      const updatedRequestSetting = await RequestSettingService.updateRequest(
        requestSetting.id,
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

      expect(updateAlertsSpy).toBeCalledTimes(1);
      expect(updateAlertsSpy).toBeCalledWith(
        updatedRequestSetting,
        customEmailErrors,
        customPushErrors,
        allErrorsEnabledEmail,
        allErrorsEnabledPush
      );
    });
    it("returns updated request setting", async () => {
      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );

      const updatedRequestSetting = await RequestSettingService.updateRequest(
        requestSetting.id,
        url,
        Frequency.THIRTY_DAYS,
        name,
        headers,
        isActive,
        allErrorsEnabledEmail,
        allErrorsEnabledPush,
        customEmailErrors,
        customPushErrors,
        user
      );

      expect(updatedRequestSetting).toBeInstanceOf(RequestSetting);
      expect(updatedRequestSetting.frequency).toBe(Frequency.THIRTY_DAYS);
    });
  });

  describe("getRequestSettingById", () => {
    it("call getRequestSettingById once with given id", async () => {
      const getRequestSettingByIdSpy = jest.spyOn(
        RequestSettingService,
        "getRequestSettingById"
      );
      const requestSetting = await RequestSettingService.createRequest(
        "https://url.com",
        Frequency.ONE_HOUR,
        undefined,
        undefined,
        true,
        false,
        false,
        undefined,
        undefined,
        user
      );
      await RequestSettingService.getRequestSettingById(requestSetting.id);
      expect(getRequestSettingByIdSpy).toBeCalledTimes(1);
      expect(getRequestSettingByIdSpy).toBeCalledWith(requestSetting.id);
    });
  });
});
