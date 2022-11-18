import { channel } from './config';

export const sendMessageOnAccountCrationEmailQueue = async (data: any) => {
  await channel.sendToQueue(
    "account-creation-email",
    Buffer.from(JSON.stringify(data))
  );
  console.log("A new message was sent to 'account-creation-queue'");
};

export const sendMessageOnResetPasswordEmailQueue = async (data: any) => {
  await channel.sendToQueue(
    "reset-password-email",
    Buffer.from(JSON.stringify(data))
  );
  console.log("A new message was sent to 'reset-password-queue'");
};
