import Session from "../entities/Session.entity";
import User from "../entities/User.entity";
import SessionRepository from "../repositories/Session.repository";

export default class SessionService extends SessionRepository {
  static createSession(user: User): Promise<Session> {
    const session = new Session(user);
    return this.saveSession(session);
  }

  static deleteSessionById(id: string): Promise<void> {
    return this.deleteSessionById(id);
  }
}
