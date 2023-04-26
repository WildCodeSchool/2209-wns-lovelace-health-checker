export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

/* ERROR */
export const UNAUTHORIZED = "Unauthorized";
export const REQUEST_DOESNT_EXIST = "Request doesn't exist";
export const URL_ALREADY_EXISTS = "This URL already exists";
export const NAME_ALREADY_EXISTS = "This name already exists";
export const EMAIL_ALREADY_USED = "This email is already used";
export const ARGUMENT_VALIDATION_ERROR = "Argument Validation Error";
export const FORM_CONTAINS_ERRORS =
  "Your form contains one or more errors. Please check your input values";
export const FREQUENCY_ONLY_FOR_PREMIUM_USERS =
  "This frequency is only useable by Premium users";
export const ALERTS_ONLY_FOR_PREMIUM_USERS =
  "Non Premium users can't use custom error alerts";
export const INCORRECT_HEADER_FORMAT = "Headers format is incorrect";
export const SESSION_NOT_FOUND = "Session not found";
export const USER_NOT_FOUND = "User not found";
export const ACCOUNT_ALREADY_ACTIVE = "Account already active";
export const INVALID_CONFIRMATION_TOKEN = "Invalid confirmation token";
export const NO_EMAIL_AWAITING_CONFIRMATION = "No email awaiting confirmation";
export const INVALID_EMAIL_CONFIRMATION_TOKEN =
  "Invalid email confirmation token";
export const INCORRECT_CREDENTIALS = "Incorrect credentials";
export const ACCOUNT_NOT_ACTIVE =
  "Your account is not active, click on the link in your email to activate it";
export const INVALID_RESET_PASSWORD_TOKEN =
  "Your reset password token is no longer valid";
export const INCORRECT_CURRENT_PASSWORD = "Incorrect current password";

/* INFO */
export const SIGN_OUT_SUCCESS = "You've been signed out securely";
export const PASSWORD_CHANGE_SUCCESS_AND_DISCONNECTED =
  "Your password has been updated successfully. You have been disconnected from all your other devices";
export const PASSWORD_CHANGE_SUCCESS =
  "Your password has been updated successfully";
export const ACTION_DONE_SUCCESSFULLY =
  "Your request has been processed successfully";
export const ACTION_DONE_SUCCESSFULLY_CHECK_INBOX =
  "Your request has been processed successfully. Please, check your inbox to confirm your email !";
export const IF_EMAIL_EXISTS_CHECK_INBOX =
  "If this email address exists, you'll receive an email to regenerate your password. Check your inbox.";
