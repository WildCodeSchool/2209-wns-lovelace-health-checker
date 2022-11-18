import { DataSource, EntityTarget } from 'typeorm';

import SessionRepository from '../repositories/Session.repository';
import AppUserRepository from '../services/AppUser.service';

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  entities: [__dirname + "/../entities/**/*.entity.js"],
  logging: ["query", "error"],
});

export const getDatabase = async (): Promise<void> => {
  await dataSource.initialize();
  console.log("Successfully connected to database.");
};

export const getRepository = async (entity: EntityTarget<any>) => {
  return dataSource.getRepository(entity);
};

export const initializeRepositories = async () => {
  await AppUserRepository.initializeRepository();
  await SessionRepository.initializeRepository();
};
