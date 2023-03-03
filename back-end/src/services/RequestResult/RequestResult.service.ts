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
      let response;
      const startTimer: number = Date.now();
      if (isHomepageRequest) {
        response = await this.fetchWithOptions(new URL(requestSetting.url));
      } else {
        // Is not a homepage request so timeout is set to 0 to deactivate it
        response = await this.fetchWithOptions(
          new URL(requestSetting.url),
          0,
          requestSetting.headers
        );
      }
      const endTimer: number = Date.now();
      return new RequestResult(
        requestSetting,
        requestSetting.url,
        requestSetting.headers,
        response.status,
        endTimer - startTimer
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
              // Will be handled by web-app
              throw Error("Fetch Failed");
            } else {
              // Will be sent to be saved in db with no status code nor duration
              return new RequestResult(
                requestSetting,
                requestSetting.url,
                requestSetting.headers,
                undefined,
                undefined
              );
            }
          // It sould never reach this case since url is valided beforehand
          case "Invalid URL":
            throw Error("Invalid URL");
        }
      }
      throw error;
    }
  };

  private static fetchWithOptions = async (
    url: URL,
    timeout: number = process.env.REQUEST_TIMEOUT
      ? parseInt(process.env.REQUEST_TIMEOUT)
      : 15000,
    headers?: any
  ): Promise<Response> => {
    let response;
    // Timeout is for homepage request
    if (timeout) {
      const options = { timeout };
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
    } else if (headers) {
      // TODO: ajouter les headers
      response = await fetch(url);
    } else {
      response = await fetch(url);
    }
    return response;
  };

  // Rabbit comnsumers will use this method
  public static checkUrlOfAutomatedRequest = async (
    requestSettingFromMessage: RequestSetting
  ): Promise<void> => {
    this.checkUrlOfRequestSettingByRequestSetting(requestSettingFromMessage);
  };

  public static checkUrlOfRequestSettingByRequestSetting = async (
    requestSetting: RequestSetting
  ): Promise<RequestResult> => {
    // Not a homepage request so add false
    const requestResultToSave: RequestResult = await this.checkUrl(
      requestSetting,
      false
    );
    return await RequestResultRepository.saveRequestResult(requestResultToSave);
  };

  public static checkUrlForHomepage = async (
    url: string
  ): Promise<RequestResult> => {
    const dummyRequestSetting = new RequestSetting(
      new User("", "", "", ""),
      url,
      0,
      true
    );
    // Is homepage request : true
    // Send the result to web-app (front-end)
    return await this.checkUrl(dummyRequestSetting, true);
  };
}
