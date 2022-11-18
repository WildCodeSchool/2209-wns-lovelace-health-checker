import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';

import { getDatabase, initializeRepositories } from './database/utils';
import AppUser from './entities/AppUser.entity';
import { getSessionIdInCookie } from './http-utils';
import AppUserResolver from './resolvers/AppUser/AppUser.resolver';
import AppUserRepository from './services/AppUser.service';

export type GlobalContext = ExpressContext & {
  user: AppUser | null;
};

dotenv.config();

const startServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AppUserResolver],
      authChecker: async ({ context }) => {
        return Boolean(context.user);
      },
    }),
    context: async (context): Promise<GlobalContext> => {
      const sessionId = getSessionIdInCookie(context);
      const user = !sessionId
        ? null
        : await AppUserRepository.findBySessionId(sessionId);

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

  console.log(`🚀  Server ready at ${url}`);
};

startServer();
