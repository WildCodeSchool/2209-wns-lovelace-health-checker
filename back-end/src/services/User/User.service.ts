import { ExpressContext } from "apollo-server-express";
import { compareSync, hashSync } from "bcryptjs";
import { randomBytes } from "crypto";

import Session from "../../entities/Session.entity";
import User, { Status } from "../../entities/User.entity";
import {
  sendMessageOnAccountCreationEmailQueue,
  sendMessageOnResetEmailQueue,
  sendMessageOnResetPasswordEmailQueue,
} from "../../rabbitmq/providers";
import UserRepository from "../../repositories/User.repository";
import { getSessionIdInCookie } from "../../utils/http-cookies";
import SessionService from "../Session/Session.service";
import {
  ACCOUNT_ALREADY_ACTIVE,
  ACCOUNT_NOT_ACTIVE,
  ACTION_DONE_SUCCESSFULLY,
  ACTION_DONE_SUCCESSFULLY_CHECK_INBOX,
  EMAIL_ALREADY_USED,
  IF_EMAIL_EXISTS_CHECK_INBOX,
  INCORRECT_CREDENTIALS,
  INCORRECT_CURRENT_PASSWORD,
  INVALID_CONFIRMATION_TOKEN,
  INVALID_EMAIL_CONFIRMATION_TOKEN,
  INVALID_RESET_PASSWORD_TOKEN,
  NO_EMAIL_AWAITING_CONFIRMATION,
  PASSWORD_CHANGE_SUCCESS,
  PASSWORD_CHANGE_SUCCESS_AND_DISCONNECTED,
  UNAUTHORIZED,
  USER_NOT_FOUND,
} from "../../utils/info-and-error-messages";

export default class UserService extends UserRepository {
  static async createUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<User> {
    const userWithDesiredEmail = await UserRepository.findByEmail(email);
    if (userWithDesiredEmail) throw Error(EMAIL_ALREADY_USED);

    const user = new User(firstname, lastname, email, hashSync(password));

    const usersWithSameEmail = await this.getAllByEmailAwaitingConfirmation(
      email
    );
    if (usersWithSameEmail.length) {
      for (const user of usersWithSameEmail) {
        user.emailAwaitingConfirmation = null;
        user.confirmationEmailToken = null;
        await this.saveUser(user);
      }
    }

    user.accountConfirmationToken = randomBytes(32).toString("hex");
    const savedUser = await this.saveUser(user);
    this.buildAccountConfirmationMessageToQueue(user);
    return savedUser;
  }

  public static getUserById(id: string) {
    return UserRepository.findById(id);
  }

  static buildAccountConfirmationMessageToQueue(
    user: User,
    isResent?: boolean
  ) {
    let message = {};
    if (isResent) {
      message = {
        firstname: user.firstname,
        email: user.email,
        confirmationToken: user.accountConfirmationToken,
        isResent: true,
      };
    } else {
      message = {
        firstname: user.firstname,
        email: user.email,
        confirmationToken: user.accountConfirmationToken,
      };
    }
    sendMessageOnAccountCreationEmailQueue(message);
    return message;
  }

  static buildResetPasswordMessageToQueue = async (user: User) => {
    const message = {
      firstname: user.firstname,
      email: user.email,
      resetPasswordToken: user.resetPasswordToken,
    };
    await sendMessageOnResetPasswordEmailQueue(message);
    return message;
  };

  static resendAccountConfirmationToken = async (email: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw Error(USER_NOT_FOUND);
    if (
      (user.status == Status.ACTIVE && user.accountConfirmationToken == null) ||
      (user.status == Status.ACTIVE && user.accountConfirmationToken == "") ||
      user.status == Status.ACTIVE ||
      user.status == Status.INACTIVE
    )
      throw new Error(ACCOUNT_ALREADY_ACTIVE);
    this.buildAccountConfirmationMessageToQueue(user, true);
    return ACTION_DONE_SUCCESSFULLY;
  };

  static confirmAccount = async (confirmationToken: string) => {
    const user = await this.getUserByAccountConfirmationToken(
      confirmationToken
    );
    if (!user) throw Error(INVALID_CONFIRMATION_TOKEN);

    user.status = Status.ACTIVE;
    user.accountConfirmationToken = null;
    await this.saveUser(user);
    return true;
  };

