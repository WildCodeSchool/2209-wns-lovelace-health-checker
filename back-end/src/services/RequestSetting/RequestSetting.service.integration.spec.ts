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

const checkIfHeadersAreRightFormatted = () => {
  return jest
    .spyOn(RequestSettingService, "checkIfHeadersAreRightFormatted")
    .mockImplementation((data: any) => {
      return data;
    });
};

const checkIfNonPremiumUserTryToUsePremiumFrequency = () => {
  return jest
    .spyOn(
      RequestSettingService,
      "checkIfNonPremiumUserTryToUsePremiumFrequency"
    )
    .mockImplementation((data: any) => {
      return data;
    });
};

const checkIfNonPremiumUserTryToUseCustomError = () => {
  return jest
    .spyOn(RequestSettingService, "checkIfNonPremiumUserTryToUseCustomError")
    .mockImplementation((data: any) => {
      return data;
    });
};

const createRequestSetting = () => {
  return jest
    .spyOn(RequestSettingService, "createRequestSetting")
    .mockImplementation((data: any) => {
      return data;
    });
};

describe("RequestService integration", () => {
  const userWithUserRole = new User(
    "John",
    "Doe",
    "john.doe@email.com",
    "password"
  );
  userWithUserRole.role = Role.USER;

  const userWithPremiumRole = new User(
    "John",
    "Doe",
    "john.doe@email.com",
    "password"
  );
  userWithPremiumRole.role = Role.PREMIUM;

  const url = "https://example.com";
  const frequency = Frequency.ONE_HOUR;
  const name = "dummyName";
  const headers = '[{"property":"content-type","value":"application/json"}]';
  const isActive = false;
  const allErrorsEnabledEmail = true;
  const allErrorsEnabledPush = false;
  const customEmailErrors: number[] = [];
  const customPushErrors: number[] = [];

  const checkForErrorsAndCreateRequestForUser = () => {
    RequestSettingService.checkForErrorsAndCreateRequest(
      url,
      frequency,
      name,
      headers,
      isActive,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      customEmailErrors,
      customPushErrors,
      userWithUserRole
    );
  };

  const checkForErrorsAndCreateRequestForPremium = () => {
    RequestSettingService.checkForErrorsAndCreateRequest(
      url,
      Frequency.ONE_MINUTE,
      name,
      headers,
      isActive,
      allErrorsEnabledEmail,
      allErrorsEnabledPush,
      [400],
      [400],
      userWithPremiumRole
    );
  };

  let setPushAlertsSpy: jest.SpyInstance<Promise<void>>;
  let setEmailAlertsSpy: jest.SpyInstance<Promise<void>>;
  let checkIfHeadersAreRightFormattedSpy: jest.SpyInstance<void>;
  let checkIfNonPremiumUserTryToUsePremiumFrequencySpy: jest.SpyInstance<void>;
  let checkIfNonPremiumUserTryToUseCustomErrorSpy: jest.SpyInstance<void>;
  let createRequestSettingSpy: jest.SpyInstance<Promise<RequestSetting>>;

  beforeAll(async () => {
    await getDatabase();
    await initializeRepositories();
  });

  beforeEach(async () => {
    await truncateAllTables();
    setPushAlertsSpy = setPushAlerts();
    setEmailAlertsSpy = setEmailAlerts();
    checkIfHeadersAreRightFormattedSpy = checkIfHeadersAreRightFormatted();
    checkIfNonPremiumUserTryToUsePremiumFrequencySpy =
      checkIfNonPremiumUserTryToUsePremiumFrequency();
    checkIfNonPremiumUserTryToUseCustomErrorSpy =
      checkIfNonPremiumUserTryToUseCustomError();
    createRequestSettingSpy = createRequestSetting();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("checkForErrorsAndCreateRequest", () => {
    it("calls checkIfHeadersAreRightFormatted once", async () => {
      checkForErrorsAndCreateRequestForUser();
      expect(checkIfHeadersAreRightFormattedSpy).toHaveBeenCalledTimes(1);
    });
    it("calls checkIfNonPremiumUserTryToUsePremiumFrequency once", () => {
      checkForErrorsAndCreateRequestForUser();
      expect(
        checkIfNonPremiumUserTryToUsePremiumFrequencySpy
      ).toHaveBeenCalledTimes(1);
    });
    it("calls checkIfNonPremiumUserTryToUseCustomError once", () => {
      checkForErrorsAndCreateRequestForUser();
      expect(checkIfNonPremiumUserTryToUseCustomErrorSpy).toHaveBeenCalledTimes(
        1
      );
    });
    describe("if there's no validation error", () => {
      it("calls createRequestSetting once", () => {
        checkForErrorsAndCreateRequestForUser();
        expect(createRequestSettingSpy).toHaveBeenCalledTimes(1);
      });
      it("calls setPushAlerts once", () => {
        checkForErrorsAndCreateRequestForUser();
        expect(setPushAlertsSpy).toHaveBeenCalledTimes(1);
      });
      it("calls setEmailAlerts once", () => {
        checkForErrorsAndCreateRequestForUser();
        expect(setEmailAlertsSpy).toHaveBeenCalledTimes(1);
      });
      it("returns RequestSetting object", () => {});
    });
  });

  describe("createRequestSetting", () => {
    it("calls checkIfNonPremiumUserHasReachedMaxRequestsCount once", () => {});
    it("calls checkIfURLOrNameAreAlreadyUsed once", () => {});

    describe("if there's no validation error", () => {
      it("calls saveRequestSetting once", () => {});
      it("creates a new request in database", () => {});
    });

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
    it("calls getRequestSettingsByUserId once", () => {});
    describe("URL is already used", () => {
      it("displays 'This URL already exists' error message", () => {});
    });
    describe("name is already used", () => {
      it("displays 'This name already exists' error message", () => {});
    });
  });

  describe("headerHasAllHaveProperties", () => {
    describe("headers format is incorrect", () => {
      it("returns false", () => {});
    });
    describe("headers format is correct", () => {
      it("returns true", () => {});
    });
  });

  describe("checkIfHeadersAreRightFormatted", () => {
    it("calls headerHasAllHaveProperties once", () => {});
    describe("headers aren't right formatted", () => {
      it("throws 'Headers format is incorrect' error message", () => {});
    });
  });

  describe("checkIfNonPremiumUserTryToUsePremiumFrequency", () => {
    describe("if user's role is 'user'", () => {
      it("calls checkIfGivenFrequencyIsPremiumFrequency once", () => {});
      describe("user tries to use Premium frequency", () => {
        it("throws 'This frequency is only useable by Premium users' error message", () => {});
      });
    });
  });

  describe("checkIfNonPremiumUserTryToUseCustomError", () => {
    describe("if user's role is 'user' and there's Premium custom errors", () => {
      it("throws 'Non Premium users can't use custom error alerts", () => {});
    });
  });

  describe("checkIfGivenFrequencyIsPremiumFrequency", () => {
    describe("with Premium frequency", () => {
      it("returns true", () => {});
    });
    describe("with non-Premium frequency", () => {
      it("returns false", () => {});
    });
  });
});
