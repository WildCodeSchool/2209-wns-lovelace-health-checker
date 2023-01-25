import * as HttpCookies from "./http-cookies";

describe("Utils http-cookies", () => {
  it("returns undefined when no raw cookie", () => {
    const ctx: any = { req: { headers: { cookie: "" } } };
    expect(HttpCookies.getSessionIdInCookie(ctx)).toBe(undefined);
  });
});
