describe("RequestService integration", () => {
  describe("checkForErrorsAndCreateRequest", () => {
    it("calls checkIfHeadersAreRightFormatted once", () => {});
    it("calls checkIfNonPremiumUserTryToUsePremiumFrequency once", () => {});
    it("calls checkIfNonPremiumUserTryToUseCustomError once", () => {});
    describe("if there's no validation error", () => {
      it("calls createRequestSetting once", () => {});
      it("calls setPushAlerts once", () => {}); // MOCKER
      it("calls setEmailAlerts once", () => {}); // MOCKER
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
