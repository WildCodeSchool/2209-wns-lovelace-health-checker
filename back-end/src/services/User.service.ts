import { compareSync, hashSync } from 'bcryptjs';

import Session from '../entities/Session.entity';
import User from '../entities/User.entity';
import UserRepository from '../repositories/User.repository';
import SessionRepository from './Session.service';

export default class UserService extends UserRepository {
  static createUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<User> {
    const user = new User(firstname, lastname, email, hashSync(password));
    return this.saveUser(user);
  }

  static async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; session: Session }> {
    const user = await this.findByEmail(email);

    if (!user || !compareSync(password, user.password)) {
      throw new Error("Identifiants incorrects.");
    }
    const session = await SessionRepository.createSession(user);
    return { user, session };
  }

  static async findBySessionId(sessionId: string): Promise<User | null> {
    const session = await SessionRepository.findById(sessionId);
    if (!session) {
      return null;
    }
    return session.user;
  }
}
