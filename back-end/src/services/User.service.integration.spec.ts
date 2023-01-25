import {
  closeConnection,
  initializeRepositories,
  truncateAllTables,
} from "../database/utils";
import { Status } from "../entities/User.entity";
import * as provider from "../rabbitmq/providers";
import UserRepository from "../repositories/User.repository";
import UserService from "./User.service";
import * as dotenv from "dotenv";
import SessionService from "./Session.service";
import * as HttpCookies from "../utils/http-cookies";

dotenv.config();

const sendMessageOnAccountCreationEmailQueueSpy = () => {
  jest
    .spyOn(provider, "sendMessageOnAccountCreationEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

const sendMessageOnResetPasswordEmailQueueSpy = () => {
  jest
    .spyOn(provider, "sendMessageOnResetPasswordEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

describe("UserService integration", () => {
  const emailAddress = "unknown@user.com";

  beforeAll(async () => {
    await initializeRepositories();
    sendMessageOnAccountCreationEmailQueueSpy();
    sendMessageOnResetPasswordEmailQueueSpy();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("createUser", () => {
    describe("when email is already used", () => {
      it("throws 'This email is already used' error", async () => {
        await UserService.createUser("Jane", "Doe", emailAddress, "password");
        await expect(
          UserService.createUser("John", "Doe", emailAddress, "password")
        ).rejects.toThrowError("This email is already used");
      });
    });
    describe("when user is created", () => {
      it("exists in user table", async () => {
        await UserService.createUser("John", "Doe", emailAddress, "password");
        const users = await UserRepository.repository.find();
        expect(users).toHaveLength(1);
        expect(users[0].email).toEqual(emailAddress);
      });
      it("has proper attributes with correct values", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const users = await UserRepository.repository.find();
        expect(users[0].id).toHaveLength(36);
        expect(users[0].firstname).toEqual(user.firstname);
        expect(users[0].lastname).toEqual(user.lastname);
        expect(users[0].email).toEqual(user.email);
        expect(users[0].password).not.toEqual("password");
        expect(users[0].createdAt).toBeInstanceOf(Date);
        expect(users[0].updatedAt).toEqual(null);
        expect(users[0].lastLoggedAt).toEqual(null);
        expect(users[0].customerId).toEqual(null);
        expect(users[0].hasCanceledPremium).toEqual(null);
        expect(users[0].status).toEqual("pending");
        expect(users[0].role).toEqual("user");
        expect(users[0].confirmationEmailToken).toEqual(null);
        expect(users[0].emailAwaitingConfirmation).toEqual(null);
        expect(users[0].confirmationEmailCreatedAt).toEqual(null);
        expect(users[0].resetPasswordToken).toEqual(null);
        expect(users[0].resetPasswordTokenCreatedAt).toEqual(null);
        expect(users[0].accountConfirmationToken).toHaveLength(64);
        expect(users[0].accountConfirmationTokenCreatedAt).toBeInstanceOf(Date);
      });
    });
    describe("buildAccountConfirmationMessageToQueue", () => {
      it("should build a message with correct user informations", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const message: any =
          UserService.buildAccountConfirmationMessageToQueue(user);
        expect(message.firstname).toEqual(user.firstname);
        expect(message.email).toEqual(user.email);
        expect(message.confirmationToken).toEqual(
          user.accountConfirmationToken
        );
      });
      it("should be called once", async () => {
        const spy = jest.spyOn(
          UserService,
          "buildAccountConfirmationMessageToQueue"
        );
        await UserService.createUser("John", "Doe", emailAddress, "password");
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("buildAccountConfirmationMessageToQueue", () => {
    it("should call sendMessageOnAccountCreationEmailQueueSpy once", async () => {
      const sendMessageOnAccountCreationEmailQueueSpy = jest
        .spyOn(provider, "sendMessageOnAccountCreationEmailQueue")
        .mockImplementation((data: any) => {
          return data;
        });
      await UserService.createUser("John", "Doe", emailAddress, "password");
      expect(sendMessageOnAccountCreationEmailQueueSpy).toHaveBeenCalledTimes(
        1
      );
    });
    describe("when account confirmation token is sent again", () => {
      it("build a message with isResent property set to true", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const message: any = UserService.buildAccountConfirmationMessageToQueue(
          user,
          true
        );
        expect(message).toHaveProperty("isResent");
        expect(message.isResent).toEqual(true);
      });
      describe("when account confirmation token is sent for the first time", () => {
        it("build a message without isResent property", async () => {
          const user = await UserService.createUser(
            "John",
            "Doe",
            emailAddress,
            "password"
          );
          const message =
            UserService.buildAccountConfirmationMessageToQueue(user);
          expect(message).not.toHaveProperty("isResent");
        });
      });
    });
  });

  describe("signIn", () => {
    describe("When email address does not belong to existing user", () => {
      it("throws invalid credentials error", async () => {
        await expect(
          UserService.signIn(emailAddress, "whatever")
        ).rejects.toThrowError("Incorrect credentials");
      });
    });

    describe("When email address belongs to existing user", () => {
      describe("When password invalid", () => {
        it("throws invalid credentials error", async () => {
          await UserService.createUser("John", "Doe", emailAddress, "password");
          expect(
            UserService.signIn(emailAddress, "wrong-password")
          ).rejects.toThrowError("Incorrect credentials");
        });
      });
      describe("when password valid", () => {
        describe("when user account is active", () => {
          it("returns user and session", async () => {
            const user = await UserService.createUser(
              "John",
              "Doe",
              emailAddress,
              "password"
            );
            user.status = Status.ACTIVE;
            user.accountConfirmationToken = "";
            await UserRepository.repository.save(user);

            const result = await UserService.signIn(emailAddress, "password");
            expect(result).toHaveProperty("user");
            expect(result).toHaveProperty("session");
            expect(result.user.accountConfirmationToken).toBe("");
            expect(result.user.email).toEqual(emailAddress);
          });
        });
        describe("when user account is inactive or pending", () => {
          it("throws account not activated error", async () => {
            await UserService.createUser(
              "John",
              "Doe",
              emailAddress,
              "password"
            );
            expect(
              UserService.signIn(emailAddress, "password")
            ).rejects.toThrowError(
              "Your account is not active, click on the link in your email to activate it"
            );
          });
        });
      });
    });
  });

  describe("confirmAccount", () => {
    describe("when confirmationToken is NOT valid", () => {
      it("throws Invalid confirmation token", async () => {
        await UserService.createUser("John", "Doe", emailAddress, "password");

        expect(
          UserService.confirmAccount("invalid-token")
        ).rejects.toThrowError("Invalid confirmation token");
      });
    });
    describe("when confirmation token is valid", () => {
      it("updates user status and clear accountConfirmationToken and return success message", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );

        const result = await UserService.confirmAccount(
          user.accountConfirmationToken
        );
        const confirmedUser = await UserRepository.repository.findOne({
          where: { id: user.id },
        });
        expect(result).toBe(true);
        expect(confirmedUser?.status).toEqual(Status.ACTIVE);
        expect(confirmedUser?.accountConfirmationToken).toEqual("");
      });
    });
  });

  describe("askForNewPassword", () => {
    describe("when email doesn't exist", () => {
      it("throws 'Email not found' error message", () => {
        expect(
          UserService.askForNewPassword("dummy@email.com")
        ).rejects.toThrowError("Email not found");
      });
    });
    describe("when email exists", () => {
      it("creates resetPasswordToken and set current date for resetPasswordTokenCreatedAt", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        await UserService.askForNewPassword(user.email);
        const createdUser = await UserRepository.repository.findOne({
          where: { id: user.id },
        });
        expect(createdUser?.resetPasswordToken).toHaveLength(64);
        expect(createdUser?.resetPasswordTokenCreatedAt).toBeInstanceOf(Date);
      });
      it("calls buildResetPasswordMessageToQueue once", async () => {
        const spy = jest.spyOn(UserService, "buildResetPasswordMessageToQueue");
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        await UserService.askForNewPassword(user.email);
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("buildResetPasswordMessageToQueue", () => {
    it("should build a message with correct user informations", async () => {
      const user = await UserService.createUser(
        "John",
        "Doe",
        emailAddress,
        "password"
      );
      user.resetPasswordToken =
        "7b99c8e5e2dce5db4f30c69cc4886dd17abbf4fde0dd983ee5c4f54331817754";
      const message: any = UserService.buildResetPasswordMessageToQueue(user);
      expect(message.firstname).toEqual(user.firstname);
      expect(message.email).toEqual(user.email);
      expect(message.resetPasswordToken).toEqual(user.resetPasswordToken);
    });
    it("should call sendMessageOnResetPasswordEmailQueue once", async () => {
      const sendMessageOnResetPasswordEmailQueueSpy = jest
        .spyOn(provider, "sendMessageOnResetPasswordEmailQueue")
        .mockImplementation((data: any) => {
          return data;
        });
      const user = await UserService.createUser(
        "John",
        "Doe",
        emailAddress,
        "password"
      );
      UserService.buildResetPasswordMessageToQueue(user);
      expect(sendMessageOnResetPasswordEmailQueueSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("checkIfResetPasswordTokenIsValid", () => {
    describe("the expiry time has not been reached", () => {
      it("returns true", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const notExpiredDate = new Date(
          new Date().getTime() -
            parseInt(process.env.RESET_PASSWORD_EXPIRATION_DELAY!) / 2
        );
        user.resetPasswordTokenCreatedAt = notExpiredDate;
        expect(UserService.checkIfResetPasswordTokenIsValid(user)).toBe(true);
      });
    });
    describe("the expiry time has been reached", () => {
      it("returns false", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const expiredDate = new Date(
          new Date().getTime() -
            parseInt(process.env.RESET_PASSWORD_EXPIRATION_DELAY!) * 2
        );
        user.resetPasswordTokenCreatedAt = expiredDate;
        expect(UserService.checkIfResetPasswordTokenIsValid(user)).toBe(false);
      });
    });
  });

  describe("resetPassword", () => {
    describe("user doesn't have a valid token", () => {
      it("throws 'Token is no longer valid' error message", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        user.resetPasswordToken =
          "23df6ed6c9c4c11fd6e6f1a599df55726a976876a66cb694bb2091f088eb61d9";
        await expect(
          UserService.resetPassword("password", "badResetPasswordToken")
        ).rejects.toThrowError("Token is no longer valid");
      });
    });
    describe("user have a valid token but token's expiry time has been reached", () => {
      it("throws 'time limit has been exceeded...' error message", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        user.resetPasswordToken =
          "23df6ed6c9c4c11fd6e6f1a599df55726a976876a66cb694bb2091f088eb61d9";
        user.resetPasswordTokenCreatedAt = new Date("2022-01-24 16:44:51.116");
        await UserService.repository.save(user);
        await expect(
          UserService.resetPassword("password", user.resetPasswordToken)
        ).rejects.toThrowError(
          `The ${
            parseInt(process.env.RESET_PASSWORD_EXPIRATION_DELAY!) / 60000
          } minute(s) time limit has been exceeded. Please make a new request`
        );
      });
    });
    describe("token is valid and not expired", () => {
      it("set new password, resetPasswordToken to empty string and set updatedAt", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        user.resetPasswordToken =
          "23df6ed6c9c4c11fd6e6f1a599df55726a976876a66cb694bb2091f088eb61d9";
        user.resetPasswordTokenCreatedAt = new Date();
        await UserService.repository.save(user);
        await UserService.resetPassword("password", user.resetPasswordToken);
        const createdUser = await UserRepository.findByEmail(emailAddress);
        expect(createdUser?.password).not.toBe("password");
        expect(createdUser?.resetPasswordToken).toHaveLength(0);
        expect(createdUser?.updatedAt).toBeInstanceOf(Date);
      });
      it("deleteAllUserSessions is called once", async () => {
        const spy = jest.spyOn(SessionService, "deleteAllUserSessions");
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        user.resetPasswordToken =
          "23df6ed6c9c4c11fd6e6f1a599df55726a976876a66cb694bb2091f088eb61d9";
        user.resetPasswordTokenCreatedAt = new Date();
        await UserService.repository.save(user);
        await UserService.resetPassword("password", user.resetPasswordToken);
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("logout", () => {
    const getSessionIdInCookieSpy = jest
      .spyOn(HttpCookies, "getSessionIdInCookie")
      .mockImplementation((context: any) => {
        return context.cookies.sessionId;
      });

    const deleteSessionByIdSpy = jest
      .spyOn(SessionService, "deleteSessionById")
      .mockImplementation((data: any) => {
        return data;
      });

    describe("getSessionIdInCookie", () => {
      it("should be called once", async () => {
        const context: any = { cookies: { sessionId: "123" } };
        await UserService.logout(context);
        expect(getSessionIdInCookieSpy).toHaveBeenCalledTimes(1);
      });
    });
    // Les deux ci-dessous ne fonctionnent pas...
    describe("when sessionId", () => {
      it("deleteSessionById is called once", async () => {
        const context: any = { cookies: { sessionId: "123" } };
        await UserService.logout(context);
        expect(deleteSessionByIdSpy).toHaveBeenCalledTimes(1);
      });
      it("deleteSessionById is called with correct sessionId", async () => {
        const context: any = { cookies: { sessionId: "123" } };
        await UserService.logout(context);
        expect(deleteSessionByIdSpy).toHaveBeenCalledWith("123");
      });
    });
    describe("when no sessionId", () => {
      it("throws 'You're not signed in' error message", async () => {
        const context: any = { cookies: { sessionId: "" } };
        await expect(UserService.logout(context)).rejects.toThrowError(
          "You're not signed in"
        );
      });
    });
  });
});
