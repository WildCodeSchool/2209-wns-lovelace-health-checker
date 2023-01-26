import { closeConnection, getDatabase, initializeRepositories, truncateAllTables } from '../database/utils';
import * as provider from '../rabbitmq/providers';
import SessionService from './Session.service';
import UserService from './User.service';

const sendMessageOnAccountCreationEmailQueueSpy = () => {
  return jest
    .spyOn(provider, "sendMessageOnAccountCreationEmailQueue")
    .mockImplementation((data: any) => {
      return data;
    });
};

describe("SessionService integration", () => {
  const emailAddress = "unknown@user.com";

  beforeAll(async () => {
    await getDatabase();
    await initializeRepositories();
    await sendMessageOnAccountCreationEmailQueueSpy();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("createSession", () => {
    describe("when session is created", () => {
      it("session corresponds to given user informations", async () => {
        const user = await UserService.createUser(
          "John",
          "Doe",
          emailAddress,
          "password"
        );
        await SessionService.createSession(user);
        const createdUser = await UserService.findByEmail(emailAddress);
        const session = await SessionService.findByUser(user);
        expect(createdUser!.id).toBe(session![0].user.id);
      });
    });
  });

  describe("deleteAllUserSessions", () => {
    it("delete all user's sessions", async () => {
      const user = await UserService.createUser(
        "John",
        "Doe",
        emailAddress,
        "password"
      );
      await SessionService.createSession(user);
      await SessionService.createSession(user);
      const sessions = await SessionService.findByUser(user);
      expect(sessions).toHaveLength(2);
      await SessionService.deleteAllUserSessions(user);
      const sessionsAfterDeletion = await SessionService.findByUser(user);
      expect(sessionsAfterDeletion).toHaveLength(0);
    });
  });
});
