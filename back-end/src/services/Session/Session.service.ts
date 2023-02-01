import Session from "../../entities/Session.entity";
import User from "../../entities/User.entity";
import SessionRepository from "../../repositories/Session.repository";

export default class SessionService extends SessionRepository {
  static createSession(user: User): Promise<Session> {
    const session = new Session(user);
    return this.saveSession(session);
  }

  static deleteSessionById(id: string): Promise<void> {
    return this.deleteSession(id);
  }

  static async deleteAllUserSessions(user: User) {
    const sessions = await this.findByUser(user);
    if (sessions) {
      this.deleteSessions(sessions);
    }
  }

  static async deleteAllSessionsButNotCurrentOne(
    user: User,
    currentSessionId: string
  ) {
    const sessions = await this.findByUser(user);
    if (sessions) {
      const sessionsToDelete = sessions.filter(
        (session) => session.id !== currentSessionId
      );
      this.deleteSessions(sessionsToDelete);
    }
  }
}
