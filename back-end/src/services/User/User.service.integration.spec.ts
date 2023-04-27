import { compareSync } from "bcryptjs";
import {
  closeConnection,
  getDatabase,
  initializeRepositories,
  truncateAllTables,
} from "../../database/utils";
import User, { Status } from "../../entities/User.entity";
import * as provider from "../../rabbitmq/providers";
import UserRepository from "../../repositories/User.repository";
import * as HttpCookies from "../../utils/http-cookies";
import SessionService from "../Session/Session.service";
import UserService from "./User.service";

const sendMessageOnAccountCreationEmailQueue = () => {
  return jest
    .spyOn(provider, "sendMessageOnAccountCreationEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

const sendMessageOnResetPasswordEmailQueue = () => {
  return jest
    .spyOn(provider, "sendMessageOnResetPasswordEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

const sendMessageOnResetEmailQueue = () => {
  return jest
    .spyOn(provider, "sendMessageOnResetEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

describe("UserService integration", () => {
  const emailAddress = "unknown@user.com";
  let sendMessageOnAccountCreationEmailQueueSpy: jest.SpyInstance<
    Promise<void>
  >;
  let sendMessageOnResetPasswordEmailQueueSpy: jest.SpyInstance<Promise<void>>;
  let sendMessageOnResetEmailQueueSpy: jest.SpyInstance<Promise<void>>;

  beforeAll(async () => {
    await getDatabase();
    await initializeRepositories();
  });

  beforeEach(async () => {
    await truncateAllTables();
    sendMessageOnAccountCreationEmailQueueSpy =
      sendMessageOnAccountCreationEmailQueue();
    sendMessageOnResetPasswordEmailQueueSpy =
      sendMessageOnResetPasswordEmailQueue();
    sendMessageOnResetEmailQueueSpy = sendMessageOnResetEmailQueue();
  });

  afterAll(async () => {
    await truncateAllTables();
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
        expect(users[0].resetPasswordToken).toEqual(null);
        expect(users[0].accountConfirmationToken).toHaveLength(64);
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
        if (!user.accountConfirmationToken) throw new Error("No token found");

        const result = await UserService.confirmAccount(
          user.accountConfirmationToken
        );
        const confirmedUser = await UserRepository.repository.findOne({
          where: { id: user.id },
        });
        expect(result).toBe(true);
        expect(confirmedUser?.status).toEqual(Status.ACTIVE);
        expect(confirmedUser?.accountConfirmationToken).toEqual(null);
      });
    });
  });

  describe("resendAccountConfirmationToken", () => {
    describe("when user does not exist", () => {
      it('throw "User not found" error', () => {
        expect(
          UserService.resendAccountConfirmationToken("dummy@email.com")
        ).rejects.toThrowError("User not found");
      });
    });
    describe("when user exists", () => {
      describe("when user status is already active or inactive", () => {
        it('should throw "Account already active" error', async () => {
          const user = await UserService.createUser(
            "John",
            "Doe",
            emailAddress,
            "password"
          );
          user.status = Status.ACTIVE;
          await UserRepository.repository.save(user);
          expect(
            UserService.resendAccountConfirmationToken(emailAddress)
          ).rejects.toThrowError("Account already active");
        });
      });
      describe("when user status is still pending", () => {
        it("should call buildAccountConfirmationMessageToQueue once ", async () => {
          const spy = jest.spyOn(
            UserService,
            "buildAccountConfirmationMessageToQueue"
          );
          const user = new User("John", "Doe", emailAddress, "password");
          await UserService.repository.save(user);
          await UserService.resendAccountConfirmationToken(emailAddress);
          expect(spy).toHaveBeenCalledTimes(1);
        });
        it("should call buildAccountConfirmationMessageToQueue with the good args ", async () => {
          const user = await UserService.createUser(
            "John",
            "Doe",
            emailAddress,
            "password"
          );
          await UserService.resendAccountConfirmationToken(emailAddress);
          expect(
            UserService.buildAccountConfirmationMessageToQueue
          ).toHaveBeenCalledWith(user, true);
        });
      });
    });
  });

  describe("askForNewPassword", () => {
    describe("when email doesn't exist", () => {
      it("returns informative message", async () => {
        const message = await UserService.askForNewPassword("dummy@email.com");
        expect(message).toBe(
          "If this email address exists, you'll receive an email to regenerate your password. Check your inbox."
        );
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
      it("returns informative message", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const message = await UserService.askForNewPassword(user.email);
        expect(message).toBe(
          "If this email address exists, you'll receive an email to regenerate your password. Check your inbox."
        );
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
      const message: any = await UserService.buildResetPasswordMessageToQueue(
        user
      );
      expect(message.firstname).toEqual(user.firstname);
      expect(message.email).toEqual(user.email);
      expect(message.resetPasswordToken).toEqual(user.resetPasswordToken);
    });
    it("should call sendMessageOnResetPasswordEmailQueue once", async () => {
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
        ).rejects.toThrowError("Your reset password token is no longer valid");
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
      it("throws 'Unauthorized' error message", async () => {
        const context: any = { cookies: { sessionId: "" } };
        await expect(UserService.logout(context)).rejects.toThrowError(
          "Unauthorized"
        );
      });
    });
  });

  describe("updateUserIdentity", () => {
    describe('when "firstname" is not provided', () => {
      it('only updates "lastname"', async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const updatedUser = await UserService.updateUserIdentity(
          user,
          undefined,
          "Williams"
        );
        expect(updatedUser.firstname).toBe("John");
        expect(updatedUser.lastname).toBe("Williams");
      });
    });
    describe('when "lastname" is not provided', () => {
      it('only updates "firstname"', async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const updatedUser = await UserService.updateUserIdentity(user, "James");
        expect(updatedUser.firstname).toBe("James");
        expect(updatedUser.lastname).toBe("Doe");
      });
    });
    describe('when "firstname" and "lastname" are provided', () => {
      it('updates "firstname" and "lastname"', async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const updatedUser = await UserService.updateUserIdentity(
          user,
          "James",
          "Williams"
        );
        expect(updatedUser.firstname).toBe("James");
        expect(updatedUser.lastname).toBe("Williams");
      });
    });
  });

  describe("updateUserPassword", () => {
    describe('when "currentPassword" is incorrect', () => {
      it('throws "Incorrect current password" error message', async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        await expect(
          UserService.updateUserPassword(
            user,
            "wrongPassword",
            "newPassword",
            false,
            ""
          )
        ).rejects.toThrowError("Incorrect current password");
      });
    });
    describe("when currentPassword is correct and disconnectMe is false", () => {
      it("updates password", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const result = await UserService.updateUserPassword(
          user,
          "password",
          "newPassword",
          false,
          ""
        );
        const updatedUser = await UserRepository.findByEmail(emailAddress);
        expect(compareSync("newPassword", updatedUser?.password!)).toBe(true);
        expect(compareSync("password", updatedUser?.password!)).toBe(false);
        expect(result).toBe("Your password has been updated successfully");
      });
    });
    describe("when currentPassword is correct and disconnectMe is true", () => {
      it("updates password and call deleteAllSessionsButNotCurrentOne", async () => {
        const CURRENT_PASSWORD = "password";
        const NEW_PASSWORD = "newPassword";
        const spy = jest.spyOn(
          SessionService,
          "deleteAllSessionsButNotCurrentOne"
        );
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          CURRENT_PASSWORD
        );
        const result = await UserService.updateUserPassword(
          user,
          CURRENT_PASSWORD,
          NEW_PASSWORD,
          true,
          "sessionId"
        );
        const updatedUser = await UserRepository.findByEmail(emailAddress);
        expect(compareSync(NEW_PASSWORD, updatedUser?.password!)).toBe(true);
        expect(compareSync(CURRENT_PASSWORD, updatedUser?.password!)).toBe(
          false
        );
        expect(result).toBe(
          "Your password has been updated successfully. You have been disconnected from all your other devices"
        );
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("updateUserEmail", () => {
    describe("when email is already in use", () => {
      it("throws 'This email is already used' error message", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        await expect(
          UserService.updateUserEmail(user, emailAddress)
        ).rejects.toThrowError("This email is already used");
      });
    });
    describe("when email is not already in use", () => {
      it("should set desiredEmail as emailAwaitingConfirmation property on user ", async () => {
        const newEmailAddress = "newEmailAddress@test.fr";
        jest
          .spyOn(UserService, "buildResetEmailMessageToQueue")
          .mockImplementation((data: any) => {
            return data;
          });
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        const result = await UserService.updateUserEmail(user, newEmailAddress);
        expect(result).toBe(
          "Your request has been processed successfully. Please, check your inbox to confirm your email !"
        );
        const updatedUser = await UserRepository.findByEmail(emailAddress);
        expect(updatedUser?.emailAwaitingConfirmation).toBe(newEmailAddress);
        expect(updatedUser?.confirmationEmailToken).not.toBeNull();
      });
      it('should call "buildResetEmailMessageToQueue" with correct parameters', async () => {
        const buildResetEmailMessageToQueue = () => {
          return jest
            .spyOn(UserService, "buildResetEmailMessageToQueue")
            .mockImplementation((data: any) => {
              return data;
            });
        };
        const spy = buildResetEmailMessageToQueue();
        const newEmailAddress = "newEmailAddress@test.fr";
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        await UserService.updateUserEmail(user, newEmailAddress);
        await UserRepository.findByEmail(emailAddress);
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  // TODO: fix this test
  // describe("buildResetEmailMessageToQueue", () => {
  //   it("should call sendMessageOnResetEmailQueue once", async () => {
  //     const user = await UserService.createUser(
  //       "John",
  //       "Doe",
  //       emailAddress,
  //       "password"
  //     );
  //     await UserService.buildResetEmailMessageToQueue(user);
  //     expect(sendMessageOnResetEmailQueueSpy).toHaveBeenCalledTimes(1);
  //   });
  // });

  describe("confirmEmail", () => {
    describe("when confirmationEmailToken doesn't exist", () => {
      it("throws 'Invalid email confirmation token' error message", async () => {
        await expect(UserService.confirmEmail("token")).rejects.toThrowError(
          "Invalid email confirmation token"
        );
      });
    });
    describe("when confirmationEmailToken exists", () => {
      // describe("when email has already been used by another user", () => {
      //   it.only("throws 'Invalid email confirmation token' error message", async () => {
      //     const newEmailAddress = "newEmailAddress@test.fr";
      //     const user = await UserService.createUser(
      //       "John",
      //       "Doe",
      //       emailAddress,
      //       "password"
      //     );
      //     await UserService.updateUserEmail(user, newEmailAddress);
      //     const updatedFirstUser = await UserRepository.findByEmail(
      //       emailAddress
      //     );
      //     console.log(updatedFirstUser?.confirmationEmailToken);
      //     await UserService.createUser(
      //       "John",
      //       "Doe",
      //       newEmailAddress,
      //       "password"
      //     );

      //     await expect(
      //       UserService.confirmEmail(updatedFirstUser?.confirmationEmailToken!)
      //     ).rejects.toThrowError("This email is already used");
      //   });
      // });
      describe("when email has already been validated by another user", () => {
        it("throws 'Invalid email confirmation token' error message", async () => {
          const newEmailAddress = "newEmailAddress@test.fr";
          const user = await UserService.createUser(
            "John",
            "Doe",
            emailAddress,
            "password"
          );
          await UserService.updateUserEmail(user, newEmailAddress);
          const user2 = await UserService.createUser(
            "John",
            "Doe",
            "test@test.fr",
            "password"
          );
          await UserService.updateUserEmail(user2, newEmailAddress);
          const updatedFirstUser = await UserRepository.findByEmail(
            emailAddress
          );
          const updatedSecondUser = await UserRepository.findByEmail(
            "test@test.fr"
          );
          await UserService.confirmEmail(
            updatedFirstUser?.confirmationEmailToken!
          );
          await expect(
            UserService.confirmEmail(updatedSecondUser?.confirmationEmailToken!)
          ).rejects.toThrowError("Invalid email confirmation token");
        });
      });
    });
  });
});
