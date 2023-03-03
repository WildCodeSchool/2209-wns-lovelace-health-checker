export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const SERVER_IS_KO_ERROR_MESSAGE =
  "Oops, it seems that something went wrong. Please try again";

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
