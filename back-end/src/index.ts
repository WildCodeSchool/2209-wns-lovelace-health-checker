import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { getDatabase, initializeRepositories } from "./database/utils";
import { getSessionIdInCookie } from "./utils/http-cookies";
import { connectionToRabbitMQ } from "./rabbitmq/config";
import RequestResultResolver from "./resolvers/RequestResult/RequestResult.resolver";
import UserResolver from "./resolvers/User/User.resolver";

import RequestSettingResolver from "./resolvers/RequestSetting/RequestSetting.resolver";
import UserService from "./services/User/User.service";

import { startCrons } from "./services/cron/cron.service";
import PremiumResolver from "./resolvers/Premium/Premium.resolver";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import User from "./entities/User.entity";
import { Request, Response } from "express";

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
  sessionId: string;
}

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        RequestResultResolver,
        RequestSettingResolver,
        PremiumResolver,
      ],
      authChecker: async ({ context }) => {
        return Boolean(context.user);
      },
    }),
    csrfPrevention: true,
    cache: "bounded",
  });

  // The `listen` method launches a web server.
  const port = (process.env.SERVER_PORT as unknown as number) || 4000;
  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      const sessionId = getSessionIdInCookie(req.headers.cookie);
      const user = !sessionId
        ? null
        : await UserService.findBySessionId(sessionId);

      return { req, res, user, sessionId };
    },
    listen: { port: port },
  });
  await initializeRepositories();
  await getDatabase();
  await connectionToRabbitMQ();

  console.log(`🚀  Server ready at ${url}`);

  startCrons();
  console.log("cron are started");
};

startServer();
