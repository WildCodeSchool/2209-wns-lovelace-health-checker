import RequestResult from "../../entities/RequestResult.entity";
import RequestSetting from "../../entities/RequestSetting.entity";
import User from "../../entities/User.entity";
import RequestResultRepository from "../../repositories/RequestResult.repository";
import RequestSettingService from "../RequestSetting/RequestSetting.service";

export default class RequestResultService extends RequestResultRepository {
  private static checkUrl = async (
    requestSetting: RequestSetting,
    isHomepageRequest: boolean = true
  ) => {
    try {
      const startTimer: number = Date.now();
      let response;
      if (isHomepageRequest) {
        response = await this.fetchWithTimeout(new URL(requestSetting.url));
      } else {
        response = await fetch(requestSetting.url);
      }
      return new RequestResult(
        requestSetting,
        response.status,
        Date.now() - startTimer
      );
    } catch (error) {
      if (error instanceof DOMException && error.name) {
        // This is only for homepage request
        switch (error.name) {
          case "AbortError":
            throw Error("Request Timeout");
        }
      } else if (error instanceof TypeError && error.message) {
        switch (error.message) {
          case "fetch failed":
            if (isHomepageRequest) {
              // will be handled by web-app
              throw Error("Fetch Failed");
            } else {
              // will be sent to be saved in db with no status code nor duration
              return new RequestResult(requestSetting);
            }
          // It sould never reach this case since url is valided beforehand
          case "Invalid URL":
            throw Error("Invalid URL");
        }
      }
      throw error;
    }
  };

  private static fetchWithTimeout = async (
    url: URL,
    timeout: number = process.env.REQUEST_TIMEOUT
      ? parseInt(process.env.REQUEST_TIMEOUT)
      : 15000
  ): Promise<Response> => {
    const options = { timeout };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  };

  public static checkUrlForHomepage = async (
    url: string
  ): Promise<RequestResult> => {
    const dummyRequestSetting = new RequestSetting(
      new User("", "", "", ""),
      url,
      0,
      false
    );
    return await this.checkUrl(dummyRequestSetting, true);
  };

  public static checkUrlOfRequestSetting = async (
    requestSetting: RequestSetting
  ): Promise<void> => {
    try {
      if (!!RequestSettingService.getRequestSettingById(requestSetting.id)) {
        const requestResultToSave: RequestResult = await this.checkUrl(
          requestSetting,
          false
        );
        RequestResultRepository.saveRequestResult(requestResultToSave);
      }
    } catch (error) {
      throw error;
    }
  };
}
