import * as HttpCookies from "./http-cookies";

describe("Utils http-cookies", () => {
  it("returns undefined when no raw cookie", () => {
    const ctx: any = { req: { headers: { cookie: "" } } };
    expect(HttpCookies.getSessionIdInCookie(ctx)).toBeUndefined();
  });
  it("returns undefined when cookie is incorrectly formatted", () => {
    const ctx: any = { req: { headers: { cookie: "12" } } };
    expect(HttpCookies.getSessionIdInCookie(ctx)).toBeUndefined();
  });
  it("returns sessionId when cookie is correct", () => {
    const ctx: any = { req: { headers: { cookie: "sessionId=123" } } };
    expect(HttpCookies.getSessionIdInCookie(ctx)).toBe("123");
  });
});
