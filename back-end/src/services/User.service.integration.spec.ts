import { closeConnection, getDatabase, initializeRepositories } from '../database/utils';
import UserService from './User.service';

describe("UserService integration", () => {
  beforeAll(async () => {
    console.log("initializeRepositories");
    await initializeRepositories();
  });

  afterAll(async () => {
    console.log("closeConnection");
    await closeConnection();
  });

  beforeEach(async () => {
    // eslint-disable-next-line no-restricted-syntax
    const database = await getDatabase();
    for (const entity of database.entityMetadatas) {
      const repository = database.getRepository(entity.name);
      await repository.query(
        `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`
      );
    }
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
