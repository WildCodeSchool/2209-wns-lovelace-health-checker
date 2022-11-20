export const ERROR_NO_USER_SIGNED_IN = "Utilisateur non connecté.";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
