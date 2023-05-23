import { AlertType } from "../entities/AlertSetting.entity";
import RequestResult from "../entities/RequestResult.entity";
import RequestSetting from "../entities/RequestSetting.entity";
import User from "../entities/User.entity";
import AlertService from "../services/Alert/Alert.service";
import AlertSettingService from "../services/AlertSetting/AlertSetting.service";
import {
  resendConfirmationEmail,
  sendAlertEmail,
  sendConfirmationEmail,
  sendResetEmail,
  sendResetPasswordEmail,
} from "../services/nodemailer/nodemailer.service";
import RequestResultService from "../services/RequestResult/RequestResult.service";
import RequestSettingService from "../services/RequestSetting/RequestSetting.service";
import UserService from "../services/User/User.service";
import { channel } from "./config";

export const onMessageOnAccountCreationEmailQueue = async () => {
  console.log(
    "Server is now listening for new messages on queue account-creation-email."
  );

  channel.consume("account-creation-email", (message: any) => {
    console.log("Start consuming message on queue account-creation-email.");

    let parsedMessage = JSON.parse(
      String.fromCharCode.apply(String, message.content)
    );

    console.log("Message parsed successfully.");

    if (parsedMessage.hasOwnProperty("isResent")) {
      resendConfirmationEmail(
        parsedMessage.firstname,
        parsedMessage.email,
        parsedMessage.confirmationToken
      );
    } else {
      sendConfirmationEmail(
        parsedMessage.firstname,
        parsedMessage.email,
        parsedMessage.confirmationToken
      );
    }

    console.log("Email sent successfully");
    console.log("Removing message from queue...");

    channel.ack(message);

    console.log("Message successfully removed from queue.");
  });
};

export const onMessageOnResetPasswordEmailQueue = async () => {
  channel.consume("reset-password-email", (message: any) => {
    console.log("Start consuming message on queue reset-password-email.");
    let parsedMessage = JSON.parse(
      String.fromCharCode.apply(String, message.content)
    );
    sendResetPasswordEmail(
      parsedMessage.firstname,
      parsedMessage.email,
      parsedMessage.resetPasswordToken
    );
    channel.ack(message);
  });
};

export const onMessageOnResetEmailQueue = async () => {
  channel.consume("reset-email", (message: any) => {
    console.log("Start consuming message on queue reset-email.");
    let parsedMessage = JSON.parse(
      String.fromCharCode.apply(String, message.content)
    );
    sendResetEmail(
      parsedMessage.firstname,
      parsedMessage.email,
      parsedMessage.resetEmailToken
    );
    channel.ack(message);
  });
};

export const onMessageOnAutomatedRequestQueue = async () => {
  channel.consume("automated-request", async (message: any) => {
    console.log("Start consuming message on queue automated-request.");
    let parsedMessage = JSON.parse(
      String.fromCharCode.apply(String, message.content)
    );
    await RequestResultService.checkUrlOfAutomatedRequest(parsedMessage);
    channel.ack(message);
  });
};

export const onMessageOnAlertEmailQueue = async () => {
  channel.consume("alert-email", async (message: any) => {
    console.log("Start consuming message on queue alert-email.");
    let parsedMessage = JSON.parse(
      String.fromCharCode.apply(String, message.content)
    );
    const toCheckForExistanceRequestResult = parsedMessage as RequestResult;
    const requestResult: RequestResult | null =
      await RequestResultService.getRequestResultById(
        toCheckForExistanceRequestResult.id
      );
    if (requestResult && requestResult.statusCode) {
      const requestSetting: RequestSetting | null =
        await RequestSettingService.getRequestSettingById(
          toCheckForExistanceRequestResult.requestSetting.id
        );
      if (requestSetting) {
        const user: User | null = await UserService.getUserById(
          requestSetting.user.id
        );
        let PREVENT_ALERT_DELAY: number | undefined;
        if (!isNaN(Number(process.env.PREVENT_ALERT_DELAY))) {
          PREVENT_ALERT_DELAY = Number(process.env.PREVENT_ALERT_DELAY);
        }
        const thirtyMinutesLaterDate = new Date(
          new Date().getTime() +
            (PREVENT_ALERT_DELAY ? PREVENT_ALERT_DELAY : 30 * 60 * 1000)
        );
        if (user) {
          sendAlertEmail(
            user.firstname,
            user.email,
            requestSetting.url,
            requestResult.statusCode,
            requestResult.createdAt.toUTCString(),
            thirtyMinutesLaterDate.toUTCString()
          );
          const alert = await AlertService.findAlertByRequestResultId(
            requestResult.id
          );
          if (alert) {
            alert.emailSentAt = new Date();
            alert.isEmailSent = true;
            await AlertService.updateAlert(alert);
            AlertSettingService.updatePreventAlertDateByType(
              thirtyMinutesLaterDate,
              requestSetting,
              AlertType.EMAIL,
              requestResult.statusCode
            );
          }
        }
      }
    }
    channel.ack(message);
  });
};

export const onMessageOnAlertPushQueue = async () => {
  channel.consume("alert-push", async (message: any) => {
    console.log("Start consuming message on queue alert-push.");
    let parsedMessage = JSON.parse(
      String.fromCharCode.apply(String, message.content)
    );
    // TODO: Handle push notifications / refactor with onMessageOnAlertEmailQueue()
    channel.ack(message);
  });
};
