export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const SERVER_IS_KO_ERROR_MESSAGE_LINE1 = "Oops!";

export const SERVER_IS_KO_ERROR_MESSAGE_LINE2 =
  "It seems that something went wrong. Please try again";
