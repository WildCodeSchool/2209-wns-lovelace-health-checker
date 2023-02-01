import "reflect-metadata";

import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { ExpressContext } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { getDatabase, initializeRepositories } from "./database/utils";
import User from "./entities/User.entity";
import { getSessionIdInCookie } from "./utils/http-cookies";
import { connectionToRabbitMQ } from "./rabbitmq/config";
import RequestResultResolver from "./resolvers/RequestResult/RequestResult.resolver";
import UserResolver from "./resolvers/User/User.resolver";

import RequestSettingResolver from "./resolvers/RequestSetting/RequestSetting.resolver";
import UserService from "./services/User/User.service";

export type GlobalContext = ExpressContext & {
  user: User | null;
};

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, RequestResultResolver, RequestSettingResolver],
      authChecker: async ({ context }) => {
        return Boolean(context.user);
      },
    }),
    context: async (context): Promise<GlobalContext> => {
      const sessionId = getSessionIdInCookie(context);
      const user = !sessionId
        ? null
        : await UserService.findBySessionId(sessionId);

      return { res: context.res, req: context.req, user };
    },
    csrfPrevention: true,
    cache: "bounded",
    /**
     * What's up with this embed: true option?
     * These are our recommended settings for using AS;
     * they aren't the defaults in AS3 for backwards-compatibility reasons but
     * will be the defaults in AS4. For production environments, use
     * ApolloServerPluginLandingPageProductionDefault instead.
     **/
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  // The `listen` method launches a web server.
  const port = process.env.SERVER_PORT || 4000;
  const { url } = await server.listen({ port: port });
  await initializeRepositories();
  await getDatabase();
  await connectionToRabbitMQ();

  console.log(`🚀  Server ready at ${url}`);
};

startServer();
