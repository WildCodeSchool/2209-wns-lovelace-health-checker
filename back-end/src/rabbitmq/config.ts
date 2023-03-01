import amqp = require("amqplib");

import {
  onMessageOnAccountCreationEmailQueue,
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
    console.log("Successfully connected to RabbitMQ.");
    onMessageOnAccountCreationEmailQueue();
    onMessageOnResetPasswordEmailQueue();
    onMessageOnResetEmailQueue();
  } catch (error) {
    console.log(error);
  }
};
