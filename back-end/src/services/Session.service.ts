import AppUser from '../entities/AppUser.entity';
import Session from '../entities/Session.entity';
import SessionRepository from '../repositories/Session.repository';

export default class SessionService extends SessionRepository {
  static createSession(user: AppUser): Promise<Session> {
    const session = new Session(user);
    return this.saveSession(session);
  }

  static findById(id: string): Promise<Session | null> {
    return this.repository.findOneBy({ id });
  }
}
