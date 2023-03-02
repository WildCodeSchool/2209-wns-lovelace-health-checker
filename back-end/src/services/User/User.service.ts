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

export default class UserService extends UserRepository {
  static async createUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<User> {
    const userWithDesiredEmail = await UserRepository.findByEmail(email);
    if (userWithDesiredEmail) throw Error("This email is already used");

    const user = new User(firstname, lastname, email, hashSync(password));

    const usersWithSameEmail = await this.getAllByEmailAwaitingConfirmation(
      email
    );
    if (usersWithSameEmail.length) {
      for (const user of usersWithSameEmail) {
        user.emailAwaitingConfirmation = null;
        user.confirmationEmailToken = null;
        user.confirmationEmailCreatedAt = null;
        await this.saveUser(user);
      }
    }

    user.accountConfirmationToken = randomBytes(32).toString("hex");
    user.accountConfirmationTokenCreatedAt = new Date();
    const savedUser = await this.saveUser(user);
    this.buildAccountConfirmationMessageToQueue(user);
    return savedUser;
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
    if (!user) throw Error("User not found");
    if (
      (user.status == Status.ACTIVE && user.accountConfirmationToken == null) ||
      (user.status == Status.ACTIVE && user.accountConfirmationToken == "") ||
      user.status == Status.ACTIVE ||
      user.status == Status.INACTIVE
    )
      throw new Error("Account already active");
    this.buildAccountConfirmationMessageToQueue(user, true);
    return "Your request has been processed successfully";
  };

  static confirmAccount = async (confirmationToken: string) => {
    const user = await this.getUserByAccountConfirmationToken(
      confirmationToken
    );
    if (!user) throw Error("Invalid confirmation token");

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
      throw new Error("Incorrect credentials");
    }

    if (user.status === Status.PENDING || user.status === Status.INACTIVE) {
      throw new Error(
        "Your account is not active, click on the link in your email to activate it"
      );
    }

    const session = await SessionService.createSession(user);
    return { user, session };
  }

  static askForNewPassword = async (email: string): Promise<string> => {
    const user = await this.findByEmail(email);
    if (!user)
      return "If this email address exists, you'll receive an email to regenerate your password. Check your inbox.";

    user.resetPasswordToken = randomBytes(32).toString("hex");
    user.resetPasswordTokenCreatedAt = new Date();
    await this.saveUser(user);
    this.buildResetPasswordMessageToQueue(user);
    return "If this email address exists, you'll receive an email to regenerate your password. Check your inbox.";
  };

  static resetPassword = async (
    password: string,
    resetPasswordToken: string
  ) => {
    const user = await this.getUserByResetPasswordToken(resetPasswordToken);
    if (!user) throw Error("Your reset password token is no longer valid");

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
    if (!sessionId) throw new Error("You're not signed in");
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
      throw new Error("Incorrect current password");
    }
    user.password = hashSync(newPassword);
    user.updatedAt = new Date();
    await this.saveUser(user);
    if (disconnectMe) {
      await SessionService.deleteAllSessionsButNotCurrentOne(user, sessionId);
      return "Your password has been updated successfully. You have been disconnected from all your other devices";
    }
    return "Your password has been updated successfully";
  };

  static updateUserEmail = async (user: User, email: string) => {
    const userWithDesiredEmail = await UserRepository.findByEmail(email);
    if (userWithDesiredEmail) throw Error("This email is already used");

    user.emailAwaitingConfirmation = email;
    user.confirmationEmailToken = randomBytes(32).toString("hex");
    user.confirmationEmailCreatedAt = new Date();
    const savedUser = await this.saveUser(user);
    this.buildResetEmailMessageToQueue(savedUser);
    return "Your request has been processed successfully. Please, check your inbox to confirm your email !";
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
    if (!user) throw Error("Invalid email confirmation token");
    if (!user.emailAwaitingConfirmation)
      throw Error("No email awaiting confirmation");
    const alreadyUsedEmail = await this.findByEmail(
      user.emailAwaitingConfirmation
    );
    if (alreadyUsedEmail) throw Error("This email is already used");

    user.email = user.emailAwaitingConfirmation;
    user.emailAwaitingConfirmation = null;
    user.confirmationEmailToken = null;
    user.confirmationEmailCreatedAt = null;
    user.updatedAt = new Date();
    const savedUser = await this.saveUser(user);

    const usersWithSameEmail = await this.getAllByEmailAwaitingConfirmation(
      savedUser.email
    );

    if (usersWithSameEmail.length) {
      for (const user of usersWithSameEmail) {
        user.emailAwaitingConfirmation = null;
        user.confirmationEmailToken = null;
        user.confirmationEmailCreatedAt = null;
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
      throw new Error("Incorrect current password");
    }
    await this.deleteUser(user);
    return true;
  };
}
