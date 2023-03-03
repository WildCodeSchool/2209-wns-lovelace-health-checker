import RequestResultService from "./RequestResult.service";

import {
  closeConnection,
  getDatabase,
  initializeRepositories,
} from "../../database/utils";
import RequestResult from "../../entities/RequestResult.entity";

beforeAll(async () => {
  await getDatabase();
  await initializeRepositories();
});

afterAll(async () => {
  await closeConnection();
});

describe("RequestResultService", () => {
  describe("checkUrlForHomepage", () => {
    const url = "https://www.youtube.com";
    it("should return a RequestResult object with a 200 status code", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({}), {
            status: 200,
          })
        )
      );

      const requestResult = await RequestResultService.checkUrlForHomepage(url);

      expect(requestResult).toBeInstanceOf(RequestResult);
      expect(requestResult.statusCode).toEqual(200);
      expect(fetch).toHaveBeenCalled();
    });

    it("should throw an error if the request times out", async () => {
      global.fetch = jest.fn(() => {
        throw new DOMException("", "AbortError");
      });

      await expect(
        RequestResultService.checkUrlForHomepage(url)
      ).rejects.toThrowError("Request Timeout");
      expect(fetch).toHaveBeenCalled();
    });

    it("should throw an error if the fetch fails", async () => {
      global.fetch = jest.fn(() => {
        throw new TypeError("fetch failed");
      });

      const url = "https://example.com";

      await expect(
        RequestResultService.checkUrlForHomepage(url)
      ).rejects.toThrow("Fetch Failed");
      expect(fetch).toHaveBeenCalled();
    });
  });
});
