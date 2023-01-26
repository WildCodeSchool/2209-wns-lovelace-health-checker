import RequestResultService from "./RequestResult.service";
import RequestResult from "../entities/RequestResult.entity";
import { closeConnection, initializeRepositories } from "../database/utils";

// jest.mock("node-fetch", () =>
//   jest.fn(() =>
//     Promise.resolve({
//       ok: true,
//       status: 200,
//       json: () => Promise.resolve({}),
//     })
//   )
// );

//jest.mock("node-fetch", () => jest.fn());

describe("RequestResultService", () => {
  beforeAll(async () => {
    await initializeRepositories();
    // await RequestResultService.initializeRepository();
  });

  afterEach(async () => {
    await RequestResultService.clearRepository();
    // jest.resetAllMocks();
    // jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe("checkUrl", () => {
    it("should return a RequestResult object with a 200 status code and the correct response time", async () => {
      const url = "https://www.youtube.com";

      jest.mock("node-fetch", () =>
        jest.fn(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
          })
        )
      );

      // const startTimer = Date.now();
      const requestResult = await RequestResultService.checkUrl(url);
      // const endTimer = Date.now();

      expect(requestResult).toBeInstanceOf(RequestResult);
      expect(requestResult.statusCode).toEqual(200);
      // expect(requestResult.duration).toEqual(endTimer - startTimer);
    });

    it("should throw an error if the request times out", async () => {
      const url = "https://www.youtube.com";

      jest.mock("node-fetch", () =>
        jest.fn(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
          })
        )
      );

      await expect(RequestResultService.checkUrl(url, 0)).rejects.toThrowError(
        "Request Timeout"
      );
    });

    // it("should throw an error if the fetch fails", async () => {
    //   const url = "http://invalid-url.com";

    //   await expect(RequestResultService.checkUrl(url)).rejects.toThrowError(
    //     "Fetch Failed"
    //   );
    // });

    it("should throw an error if the fetch fails", async () => {
      // Use a mock implementation of the fetch method that always throws an error
      global.fetch = jest.fn(() => {
        throw new TypeError("fetch failed");
      });

      const url = "https://example.com";
      const timeout = 5000;

      await expect(RequestResultService.checkUrl(url, timeout)).rejects.toThrow(
        "Fetch Failed"
      );
    });
  });
});