  static async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; session: Session }> {
    const user = await this.findByEmail(email);

    if (!user || !compareSync(password, user.password)) {
      throw new Error(INCORRECT_CREDENTIALS);
    }

    if (user.status === Status.PENDING || user.status === Status.INACTIVE) {
      throw new Error(ACCOUNT_NOT_ACTIVE);
    }

    const session = await SessionService.createSession(user);
    return { user, session };
  }

  static askForNewPassword = async (email: string): Promise<string> => {
    const user = await this.findByEmail(email);
    if (!user) return IF_EMAIL_EXISTS_CHECK_INBOX;

    user.resetPasswordToken = randomBytes(32).toString("hex");
    user.resetPasswordTokenCreatedAt = new Date();
    await this.saveUser(user);
    this.buildResetPasswordMessageToQueue(user);
    return IF_EMAIL_EXISTS_CHECK_INBOX;
  };

  static resetPassword = async (
    password: string,
    resetPasswordToken: string
  ) => {
    const user = await this.getUserByResetPasswordToken(resetPasswordToken);
    if (!user) throw Error(INVALID_RESET_PASSWORD_TOKEN);

    const resetPasswordTokenIsValid =
      this.checkIfResetPasswordTokenIsValid(user);

    if (!resetPasswordTokenIsValid)
      throw Error(
        `The ${
          parseInt(process.env.RESET_PASSWORD_EXPIRATION_DELAY!) / 60000
        } minute(s) time limit has been exceeded. Please make a new request`
      );

    user.password = hashSync(password);
    user.resetPasswordToken = "";
    user.updatedAt = new Date();

    await SessionService.deleteAllUserSessions(user);
    await this.saveUser(user);
  };

  static checkIfResetPasswordTokenIsValid = (user: User) => {
    const resetPasswordTokenExpirationDelay = parseInt(
      process.env.RESET_PASSWORD_EXPIRATION_DELAY!
    );

    const comparisonDate = new Date(
      user.resetPasswordTokenCreatedAt.getTime() +
        resetPasswordTokenExpirationDelay
    );

    if (new Date() > comparisonDate) {
      return false;
    } else {
      return true;
    }
  };

  static logout = async (context: ExpressContext) => {
    const sessionId = getSessionIdInCookie(context);
    if (!sessionId) throw new Error(UNAUTHORIZED);
    await SessionService.deleteSessionById(sessionId);
  };

  static updateUserIdentity = async (
    user: User,
    firstname?: string,
    lastname?: string
  ) => {
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    user.updatedAt = new Date();
    await this.saveUser(user);
    return user;
  };

  static updateUserPassword = async (
    user: User,
    currentPassword: string,
    newPassword: string,
    disconnectMe: boolean,
    sessionId: string
  ): Promise<string> => {
    if (!compareSync(currentPassword, user.password)) {
      throw new Error(INCORRECT_CURRENT_PASSWORD);
    }
    user.password = hashSync(newPassword);
    user.updatedAt = new Date();
    await this.saveUser(user);
    if (disconnectMe) {
      await SessionService.deleteAllSessionsButNotCurrentOne(user, sessionId);
      return PASSWORD_CHANGE_SUCCESS_AND_DISCONNECTED;
    }
    return PASSWORD_CHANGE_SUCCESS;
  };

  static updateUserEmail = async (user: User, email: string) => {
    const userWithDesiredEmail = await UserRepository.findByEmail(email);
    if (userWithDesiredEmail) throw Error(EMAIL_ALREADY_USED);

    user.emailAwaitingConfirmation = email;
    user.confirmationEmailToken = randomBytes(32).toString("hex");
    const savedUser = await this.saveUser(user);
    this.buildResetEmailMessageToQueue(savedUser);
    return ACTION_DONE_SUCCESSFULLY_CHECK_INBOX;
  };

  static buildResetEmailMessageToQueue = async (user: User) => {
    const message = {
      firstname: user.firstname,
      email: user.emailAwaitingConfirmation,
      resetEmailToken: user.confirmationEmailToken,
    };
    await sendMessageOnResetEmailQueue(message);
    return message;
  };

  static confirmEmail = async (confirmationEmailToken: string) => {
    const user = await this.getUserByConfirmationEmailToken(
      confirmationEmailToken
    );
    if (!user) throw Error(INVALID_EMAIL_CONFIRMATION_TOKEN);
    if (!user.emailAwaitingConfirmation)
      throw Error(NO_EMAIL_AWAITING_CONFIRMATION);
    const alreadyUsedEmail = await this.findByEmail(
      user.emailAwaitingConfirmation
    );
    if (alreadyUsedEmail) throw Error(EMAIL_ALREADY_USED);

    user.email = user.emailAwaitingConfirmation;
    user.emailAwaitingConfirmation = null;
    user.confirmationEmailToken = null;
    user.updatedAt = new Date();
    const savedUser = await this.saveUser(user);

    const usersWithSameEmail = await this.getAllByEmailAwaitingConfirmation(
      savedUser.email
    );

    if (usersWithSameEmail.length) {
      for (const user of usersWithSameEmail) {
        user.emailAwaitingConfirmation = null;
        user.confirmationEmailToken = null;
        await this.saveUser(user);
      }
    }
    return true;
  };

  static deleteCurrentUser = async (
    user: User,
    currentPassword: string
  ): Promise<Boolean> => {
    if (!compareSync(currentPassword, user.password)) {
      throw new Error(INCORRECT_CURRENT_PASSWORD);
    }
    await this.deleteUser(user);
    return true;
  };
}
