import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { getDatabase, initializeRepositories } from "./database/utils";
import { getSessionIdInCookie } from "./utils/http-cookies";
import { connectionToRabbitMQ } from "./rabbitmq/config";

import UserService from "./services/User/User.service";
import { startCrons } from "./services/cron/cron.service";
import RequestSettingResolver from "./resolvers/RequestSetting/RequestSetting.resolver";
import RequestResultResolver from "./resolvers/RequestResult/RequestResult.resolver";
import UserResolver from "./resolvers/User/User.resolver";

import PremiumResolver from "./resolvers/Premium/Premium.resolver";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import User from "./entities/User.entity";
import { Request, Response } from "express";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { json } from "body-parser";
import http from "http";
import bodyParser from "body-parser";
import { Stripe } from "stripe";

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
  sessionId: string;
}

const app = express();
const port = (process.env.SERVER_PORT as unknown as number) || 4000;
const httpServer = http.createServer(app);

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        RequestResultResolver,
        RequestSettingResolver,
        PremiumResolver,
      ],
      authChecker: async ({ context }: { context: Context }) => {
        return Boolean(context.user);
      },
    }),
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  await initializeRepositories();
  await getDatabase();
  await connectionToRabbitMQ();
  startCrons();
  console.log("cron are started");

  const graphqlEndpoint = "/api";

  app.use(
    graphqlEndpoint,
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const sessionId = getSessionIdInCookie(req.headers.cookie);
        const user = !sessionId
          ? null
          : await UserService.findBySessionId(sessionId);

        return { req, res, user, sessionId };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: port }, resolve)
  );
  console.log(`🚀 Express Server ready at http://localhost:${port}/`);
  console.log(
    `🚀 GraphQL Server ready at http://localhost:${port}${graphqlEndpoint}`
  );
};

startServer();

app.get("/test", (req, res) => {
  res.send("It works");
});

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (request, response) => {
    console.log("passed");
    let event = request.body;
    console.log(event);
    console.log(endpointSecret);
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature as string,
          endpointSecret
        );
        console.log(event);
      } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.status(200).end();
  }
);
