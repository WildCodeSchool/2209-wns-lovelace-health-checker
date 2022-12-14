import { DataSource, EntityTarget } from 'typeorm';

import AlertRepository from '../repositories/Alert.repository';
import AlertSettingRepository from '../repositories/AlertSetting.repository';
import PremiumRepository from '../repositories/Premium.repository';
import RequestResultRepository from '../repositories/RequestResult.repository';
import RequestSettingRepository from '../repositories/RequestSetting.repository';
import SessionRepository from '../repositories/Session.repository';
import UserRepository from '../repositories/User.repository';

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
  await UserRepository.initializeRepository();
  await SessionRepository.initializeRepository();
  await PremiumRepository.initializeRepository();
  await RequestSettingRepository.initializeRepository();
  await AlertSettingRepository.initializeRepository();
  await RequestResultRepository.initializeRepository();
  await AlertRepository.initializeRepository();
};
