import { DataSource, EntityTarget } from "typeorm";

import { DATABASE_URL, NODE_ENV, TEST_DATABASE_URL } from "../config";
import AlertRepository from "../repositories/Alert.repository";
import AlertSettingRepository from "../repositories/AlertSetting.repository";
import PremiumRepository from "../repositories/Premium.repository";
import RequestResultRepository from "../repositories/RequestResult.repository";
import RequestSettingRepository from "../repositories/RequestSetting.repository";
import SessionRepository from "../repositories/Session.repository";
import UserRepository from "../repositories/User.repository";

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  entities: [
    __dirname + `/../entities/**/*.entity.${NODE_ENV === "test" ? "ts" : "js"}`,
  ],
  logging: NODE_ENV === "development" ? ["query", "error"] : ["error"],
});

let initialized = false;
export const getDatabase = async (): Promise<DataSource> => {
  if (!initialized) {
    await dataSource.initialize();
    initialized = true;
    console.log(
      `${
        NODE_ENV === "test"
          ? "Successfully connected to TEST database."
          : "Successfully connected to database."
      }`
    );
  }

  return dataSource;
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

export const closeConnection = async () => {
  await dataSource.destroy();
};

export const truncateAllTables = async () => {
  const database = await getDatabase();
  for (const entity of database.entityMetadatas) {
    const repository = database.getRepository(entity.name);
    await repository.query(
      `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`
    );
  }
};
