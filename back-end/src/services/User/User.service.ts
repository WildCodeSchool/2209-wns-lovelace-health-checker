import { ExpressContext } from "apollo-server-express";
import { compareSync, hashSync } from "bcryptjs";
import { randomBytes } from "crypto";

import Session from "../../entities/Session.entity";
import User, { Status } from "../../entities/User.entity";
import {
  sendMessageOnAccountCreationEmailQueue,
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
    const user = new User(firstname, lastname, email, hashSync(password));

    const userWithDesiredEmail = await UserRepository.findByEmail(email);
    if (userWithDesiredEmail) throw Error("This email is already used");

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

  static buildResetPasswordMessageToQueue = (user: User) => {
    const message = {
      firstname: user.firstname,
      email: user.email,
      resetPasswordToken: user.resetPasswordToken,
    };
    sendMessageOnResetPasswordEmailQueue(message);
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
    user.accountConfirmationToken = "";
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
}