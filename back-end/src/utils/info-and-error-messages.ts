export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

/* ERROR */
export const UNABLE_TO_FIND_USER_FROM_CONTEXT =
  "Unable to find user from global context";
export const UNAUTHORIZED = "Unauthorized";
export const REQUEST_DOESNT_EXIST = "Request doesn't exist";
export const URL_ALREADY_EXISTS = "This URL already exists";
export const NAME_ALREADY_EXISTS = "This name already exists";
export const ARGUMENT_VALIDATION_ERROR = "Argument Validation Error";
export const FORM_CONTAINS_ERRORS =
  "Your form contains one or more errors. Please check your input values";
export const FREQUENCY_ONLY_FOR_PREMIUM_USERS =
  "This frequency is only useable by Premium users";
export const ALERTS_ONLY_FOR_PREMIUM_USERS =
  "Non Premium users can't use custom error alerts";
export const INCORRECT_HEADER_FORMAT = "Headers format is incorrect";
export const SESSION_NOT_FOUND = "Session not found";

/* INFO */
export const SIGN_OUT_SUCCESS = "You've been signed out securely";
export const PASSWORD_CHANGE_SUCCESS =
  "Your password has been updated successfully";
