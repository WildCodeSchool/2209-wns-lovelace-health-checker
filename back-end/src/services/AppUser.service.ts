import { compareSync, hashSync } from 'bcryptjs';

import AppUser from '../entities/AppUser.entity';
import Session from '../entities/Session.entity';
import AppUserRepository from '../repositories/AppUser.repository';
import SessionRepository from './Session.service';

export default class AppUserService extends AppUserRepository {
  static createUser(
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string
  ): Promise<AppUser> {
    const user = new AppUser(
      firstName,
      lastName,
      emailAddress,
      hashSync(password)
    );
    return this.saveUser(user);
  }

  static async signIn(
    emailAddress: string,
    password: string
  ): Promise<{ user: AppUser; session: Session }> {
    const user = await this.findByEmailAddress(emailAddress);

    if (!user || !compareSync(password, user.hashedPassword)) {
      throw new Error("Identifiants incorrects.");
    }
    const session = await SessionRepository.createSession(user);
    return { user, session };
  }

  static async findBySessionId(sessionId: string): Promise<AppUser | null> {
    const session = await SessionRepository.findById(sessionId);
    if (!session) {
      return null;
    }
    return session.user;
  }
}
