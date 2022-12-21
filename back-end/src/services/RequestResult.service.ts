import RequestResult from "../entities/RequestResult.entity";
import RequestSetting from "../entities/RequestSetting.entity";
import User from "../entities/User.entity";
import RequestResultRepository from "../repositories/RequestResult.repository";

export default class RequestResultService extends RequestResultRepository {
  static async checkUrl(url: string): Promise<RequestResult> {
    const startTimer: number = Date.now();
    const dummyRequestSetting = new RequestSetting(new User("", "", "", ""), url, 0, false)
    try {
      const response = await fetch(new URL(url));
      return new RequestResult(
        dummyRequestSetting,
        response.status,
        Date.now() - startTimer
      );
    } catch (error) {
      return new RequestResult(
        dummyRequestSetting,
        404,
        Date.now() - startTimer
      );
    }
  }
}
