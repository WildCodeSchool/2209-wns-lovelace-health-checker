import {
  closeConnection,
  getDatabase,
  initializeRepositories,
  truncateAllTables,
} from "../../database/utils";
import RequestSetting, {
  Frequency,
} from "../../entities/RequestSetting.entity";
import User, { Role } from "../../entities/User.entity";
import AlertSettingService from "../AlertSetting/AlertSetting.service";
import RequestSettingService from "./RequestSetting.service";

const setPushAlerts = () => {
  return jest
    .spyOn(AlertSettingService, "setPushAlerts")
    .mockImplementation((data: any) => {
      return data;
    });
};

const setEmailAlerts = () => {
  return jest
    .spyOn(AlertSettingService, "setEmailAlerts")
    .mockImplementation((data: any) => {
      return data;
    });
};

const failIfHeadersAreBadlyFormatted = () => {
  return jest
    .spyOn(RequestSettingService, "failIfHeadersAreBadlyFormatted")
    .mockImplementation((data: any) => {
      return data;
    });
};

const failIfNonPremiumUserTryToUsePremiumFrequency = () => {
  return jest
    .spyOn(
      RequestSettingService,
      "failIfNonPremiumUserTryToUsePremiumFrequency"
    )
    .mockImplementation((data: any) => {
      return data;
    });
};

const failIfNonPremiumUserTryToUseCustomError = () => {
  return jest
    .spyOn(RequestSettingService, "failIfNonPremiumUserTryToUseCustomError")
    .mockImplementation((data: any) => {
      return data;
    });
};

const createRequest = () => {
  return jest
    .spyOn(RequestSettingService, "createRequest")
    .mockImplementation((data: any) => {
      return data;
    });
};

const failIfNonPremiumUserHasReachedMaxRequestsCount = () => {
  return jest
    .spyOn(
      RequestSettingService,
      "failIfNonPremiumUserHasReachedMaxRequestsCount"
    )
    .mockImplementation((user: User) => {
      return Promise.resolve(false);
    });
};

describe("RequestService integration", () => {
  const user = new User("John", "Doe", "john.doe@email.com", "password");
  user.role = Role.USER;

  const url = "https://example.com";
  const frequency = Frequency.ONE_HOUR;
  const name = "dummyName";
  const headers = '[{"property":"content-type","value":"application/json"}]';
  const isActive = false;
  const allErrorsEnabledEmail = true;
  const allErrorsEnabledPush = false;
  const customEmailErrors: number[] = [];
  const customPushErrors: number[] = [];

  beforeAll(async () => {
    await getDatabase();
    await initializeRepositories();
  });

  beforeEach(async () => {
    await truncateAllTables();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("createRequest", () => {
    it("calls failIfBlockingCases once", async () => {});
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

    // TODO : move into failIfBlockingCases tests
    describe("non Premium user try to use Premium features", () => {
      describe("non Premium user uses Premium frequency", () => {
        it("displays 'This frequency is only useable by Premium users' error message", () => {});
      });
      describe("non Premium user uses email or push custom error", () => {
        it("displays 'Non Premium users can't use custom error alerts' error message", () => {});
      });
    });
  });

  describe("failIfNonPremiumUserHasReachedMaxRequestsCount", () => {
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

  describe("failIfURLOrNameAreAlreadyUsed", () => {
    it("calls getByUserId once", () => {});
    describe("URL is already used", () => {
      it("displays 'This URL already exists' error message", () => {});
    });
    describe("name is already used", () => {
      it("displays 'This name already exists' error message", () => {});
    });
  });

  describe("checkIfHeadersHasAllProperties", () => {
    describe("headers format is incorrect", () => {
      it("returns false", () => {});
    });
    describe("headers format is correct", () => {
      it("returns true", () => {});
    });
  });

  describe("failIfHeadersAreBadlyFormatted", () => {
    it("calls checkIfHeadersHasAllProperties once", () => {});
    describe("headers aren't right formatted", () => {
      it("throws 'Headers format is incorrect' error message", () => {});
    });
  });

  describe("failIfNonPremiumUserTryToUsePremiumFrequency", () => {
    describe("if user's role is 'user'", () => {
      it("calls failIfGivenFrequencyIsPremiumFrequency once", () => {});
      describe("user tries to use Premium frequency", () => {
        it("throws 'This frequency is only useable by Premium users' error message", () => {});
      });
    });
  });

  describe("failIfNonPremiumUserTryToUseCustomError", () => {
    describe("if user's role is 'user' and there's Premium custom errors", () => {
      it("throws 'Non Premium users can't use custom error alerts", () => {});
    });
  });

  describe("failIfGivenFrequencyIsPremiumFrequency", () => {
    describe("with Premium frequency", () => {
      it("returns true", () => {});
    });
    describe("with non-Premium frequency", () => {
      it("returns false", () => {});
    });
  });
});
