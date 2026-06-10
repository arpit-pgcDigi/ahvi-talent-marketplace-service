export const AUTH_PATTERNS = {
  REGISTER:       'auth.register',
  LOGIN:          'auth.login',
  VALIDATE_TOKEN: 'auth.validate_token',
  GET_USER_BY_ID: 'auth.get_user_by_id',
} as const;

export type AuthPattern = typeof AUTH_PATTERNS[keyof typeof AUTH_PATTERNS];