import { parse } from "cookie";
import { Context } from "..";

const MAX_AGE_DAYS = 365;

export const setSessionIdInCookie = (ctx: Context, sessionId: string) => {
  ctx.res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * MAX_AGE_DAYS,
  });
};

export const getSessionIdInCookie = (
  cookie: string | undefined
): string | undefined => {
  const rawCookies = cookie;

  if (!rawCookies) {
    return undefined;
  }
  const parsedCookies = parse(rawCookies);
  return parsedCookies.sessionId;
};

export const deleteSessionIdInCookie = (ctx: Context) => {
  ctx.res.clearCookie("sessionId");
};
