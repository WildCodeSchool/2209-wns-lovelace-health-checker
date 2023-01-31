import RequestSetting, { Frequency } from "../entities/RequestSetting.entity";
import User from "../entities/User.entity";
import RequestSettingRepository from "../repositories/RequestSetting.repository";

export default class RequestSettingService extends RequestSettingRepository {
  static async createRequestSetting(
    user: User,
    url: string,
    frequency: Frequency,
    name?: string,
    headers?: string
  ): Promise<RequestSetting> {
    // Vérifier si l'utilisateur est Premium
    // S'il ne l'est pas, vérifier s'il n'a pas déjà 20 requêtes
    // S'il a déjà 20 requêtes, renvoyez une erreur

    // Vérifier si le name ou l'url existe déjà pour cet utilisateur
    // Renvoyer un message d'erreur si c'est le cas

    let requestSetting: RequestSetting = new RequestSetting(
      user,
      url,
      frequency,
      name,
      headers
    );
    const savedRequestSetting = await this.saveRequestSetting(requestSetting);
    return savedRequestSetting;
  }

  static async saveUpdatedRequestSetting(requestSetting: RequestSetting) {
    return await this.saveRequestSetting(requestSetting);
  }
}
