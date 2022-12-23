import { hashSync } from 'bcryptjs';

import { closeConnection, getDatabase, initializeRepositories } from '../database/utils';
import User, { Status } from '../entities/User.entity';
import UserRepository from '../repositories/User.repository';
import UserService from './User.service';

describe("UserService integration", () => {
  const emailAddress = "unknown@user.com";
  function createUser() {
    return new User("Jean", "Wilder", emailAddress, hashSync("jean-password"));
  }

  beforeAll(async () => {
    await initializeRepositories();
  });

  afterAll(async () => {
    await closeConnection();
  });

  beforeEach(async () => {
    const database = await getDatabase();
    for (const entity of database.entityMetadatas) {
      const repository = database.getRepository(entity.name);
      await repository.query(
        `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`
      );
    }
  });

  describe("createUser", () => {
    describe("when user is created", () => {
      it("exists in user table", () => {});
      it("datas match user inputs", () => {});
      it("password is hashed", () => {});
      it("has proper attributes with correct values", () => {});
    });
    describe("setting account confirmation email datas", () => {
      it("create message object with user informations", () => {});
    });
    describe("sendMessageOnAccountCreationEmailQueue", () => {
      it("should be called", () => {});
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
          const user = createUser();
          await UserRepository.repository.save(user);

          expect(async () => {
            await UserService.signIn(emailAddress, "jean-wrong-password");
          }).rejects.toThrowError("Incorrect credentials");
        });
      });
      describe("when password valid", () => {
        describe("when user account is active", () => {
          it("returns user and session", async () => {
            const user = createUser();
            user.status = Status.ACTIVE;
            user.accountConfirmationToken = "";
            await UserRepository.repository.save(user);

            const result = await UserService.signIn(
              emailAddress,
              "jean-password"
            );
            expect(result).toHaveProperty("user");
            expect(result).toHaveProperty("session");
            expect(result.user.accountConfirmationToken).toBe("");
            expect(result.user.email).toEqual(emailAddress);
          });
        });
        describe("when user account is inactive or pending", () => {
          it("throws account not activated error", async () => {
            const user = createUser();
            await UserRepository.repository.save(user);

            expect(async () => {
              await UserService.signIn(emailAddress, "jean-password");
            }).rejects.toThrowError(
              "Your account is not active, click on the link in your email to activate it"
            );
          });
        });
      });
    });
  });

  describe("confirmAccount", () => {
    describe("when confirmationToken doesn't exist", () => {
      it("throws Invalid confirmation token", () => {
        expect(async () => {
          await UserService.confirmAccount("invalid-token");
        }).rejects.toThrowError("Invalid confirmation token");
      });
    });
    describe("when confirmation token is valid", () => {
      it("updates user status", () => {});
    });
  });
});
