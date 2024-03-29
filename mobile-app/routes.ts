export const HOMEPAGE_ROUTE = "/";
export const SIGN_UP_ROUTE = "/sign-up";
export const SIGN_IN_ROUTE = "/sign-in";
export const REQUESTS_ROUTE = "/requests";
export const REQUEST_CREATION_ROUTE = "/request-creation";
export const PREMIUM_ROUTE = "/premium";
export const ACCOUNT_ROUTE = "/account";
export const TERMS_ROUTE = "/terms";
export const FORGOT_PASSWORD_ROUTE = "/forgot-password";

export const RESET_PASSWORD_ROUTE = `${process.env.REACT_APP_RESET_PASSWORD_ROUTE}`;
export const RESET_PASSWORD_WITH_TOKEN_ROUTE = `${RESET_PASSWORD_ROUTE}/:resetPasswordToken`;

export const ACCOUNT_CONFIRMATION_ROUTE = `${process.env.REACT_APP_ACCOUNT_CONFIRMATION_ROUTE}`;
export const ACCOUNT_CONFIRMATION_WITH_TOKEN_ROUTE = `${ACCOUNT_CONFIRMATION_ROUTE}/:confirmationToken`;

export const RESET_EMAIL_ROUTE = `${process.env.REACT_APP_RESET_EMAIL_ROUTE}`;
export const RESET_EMAIL_WITH_TOKEN_ROUTE = `${ACCOUNT_CONFIRMATION_ROUTE}/:confirmationToken`;
