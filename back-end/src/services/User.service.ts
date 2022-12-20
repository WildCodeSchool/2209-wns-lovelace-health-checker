import { compareSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';

import Session from '../entities/Session.entity';
import User, { Status } from '../entities/User.entity';
import { sendMessageOnAccountCreationEmailQueue, sendMessageOnResetPasswordEmailQueue } from '../rabbitmq/providers';
import UserRepository from '../repositories/User.repository';
import SessionRepository from './Session.service';

export default class UserService extends UserRepository {
  static async createUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<User> {
    const user = new User(firstname, lastname, email, hashSync(password));
    user.accountConfirmationToken = randomBytes(32).toString("hex");

    if (!user.accountConfirmationToken)
      new Error("Account confirmation token could not be created.");
    const savedUser = await this.saveUser(user);
    const message = {
      firstname: user.firstname,
      email: user.email,
      confirmationToken: user.accountConfirmationToken,
    };
    sendMessageOnAccountCreationEmailQueue(message);
    return savedUser;
  }

  static resendAccountConfirmationToken = async (email: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw Error("L'utilisateur n'a pas pu être récupéré");
    if (
      (user.status == Status.ACTIVE && user.accountConfirmationToken == null) ||
      user.accountConfirmationToken == ""
    )
      throw new Error("Votre compte est déjà actif");
    const message = {
      firstname: user.firstname,
      email: user.email,
      confirmationToken: user.accountConfirmationToken,
      isResent: true,
    };

    sendMessageOnAccountCreationEmailQueue(message);
    return "Votre demande a bien été prise en compte";
  };

  static confirmAccount = async (confirmationToken: string) => {
    const user = await this.getUserByAccountConfirmationToken(
      confirmationToken
    );
    if (!user) throw Error("Impossible de récupérer l'utilisateur");

    if (user.status === Status.ACTIVE || user.status === Status.INACTIVE) {
      throw Error("Le code de confirmation n'est plus valide");
    }

    if (user.accountConfirmationToken !== confirmationToken) {
      throw Error("Le code de confirmation n'est pas valide");
    }

    user.status = Status.ACTIVE;
    user.accountConfirmationToken = "";
    await this.saveUser(user);
    return "Votre compte a bien été confirmé";
  };

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

  static askForNewPassword = async (email: string) => {
    const user = await this.findByEmail(email);
    if (!user) throw Error("L'email n'a pas pu être récupéré");

    user.resetPasswordToken = randomBytes(16).toString("hex");
    await this.saveUser(user);

    const message = {
      firstname: user.firstname,
      email: user.email,
      resetPasswordToken: user.resetPasswordToken,
    };

    sendMessageOnResetPasswordEmailQueue(message);
  };
}
