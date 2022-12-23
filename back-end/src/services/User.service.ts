import { ExpressContext } from 'apollo-server-express';
import { compareSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';

import Session from '../entities/Session.entity';
import User, { Status } from '../entities/User.entity';
import { getSessionIdInCookie } from '../http-utils';
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

    const userWithDesiredEmail = await UserRepository.findByEmail(email);
    if (userWithDesiredEmail) throw Error("This email is already used");

    user.accountConfirmationToken = randomBytes(32).toString("hex");
    user.accountConfirmationTokenCreatedAt = new Date();
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
    if (!user) throw Error("User not found");
    if (
      (user.status == Status.ACTIVE && user.accountConfirmationToken == null) ||
      user.accountConfirmationToken == ""
    )
      throw new Error("Account already active");
    const message = {
      firstname: user.firstname,
      email: user.email,
      confirmationToken: user.accountConfirmationToken,
      isResent: true,
    };

    sendMessageOnAccountCreationEmailQueue(message);
    return "Your request has been processed successfully";
  };

  static confirmAccount = async (confirmationToken: string) => {
    const user = await this.getUserByAccountConfirmationToken(
      confirmationToken
    );
    if (!user) throw Error("Invalid confirmation token");

    user.status = Status.ACTIVE;
    user.accountConfirmationToken = "";
    await this.saveUser(user);
    return "Your account has been confirmed";
  };

  static async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; session: Session }> {
    const user = await this.findByEmail(email);

    if (!user || !compareSync(password, user.password)) {
      throw new Error("Incorrect credentials");
    }

    if (user.status === Status.PENDING || user.status === Status.INACTIVE) {
      throw new Error(
        "Your account is not active, click on the link in your email to activate it"
      );
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
    if (!user) throw Error("Email not found");

    user.resetPasswordToken = randomBytes(16).toString("hex");
    user.resetPasswordTokenCreatedAt = new Date();
    await this.saveUser(user);

    const message = {
      firstname: user.firstname,
      email: user.email,
      resetPasswordToken: user.resetPasswordToken,
    };

    sendMessageOnResetPasswordEmailQueue(message);
  };

  static resetPassword = async (
    password: string,
    resetPasswordToken: string
  ) => {
    const user = await this.getUserByResetPasswordToken(resetPasswordToken);
    if (!user) throw Error("Token is no longer valid");

    user.password = hashSync(password);
    user.resetPasswordToken = "";
    user.updatedAt = new Date();

    await this.saveUser(user);
  };

  static logout = async (context: ExpressContext) => {
    const sessionId = getSessionIdInCookie(context);
    if (!sessionId) throw new Error("You're not signed in");
    await SessionRepository.deleteSessionById(sessionId);
  };
}
