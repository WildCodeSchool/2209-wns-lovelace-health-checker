import {
  closeConnection,
  getDatabase,
  initializeRepositories,
  truncateAllTables,
} from "../../database/utils";
import RequestResult from "../../entities/RequestResult.entity";
import { Frequency } from "../../entities/RequestSetting.entity";
import User, { Role } from "../../entities/User.entity";
import { HeaderElement } from "../../models/header-element.model";
import RequestResultRepository from "../../repositories/RequestResult.repository";
import RequestSettingRepository from "../../repositories/RequestSetting.repository";
import {
  ALERTS_ONLY_FOR_PREMIUM_USERS,
  FREQUENCY_ONLY_FOR_PREMIUM_USERS,
  INCORRECT_HEADER_FORMAT,
  REQUEST_DOESNT_EXIST,
} from "../../utils/info-and-error-messages";
import UserService from "../User/User.service";
import RequestSettingService from "./RequestSetting.service";
import * as provider from "../../rabbitmq/providers";
import RequestSettingWithLastResult from "../../models/RequestSettingWithLastResult";
import RequestResultService from "../RequestResult/RequestResult.service";

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

  beforeAll(async () => {
    await getDatabase();
    await initializeRepositories();
  });

  beforeEach(async () => {
    await truncateAllTables();
    jest.clearAllMocks();
    sendMessageOnAccountCreationEmailQueueSpy =
      sendMessageOnAccountCreationEmailQueue();
  });

  afterAll(async () => {
    await truncateAllTables();
    await closeConnection();
  });

  describe("createRequest", () => {
    it("calls checkForBlockingCases once", async () => {});
    describe("if there's no validation error", () => {
      it("calls saveRequestSetting once", () => {});
      it("creates a new request in database", async () => {
        /*         // Not pass into createRequest from service. It seems that it uses a mock which should explain why we get an User instead of RequestSetting
        const requestSetting = await RequestSettingService.createRequest(
          user,
          url,
          frequency,
          isActive,
          name,
          headers
        );
        
        // gives a User
        console.log({ requestSetting });

        const existingRequestResult =
          await RequestSettingService.repository.findOne({
            where: { id: requestSetting.id },
          });

        // null
        console.log(existingRequestResult);

        expect(existingRequestResult?.url).toBe("toto"); */
      });
      it("calls setPushAlerts once", async () => {});
      it("calls setEmailAlerts once", async () => {});
    });

    // TODO : move into checkForBlockingCases tests
    describe("non Premium user try to use Premium features", () => {
      describe("non Premium user uses Premium frequency", () => {
        it("displays 'This frequency is only useable by Premium users' error message", () => {});
      });
      describe("non Premium user uses email or push custom error", () => {
        it("displays 'Non Premium users can't use custom error alerts' error message", () => {});
      });
    });
  });

  describe("checkIfNonPremiumUserHasReachedMaxRequestsCount", () => {
    describe("non-premium used has reached requests limit", () => {
      it("throws error message", () => {});
    });
    describe("non-premium used has not reached requests limit", () => {
      it("returns false", () => {});
    });
    describe("premium or admin users", () => {
      it("returns false", () => {});
    });
  });

  describe("checkIfURLOrNameAreAlreadyUsed", () => {
    it("calls getByUserId once", () => {});
    describe("URL is already used", () => {
      it("displays 'This URL already exists' error message", () => {});
    });
    describe("name is already used", () => {
      it("displays 'This name already exists' error message", () => {});
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
      const user = new User("John", "Doe", "johndoe@email.com", "password");
      user.role = Role.USER;
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
      const user = new User("John", "Doe", "johndoe@email.com", "password");
      user.role = Role.USER;
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
        const user = await UserService.createUser(
          "John",
          "Doe",
          "johndoe@email.com",
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

        await RequestSettingService.getRequestSettingWithLastResultByRequestSettingId(
          requestSetting.id
        );
        expect(getMostRecentByRequestSettingIdSpy).toBeCalledTimes(1);
      });
      describe("lastRequestResult is null", () => {
        it("returns RequestSettingWithLastResult object with null as requestResult", async () => {
          const user = await UserService.createUser(
            "John",
            "Doe",
            "johndoe@email.com",
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
          const user = await UserService.createUser(
            "John",
            "Doe",
            "johndoe@email.com",
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
      const user = await UserService.createUser(
        "Vianney",
        "Doe",
        "johndoe@email.com",
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
      await RequestSettingService.deleteRequestSettingById(
        user,
        requestSetting.id
      );
      expect(getRequestSettingByIdSpy).toBeCalledTimes(1);
    });
    describe("if requestSetting not exists", () => {
      it(`throws ${REQUEST_DOESNT_EXIST} error message`, async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          "johndoe@email.com",
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
        return await expect(async () => {
          await RequestSettingService.deleteRequestSettingById(
            user,
            "6fb4ab78-83d3-4a73-ade8-619ebdb79134"
          );
        }).rejects.toThrowError(REQUEST_DOESNT_EXIST);
      });
      it("call deleteRequestSetting once", () => {});
      it("remove existing request setting from database and return true", () => {});
    });
    describe("if requestSetting exists", () => {
      it("call checkIfRequestBelongsToUserByRequestSetting once", async () => {
        const checkIfRequestBelongsToUserByRequestSettingSpy = jest.spyOn(
          RequestSettingService,
          "checkIfRequestBelongsToUserByRequestSetting"
        );
        const user = await UserService.createUser(
          "John",
          "Doe",
          "johndoe@email.com",
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
        const user = await UserService.createUser(
          "John",
          "Doe",
          "johndoe@email.com",
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
        await RequestSettingService.deleteRequestSettingById(
          user,
          requestSetting.id
        );
        expect(deleteRequestSettingSpy).toBeCalledTimes(1);
      });
      it("remove existing request setting from database and return true", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          "johndoe@email.com",
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
    it("call getRequestSettingById once", () => {});
    describe("if request setting not exists", () => {
      it(`throws ${REQUEST_DOESNT_EXIST} error`, () => {});
    });
    describe("if request setting exists", () => {
      it("returns existing request setting", () => {});
    });
  });
});
