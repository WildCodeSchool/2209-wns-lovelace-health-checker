import RequestSetting from "../entities/RequestSetting.entity";
import {
  resendConfirmationEmail,
  sendConfirmationEmail,
  sendResetEmail,
  sendResetPasswordEmail,
} from "../services/nodemailer/nodemailer.service";
import RequestResultService from "../services/RequestResult/RequestResult.service";
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
    const requestSettingToCheck: RequestSetting =
      parsedMessage as RequestSetting;
    await RequestResultService.checkUrlOfRequestSetting(requestSettingToCheck);
    channel.ack(message);
  });
};
