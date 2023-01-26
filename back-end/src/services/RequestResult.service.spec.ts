import RequestResultService from "./RequestResult.service";
import RequestResult from "../entities/RequestResult.entity";
import {
  closeConnection,
  getDatabase,
  initializeRepositories,
} from "../database/utils";

beforeAll(async () => {
  await getDatabase();
  await initializeRepositories();
});

afterAll(async () => {
  await closeConnection();
});

describe("RequestResultService", () => {
  describe("checkUrl", () => {
    const url = "https://www.youtube.com";
    it("should return a RequestResult object with a 200 status code", async () => {
      jest.mock("node-fetch", () =>
        jest.fn(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
          })
        )
      );

      const requestResult = await RequestResultService.checkUrl(url);

      expect(requestResult).toBeInstanceOf(RequestResult);
      expect(requestResult.statusCode).toEqual(200);
    });

    it("should throw an error if the request times out", async () => {

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

    it("should throw an error if the fetch fails", async () => {
      // Use a mock implementation of the fetch method that always throws an error
      global.fetch = jest.fn(() => {
        throw new TypeError("fetch failed");
      });

      const url = "https://example.com";

      await expect(RequestResultService.checkUrl(url)).rejects.toThrow(
        "Fetch Failed"
      );
    });
  });
});
