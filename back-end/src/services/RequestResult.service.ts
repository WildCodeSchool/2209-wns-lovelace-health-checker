import { HomepageRequestResult } from '../models/requestResult.model';
import RequestResultRepository from '../repositories/RequestResult.repository';

export default class RequestResultService extends RequestResultRepository {
  static checkUrl(url: string): HomepageRequestResult {
    setTimeout(() => {}, 3000);
    let isAvailable: boolean;
    let statusCode: number;
    let duration: number;
    if (Math.floor(Math.random() * 2) == 0) {
      isAvailable = true;
      statusCode = 200;
    } else {
      isAvailable = false;
      statusCode = 404;
    }
    duration = Math.floor(Math.random() * 9001);

    const homepageRequestResult: HomepageRequestResult = {
      isAvailable,
      statusCode,
      duration,
    };
    return homepageRequestResult;
  }
}
