import * as HttpCookies from "./http-cookies";
import { Request } from "express";

describe("Utils http-cookies", () => {
  it("returns undefined when no raw cookie", () => {
    const req = { headers: { cookie: "" } } as Request;
    expect(
      HttpCookies.getSessionIdInCookie(req.headers.cookie)
    ).toBeUndefined();
  });
  it("returns undefined when cookie is incorrectly formatted", () => {
    const req = { headers: { cookie: "12" } } as Request;
    expect(
      HttpCookies.getSessionIdInCookie(req.headers.cookie)
    ).toBeUndefined();
  });
  it("returns sessionId when cookie is correct", () => {
    const req = { headers: { cookie: "sessionId=123" } } as Request;
    expect(HttpCookies.getSessionIdInCookie(req.headers.cookie)).toBe("123");
  });
});
