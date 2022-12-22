import { closeConnection, getDatabase, initializeRepositories } from '../database/utils';
import UserService from './User.service';

describe("UserService integration", () => {
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
      it("throws invalid credentials error", async () => {
        const emailAddress = "unknown@user.com";
        expect(() =>
          UserService.signIn(emailAddress, "whatever")
        ).rejects.toThrowError("Incorrect credentials");
      });
    });

    describe("When email address belongs to existing user", () => {
      const emailAddress = "jean@user.com";
      describe("When password invalid", () => {
        it("throws invalid credentials error", async () => {});
      });
    });
  });
});
