import { hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';

import { closeConnection, initializeRepositories, truncateAllTables } from '../database/utils';
import User, { Status } from '../entities/User.entity';
import UserRepository from '../repositories/User.repository';
import UserService from './User.service';

describe("UserService integration", () => {
  jest.mock("./User.service");

  const emailAddress = "unknown@user.com";

  const createUserSpy = jest.fn();
  createUserSpy.mockImplementation(
    async (
      firstname: string = "John",
      lastname: string = "Doe",
      email: string = emailAddress,
      password: string = "password"
    ) => {
      const user = new User(firstname, lastname, email, hashSync(password));
      const userWithDesiredEmail = await UserRepository.findByEmail(email);
      if (userWithDesiredEmail) throw Error("This email is already used");
      user.accountConfirmationToken = randomBytes(32).toString("hex");
      user.accountConfirmationTokenCreatedAt = new Date();
      const savedUser = await UserRepository.repository.save(user);
      buildAccountConfirmationMessageToQueueSpy(user);
      return savedUser;
    }
  );

  const buildAccountConfirmationMessageToQueueSpy = jest.fn();
  buildAccountConfirmationMessageToQueueSpy.mockImplementation(
    (user: User, isResent?: boolean) => {
      let message = {};
      if (isResent) {
        message = {
          firstname: user.firstname,
          email: user.email,
          confirmationToken: user.accountConfirmationToken,
          isResent: true,
        };
      } else {
        message = {
          firstname: user.firstname,
          email: user.email,
          confirmationToken: user.accountConfirmationToken,
        };
      }
      sendMessageOnAccountCreationEmailQueueSpy(message);
      return message;
    }
  );

  const sendMessageOnAccountCreationEmailQueueSpy = jest.fn();
  sendMessageOnAccountCreationEmailQueueSpy.mockImplementation(() => {
    return;
  });

  beforeAll(async () => {
    await initializeRepositories();
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
        await createUserSpy("Jane", "Doe");
        expect(async () => await createUserSpy()).rejects.toThrowError(
          "This email is already used"
        );
      });
    });
    describe("when user is created", () => {
      it("exists in user table", async () => {
        await createUserSpy();
        const users = await UserRepository.repository.find();
        expect(users).toHaveLength(1);
        expect(users[0].email).toEqual(emailAddress);
      });
      it("has proper attributes with correct values", async () => {
        const user = await createUserSpy();
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
        const user = await createUserSpy();
        const message = buildAccountConfirmationMessageToQueueSpy(user);
        expect(message.firstname).toEqual(user.firstname);
        expect(message.email).toEqual(user.email);
        expect(message.confirmationToken).toEqual(
          user.accountConfirmationToken
        );
      });
      it("should be called once", async () => {
        await createUserSpy();
        expect(buildAccountConfirmationMessageToQueueSpy).toHaveBeenCalledTimes(
          1
        );
      });
    });
  });

  describe("buildAccountConfirmationMessageToQueue", () => {
    it("should call sendMessageOnAccountCreationEmailQueueSpy once", async () => {
      await createUserSpy();
      expect(sendMessageOnAccountCreationEmailQueueSpy).toHaveBeenCalledTimes(
        1
      );
    });
    describe("when account confirmation token is sent again", () => {
      it("build a message with isResent property set to true", async () => {
        const user = await createUserSpy();
        const message = await buildAccountConfirmationMessageToQueueSpy(
          user,
          true
        );
        expect(message).toHaveProperty("isResent");
        expect(message.isResent).toEqual(true);
      });
      describe("when account confirmation token is sent for the first time", () => {
        it("build a message without isResent property", async () => {
          const user = await createUserSpy();
          const message = buildAccountConfirmationMessageToQueueSpy(user);
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
          await createUserSpy();
          expect(async () => {
            await UserService.signIn(emailAddress, "wrong-password");
          }).rejects.toThrowError("Incorrect credentials");
        });
      });
      describe("when password valid", () => {
        describe("when user account is active", () => {
          it("returns user and session", async () => {
            const user = await createUserSpy();
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
            await createUserSpy();
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
        await createUserSpy();

        expect(async () => {
          await UserService.confirmAccount("invalid-token");
        }).rejects.toThrowError("Invalid confirmation token");
      });
    });
    describe("when confirmation token is valid", () => {
      it("updates user status and clear accountConfirmationToken and return success message", async () => {
        const user = await createUserSpy();

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
