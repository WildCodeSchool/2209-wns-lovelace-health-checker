import amqp = require("amqplib");

import {
  onMessageOnAccountCreationEmailQueue,
  onMessageOnAlertEmailQueue,
  onMessageOnAlertPushQueue,
  onMessageOnAutomatedRequestQueue,
  onMessageOnResetEmailQueue,
  onMessageOnResetPasswordEmailQueue,
} from "./consumers";

export let channel: any;
export let connection: any;

export const connectionToRabbitMQ = async () => {
  try {
    console.log("Try to connect to RabbitMQ...");
    connection = await amqp.connect(process.env.RABBIT_AMQP_URL as string);
    channel = await connection.createChannel();
    await channel.assertQueue("account-creation-email");
    await channel.assertQueue("reset-password-email");
    await channel.assertQueue("reset-email");
    await channel.assertQueue("automated-request");
    await channel.assertQueue("alert-email");
    await channel.assertQueue("alert-push");
    console.log("Successfully connected to RabbitMQ.");
    onMessageOnAccountCreationEmailQueue();
    onMessageOnResetPasswordEmailQueue();
    onMessageOnResetEmailQueue();
    onMessageOnAutomatedRequestQueue();
    onMessageOnAlertEmailQueue();
    onMessageOnAlertPushQueue();
  } catch (error) {
    console.log(error);
  }
};
