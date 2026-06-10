import { Role, Portal } from '@prisma/client';

// This is the decoded JWT payload shape.
// auth-service signs a token with these fields.
// api-gateway's JwtAuthGuard decodes it and attaches
// it to every request. Controllers read it via @CurrentUser().
export interface UserPayload {
  sub: string;      // user.id — "sub" is the JWT standard field
  email: string;
  role: Role;
  portal: Portal;
  iat?: number;     // issued-at (added by JWT automatically)
  exp?: number;     // expiry
}