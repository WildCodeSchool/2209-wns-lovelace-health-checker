import RequestResult from "../entities/RequestResult.entity";
import RequestSetting from "../entities/RequestSetting.entity";
import { channel } from "./config";

export const sendMessageOnAccountCreationEmailQueue = async (data: any) => {
  await channel.sendToQueue(
    "account-creation-email",
    Buffer.from(JSON.stringify(data))
  );
  console.log("A new message was sent to 'account-creation' queue");
};

export const sendMessageOnResetPasswordEmailQueue = async (data: any) => {
  await channel.sendToQueue(
    "reset-password-email",
    Buffer.from(JSON.stringify(data))
  );
  console.log("A new message was sent to 'reset-password' queue");
};

export const sendMessageOnResetEmailQueue = async (data: any) => {
  await channel.sendToQueue("reset-email", Buffer.from(JSON.stringify(data)));
  console.log("A new message was sent to 'reset-email' queue");
};

export const sendMessageOnAutomatedRequestQueue = async (data: RequestSetting) => {
  await channel.sendToQueue("automated-request", Buffer.from(JSON.stringify(data)));
};

export const sendMessageOnAlertEmailQueue = async (data: RequestResult) => {
  await channel.sendToQueue("alert-email", Buffer.from(JSON.stringify(data)));
};

export const sendMessageOnAlertPushQueue = async (data: RequestResult) => {
  await channel.sendToQueue("alert-push", Buffer.from(JSON.stringify(data)));
};
