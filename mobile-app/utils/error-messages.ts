export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const SERVER_IS_KO_ERROR_MESSAGE =
  "Oops, it seems that something went wrong. Please try again";
