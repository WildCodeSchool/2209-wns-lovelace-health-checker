import RequestResultService from "./RequestResult.service";
import RequestResult from "../entities/RequestResult.entity";
import { closeConnection, initializeRepositories } from "../database/utils";

jest.mock("node-fetch", () =>
  jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
  )
);

describe("RequestResultService", () => {
  beforeAll(async () => {
    await initializeRepositories();
  });

  afterEach(async () => {
    await RequestResultService.clearRepository();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("checkUrl", () => {
    it("should return a RequestResult object with a 200 status code and the correct response time", async () => {
      const url = "https://jsonplaceholder.typicode.com/todos/1";
      const startTimer = Date.now();
      const requestResult = await RequestResultService.checkUrl(url);
      const endTimer = Date.now();

      expect(requestResult).toBeInstanceOf(RequestResult);
    //   expect(requestResult.statusCode).toEqual(200);
      expect(requestResult.duration).toEqual(endTimer - startTimer);
    });

    it("should throw an error if the URL is invalid - no protocol", async () => {
      const url = "www.youtube.com";
      await expect(RequestResultService.checkUrl(url)).rejects.toThrowError(
        "Fetch Failed"
      );
    });

    it("should throw an error if the URL is invalid - wrong suffix", async () => {
      const url = "https://www.youtube.";
      await expect(RequestResultService.checkUrl(url)).rejects.toThrowError(
        "Fetch Failed"
      );
    });

    it("should throw an error if the request times out", async () => {
      const url = "https://jsonplaceholder.typicode.com/todos/1";
      await expect(RequestResultService.checkUrl(url, 0)).rejects.toThrowError(
        "Request Timeout"
      );
    });
  });
});
