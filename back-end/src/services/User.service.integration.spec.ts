import { closeConnection, initializeRepositories, truncateAllTables } from '../database/utils';
import { Status } from '../entities/User.entity';
import * as provider from '../rabbitmq/providers';
import UserRepository from '../repositories/User.repository';
import UserService from './User.service';

const sendMessageOnAccountCreationEmailQueueSpy = () => {
  jest
    .spyOn(provider, "sendMessageOnAccountCreationEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

describe("UserService integration", () => {
  const emailAddress = "unknown@user.com";

  beforeAll(async () => {
    await initializeRepositories();
    sendMessageOnAccountCreationEmailQueueSpy();
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
        expect(
          async () =>
            await UserService.createUser(
              "John",
              "Doe",
              emailAddress,
              "password"
            )
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
      it("throws invalid credentials error", () => {
        expect(
          async () => await UserService.signIn(emailAddress, "whatever")
        ).rejects.toThrowError("Incorrect credentials");
      });
    });

    describe("When email address belongs to existing user", () => {
      describe("When password invalid", () => {
        it("throws invalid credentials error", async () => {
          await UserService.createUser("John", "Doe", emailAddress, "password");
          expect(async () => {
            await UserService.signIn(emailAddress, "wrong-password");
          }).rejects.toThrowError("Incorrect credentials");
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
            expect(async () => {
              await UserService.signIn(emailAddress, "password");
            }).rejects.toThrowError(
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

        expect(async () => {
          await UserService.confirmAccount("invalid-token");
        }).rejects.toThrowError("Invalid confirmation token");
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
        expect(result).toEqual("Your account has been confirmed");
        expect(confirmedUser?.status).toEqual(Status.ACTIVE);
        expect(confirmedUser?.accountConfirmationToken).toEqual("");
      });
    });
  });
});
