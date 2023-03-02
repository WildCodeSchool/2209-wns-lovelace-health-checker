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

export const sendMessageOnAutomatedRequestQueue = async (data: any) => {
  await channel.sendToQueue("automated-request", Buffer.from(JSON.stringify(data)));
  console.log("A new message was sent to 'automated-request' queue");
};
