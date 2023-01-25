import RequestResult from "../entities/RequestResult.entity";
import RequestSetting from "../entities/RequestSetting.entity";
import User from "../entities/User.entity";
import RequestResultRepository from "../repositories/RequestResult.repository";

export default class RequestResultService extends RequestResultRepository {
  private static async fetchWithTimeout(
    resource: URL,
    timeout: number
  ): Promise<Response> {
    const options = { timeout };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  }

  public static async checkUrl(
    url: string,
    // TODO : variabiliser timeout dans un fichier de config
    timeout: number = 15000 
  ): Promise<RequestResult> {
    const startTimer: number = Date.now();
    const dummyRequestSetting = new RequestSetting(
      new User("", "", "", ""),
      url,
      0,
      false
    );
    try {
      const response = await this.fetchWithTimeout(new URL(url), timeout);

      return new RequestResult(
        dummyRequestSetting,
        response.status,
        Date.now() - startTimer
      );
    } catch (error) {
      if (error instanceof DOMException && error.name) {
        switch (error.name) {
          case "AbortError":
            // TODO : variabiliser ce message d'erreur
            throw Error("Request Timeout");
        }
      }
      if (error instanceof TypeError && error.message) {
        switch (error.message) {
          case "fetch failed":
            // TODO : variabiliser ce message d'erreur
            throw Error("Fetch Failed");
          case "Invalid URL":
            // TODO : variabiliser ce message d'erreur
            throw Error("Invalid URL");
        }
      }
      throw Error("Unkwown Error");
    }
  }
}
